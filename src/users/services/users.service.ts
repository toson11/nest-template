import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';

export interface UsersRo {
  list: UsersEntity[];
  total: number;
}
@Injectable()
export class UsersService {
  constructor(
    // 注入创建Users实例
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async add(user: Partial<UsersEntity>) {
    const { username } = user;
    if(!username) {
      throw new HttpException("缺少用户账号", HttpStatus.BAD_REQUEST)
    }
    const _user = await this.usersRepository.findOne({ where: { username }});
    if(_user) {
      throw new HttpException('用户已存在', HttpStatus.CONFLICT)
    }
    return this.usersRepository.save(user)
  }

  async getAll(query): Promise<UsersRo> {
    // 创建查询构建器，指定查询表名为user
    const qb = await this.usersRepository.createQueryBuilder('user')
    qb.where('1 = 1');
    qb.orderBy('user.createTime', 'DESC');

    const total = await qb.getCount()
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const users = await qb.getMany();
    return { list: users, total }
  }

  async getById(id): Promise<UsersEntity> {
    const existUser = await this.usersRepository.findOneBy({ id })
    console.log("🚀 ~ UsersService ~ getById ~ existUser:", existUser)
    if(!existUser) {
      throw new HttpException("用户不存在", HttpStatus.NOT_FOUND);
    }
    return existUser
  }

  async updateById(id, user): Promise<UsersEntity> {
    const existUser = await this.usersRepository.findOneBy({ id })
    if(!existUser) {
      throw new HttpException("用户不存在", HttpStatus.NOT_FOUND);
    }
    const updateUser = this.usersRepository.merge(existUser, user);
    console.log("🚀 ~ UsersService ~ updateById ~ updateUser:", updateUser)
    return this.usersRepository.save(updateUser)
  }

  async delete(id) {
    const existUser = await this.usersRepository.findOneBy({ id });
    if(!existUser) {
      throw new HttpException("用户不存在", HttpStatus.NOT_FOUND);
    }
    return this.usersRepository.remove(existUser)
  }
}
