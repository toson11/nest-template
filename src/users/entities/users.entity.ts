import dayjs from "dayjs";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcryptjs'
import { Exclude } from "class-transformer";

@Entity("users")
export class UsersEntity {
  // @PrimaryGeneratedColumn()
  // id: number // 标记为主列，值自动生成
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10, unique: true })
  username: string;

  @Exclude() // 查询时不返回方法1: 结合 module 的 @UseInterceptors(ClassSerializerInterceptor) 使用
  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ type: 'tinyint' , default: 1 })
  role: number

  @Column({
    type: 'timestamp',
    name: 'create_time',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => new Date(value)
    }})
  createTime: Date;

  // CURRENT_TIMESTAMP 是一个 SQL 函数，返回当前的日期和时间。
  @Column({
    type: 'timestamp',
    name: 'update_time',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
      from: (value: string) => new Date(value)
    }})
  updateTime: Date;

  @BeforeInsert() 
  async encryptPwd() { 
    // this.password = bcrypt.hashSync(this.password || '123456'); 
  } 
}