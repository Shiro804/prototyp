import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  TableInheritance,
} from "typeorm";

export enum EventSeverity {
  Low,
  Medium,
  Critical,
}

@Entity()
@TableInheritance({ column: "type" })
export abstract class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ nullable: true })
  details!: string | null;

  @Column()
  type!: string;

  abstract readonly severity: EventSeverity;
}
