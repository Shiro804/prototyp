import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";

import { Sensor } from "./Sensor";

@Entity()
@TableInheritance({ column: "type" })
export abstract class Metric {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  @Index()
  timestamp!: Date;

  @Column()
  @Index()
  type!: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.metrics)
  sensor!: Sensor;
}

@ChildEntity()
export class ItemProcessed extends Metric {
  @Column()
  item!: string;

  @Column("int")
  quantity!: number;
}
