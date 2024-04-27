import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  PREMIUM = 'premium',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @BeforeInsert()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
