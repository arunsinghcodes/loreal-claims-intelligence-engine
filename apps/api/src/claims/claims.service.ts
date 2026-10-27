
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AssessClaimDto } from './dto/assess-claim.dto.js';

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  async assess(dto: AssessClaimDto) {
    const claim = await this.prisma.claim.create({
      data: {
        productName: dto.productName,
        description: dto.claim,
        submittedBy: dto.submittedBy,
      },
    });

    const assessment = await this.prisma.assessment.create({
      data: {
        claimId: claim.id,
        evidence: dto.evidence,
        status: 'PENDING',
      },
    });

    return {
      claimId: claim.id,
      assessmentId: assessment.id,
      status: assessment.status,
      message: 'Claim and evidence saved. AI assessment is not implemented yet.',
    };
  }
}
