
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AssessClaimDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  productName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  claim: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(50000)
  evidence: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  submittedBy?: string;
}
