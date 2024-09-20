import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { UserRole } from "src/shared/constants/user.contants";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddUserDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: "密码" })
  @IsString()
  readonly password: string;

  @ApiPropertyOptional({ description: '角色', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  readonly email: string;
}

export class updateUserDto extends PartialType(AddUserDto) {
}

export class getAllUserDto {
  @ApiPropertyOptional({ description: '分页大小', default: 1 })
  @IsNotEmpty({ message: "分页大小不能为空" })
  @IsNumber({}, { message:"pageNum必须为数字"})
  readonly pageNum: number;
  
  @ApiPropertyOptional({ description: '当前分页', default: 10 })
  @IsNumber({}, { message:"pageSize必须为数字"})
  readonly pageSize: number;
}