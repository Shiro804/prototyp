import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { CommonEntity } from "./CommonEntity";
import { Metric } from "./Metrics";
import type { ProcessStep } from "./ProcessStep";

@Entity()
export class Sensor extends CommonEntity {
  @Property()
  name!: string;

  @ManyToOne()
  processStep!: ProcessStep;

  @OneToMany(() => Metric, (metric) => metric.sensor)
  metrics = new Collection<Metric>(this);
}
