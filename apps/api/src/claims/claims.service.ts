import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AssessClaimDto } from './dto/assess-claim.dto.js';
import { AiAssessmentService } from '../ai-assessment/ai-assessment.service.js';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAssessmentService: AiAssessmentService,
  ) {}

  async assess(dto: AssessClaimDto) {
    // 1. Persist the claim and evidence before calling the AI.
    const { claim, assessment } = await this.prisma.$transaction(
      async (tx) => {
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
      },
    );

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
}