import { IsArray, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE_DESC_LENGTH, ROLE_NAME_LENGTH } from 'src/common/constants/validation.constants';

export class RoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
    minLength: ROLE_NAME_LENGTH.MIN,
    maxLength: ROLE_NAME_LENGTH.MAX,
  })
  @IsString()
  @IsNotEmpty()
  @Length(ROLE_NAME_LENGTH.MIN, ROLE_NAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: 'A brief description of the role',
    example: 'Administrator with full access rights',
    minLength: ROLE_DESC_LENGTH.MIN,
    maxLength: ROLE_DESC_LENGTH.MAX,
  })
  @IsString()
  @IsNotEmpty()
  @Length(ROLE_DESC_LENGTH.MIN, ROLE_DESC_LENGTH.MAX)
  description: string;

  @ApiProperty({
    description: 'Array of right IDs associated with the role',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  rights: number[];
}
