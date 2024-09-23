import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { CommonEntity } from "../CommonEntity";
import type { Location } from "../Location";
import type { ProcessStep } from "../ProcessStep";
import { QualityCheckEvent } from "../events/QualityCheck";

export enum ResourceStatus {
  Active,
  Inactive,
}

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Resource extends CommonEntity {
  @Property()
  type!: string;

  @Property()
  name?: string;

  @Enum()
  status: ResourceStatus = ResourceStatus.Active;

  @ManyToOne()
  location!: Location;

  @ManyToOne()
  processStep?: ProcessStep;

  @OneToMany(() => QualityCheckEvent, (event) => event.resource)
  qualityChecks = new Collection<QualityCheckEvent>(this);
}
