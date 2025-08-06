import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LINK_TAG_CONFIG } from 'src/common/constants/validation.constants';

export class TagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_TAG_CONFIG.NAME_MAX_LENGTH)
  name: string;
}
