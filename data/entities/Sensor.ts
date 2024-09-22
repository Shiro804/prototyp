import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { Metric } from "./Metrics";
import { ProcessStep } from "./ProcessStep";

@Entity()
export class Sensor extends CommonEntity {
  @Column()
  name!: string;

  @ManyToOne(() => ProcessStep, (processStep) => processStep.sensors)
  processStep!: ProcessStep;

  @OneToMany(() => Metric, (metric) => metric.sensor)
  metrics!: Metric[];
}
