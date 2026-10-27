import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller.js';
import { ClaimsService } from './claims.service.js';
import { AiAssessmentModule } from '../ai-assessment/ai-assessment.module.js';

@Module({
  imports: [AiAssessmentModule],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}