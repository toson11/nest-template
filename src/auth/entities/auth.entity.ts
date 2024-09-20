import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcryptjs'
import { UserRole } from "src/shared/constants/user.contants";
import { Exclude } from "class-transformer";

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100, nullable: true })
  nickname: string;  //昵称

  @Exclude() // 查询时不返回方法1: 结合 module 的 @UseInterceptors(ClassSerializerInterceptor) 使用
  @Column({ select: false }) // 查询时不返回方法2
  password: string;  // 密码

  @Column({ nullable: true })
  avatar: string;   //头像

  @Column({ nullable: true })
  email: string;

  @Column({ default: UserRole.USER })
  role: number;   // 用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;
  
  @BeforeInsert() 
  async encryptPwd() { 
    this.password = bcrypt.hashSync(this.password); 
  } 
}
