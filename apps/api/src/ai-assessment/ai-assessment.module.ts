
import { Module } from '@nestjs/common';
import { AiAssessmentService } from './ai-assessment.service.js';

@Module({
  providers: [AiAssessmentService],
  exports: [AiAssessmentService],
})
export class AiAssessmentModule {}
