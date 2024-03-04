import { Entry } from 'src/entry/entities/entry.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @OneToMany(() => Entry, (entry) => entry.category)
  entry: Entry;
}
