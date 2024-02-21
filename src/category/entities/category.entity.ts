import { Entry } from 'src/entry/entities/entry.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Entry, (entry) => entry.categories)
  entry: Entry;
}
