import { AfterLoad, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
