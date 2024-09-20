import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersRo, UsersService } from '../services/users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddUserDto, getAllUserDto, updateUserDto } from '../dtos/users.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("用户")
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor) // 过滤接口返回数据库字段
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  @ApiOperation({ summary: "创建用户" })
  @Post()
  async add(@Body() user: AddUserDto) {
    return this.usersService.add(user)
  }

  @ApiOperation({ summary: "获取用户列表" })
  @ApiBearerAuth() // swagger文档设置token
  @Post('search')
  async getAll(@Body() params: getAllUserDto): Promise<UsersRo> {
    return this.usersService.getAll(params)
  }

  @ApiOperation({ summary: "获取单个用户" })
  @Get(':id')
  async get(@Param('id') id) {
    return this.usersService.getById(id)
  }

  @ApiOperation({ summary: "修改用户" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: updateUserDto) {
    return this.usersService.updateById(id, params)
  }

  @ApiOperation({ summary: "删除用户" })
  @Delete(":id")
  async delete(@Param("id") id) {
    return this.usersService.delete(id)
  }
}
