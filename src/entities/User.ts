import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  name?: string;

  @Column()
  lastname?: string;

  @Column({
    unique: true,
  })
  email?: string;

  @Column()
  password?: string;
}
