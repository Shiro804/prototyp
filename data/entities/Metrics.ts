import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from "@mikro-orm/core";

import type { Sensor } from "./Sensor";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
@Index({ properties: ["timestamp", "type"] })
export abstract class Metric {
  @PrimaryKey()
  id!: number;

  @Property()
  timestamp: Date = new Date();

  @Property()
  type!: string;

  @ManyToOne()
  sensor!: Sensor;
}

@Entity()
export class ItemProcessed extends Metric {
  @Property()
  item!: string;

  @Property({ type: types.integer })
  quantity!: number;
}
