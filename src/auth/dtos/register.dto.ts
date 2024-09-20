import { UserRole } from 'src/shared/constants/user.contants';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  readonly username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly nickname: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly avatar: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiPropertyOptional({ default: 1, enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role: UserRole;
}
