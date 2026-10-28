import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AssessClaimDto } from './dto/assess-claim.dto.js';
import { AiAssessmentService } from '../ai-assessment/ai-assessment.service.js';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAssessmentService: AiAssessmentService,
  ) {}

  async assess(dto: AssessClaimDto) {
    // 1. Persist the claim and evidence before calling the AI.
    const { claim, assessment } = await this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          productName: dto.productName,
          description: dto.claim,
          submittedBy: dto.submittedBy,
        },
      });

      const assessment = await tx.assessment.create({
        data: {
          claimId: claim.id,
          evidence: dto.evidence,
          status: 'PENDING',
        },
      });

      return { claim, assessment };
    });

    // 2. Ask Gemini to assess the claim against the supplied evidence.
    let result;

    try {
      result = await this.aiAssessmentService.assess(
        claim.description,
        assessment.evidence,
      );
    } catch {
      // Preserve the original claim and evidence if AI assessment fails.
      try {
        await this.prisma.assessment.update({
          where: { id: assessment.id },
          data: { status: 'FAILED' },
        });
      } catch {
        // Do not expose database or provider internals to the client.
      }

      throw new ServiceUnavailableException(
        'Claim was saved, but AI assessment failed. Please retry later.',
      );
    }

    // 3. Persist the assessment result.
    try {
      const completedAssessment = await this.prisma.assessment.update({
        where: { id: assessment.id },
        data: {
          verdict: result.verdict,
          confidenceScore: result.confidenceScore,
          reasoning: result.reasoning,
          limitations: result.limitations,
          status: 'COMPLETED',
          model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
          promptVersion: 'v1',
          completedAt: new Date(),
        },
      });

      return {
        claimId: claim.id,
        assessmentId: completedAssessment.id,
        status: completedAssessment.status,
        verdict: completedAssessment.verdict,
        confidenceScore: completedAssessment.confidenceScore,
        reasoning: completedAssessment.reasoning,
        limitations: completedAssessment.limitations,
        message:
          'AI assessment completed. Human review is required before any scientific or regulatory approval.',
      };
    } catch {
      throw new InternalServerErrorException(
        'AI assessment ran, but its result could not be saved. Please check the assessment record before retrying.',
      );
    }
  }

  async findById(id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} was not found`);
    }

    return claim;
  }

  async findAll(page = 1, limit = 10, search?: string, verdict?: string) {
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const normalizedSearch = search?.trim();
    const validVerdicts = ['JUSTIFIED', 'NOT_JUSTIFIED', 'INCONCLUSIVE'];
    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED'];

    if (
      verdict &&
      !validVerdicts.includes(verdict) &&
      !validStatuses.includes(verdict)
    ) {
      throw new (await import('@nestjs/common')).BadRequestException(
        'Invalid verdict or status filter',
      );
    }

    const where = {
      ...(normalizedSearch
        ? {
            OR: [
              {
                productName: {
                  contains: normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
              {
                description: {
                  contains: normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
              {
                id: {
                  contains: normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
      ...(verdict
        ? {
            assessments: {
              some: {
                // Match the latest assessment, not an older result.
                id: {
                  in: (
                    await this.prisma.assessment.findMany({
                      where: {
                        status: { in: validStatuses as never[] },
                      },
                      distinct: ['claimId'],
                      orderBy: { createdAt: 'desc' },
                      select: {
                        id: true,
                        claimId: true,
                        status: true,
                        verdict: true,
                      },
                    })
                  )
                    .filter((assessment) =>
                      validStatuses.includes(verdict)
                        ? assessment.status === verdict
                        : assessment.verdict === verdict,
                    )
                    .map((assessment) => assessment.id),
                },
              },
            },
          }
        : {}),
    };

    const [claims, total] = await this.prisma.$transaction([
      this.prisma.claim.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          productName: true,
          description: true,
          submittedBy: true,
          createdAt: true,
          updatedAt: true,
          assessments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              verdict: true,
              confidenceScore: true,
              createdAt: true,
              completedAt: true,
            },
          },
        },
      }),
      this.prisma.claim.count({ where }),
    ]);

    return {
      data: claims,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}
