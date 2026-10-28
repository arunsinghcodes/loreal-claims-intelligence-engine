import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AssessClaimDto } from './dto/assess-claim.dto.js';
import { ClaimsService } from './claims.service.js';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post('assess')
  async assess(@Body() dto: AssessClaimDto) {
    return this.claimsService.assess(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('verdict') verdict?: string,
  ) {
    return this.claimsService.findAll(
      page === undefined ? 1 : Number(page),
      limit === undefined ? 10 : Number(limit),
      search,
      verdict,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.claimsService.findById(id);
  }
}
