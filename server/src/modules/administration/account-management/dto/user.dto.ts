import { IsArray, IsInt, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_NAME_LENGTH } from 'src/common/constants/validation.constants';

export class UserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: ACCOUNT_NAME_LENGTH.MIN,
    maxLength: ACCOUNT_NAME_LENGTH.MAX,
  })
  @IsString()
  @Length(ACCOUNT_NAME_LENGTH.MIN, ACCOUNT_NAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: 'Array of role IDs assigned to the user',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}
