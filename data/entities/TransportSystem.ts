import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";

import { CommonEntity } from "./CommonEntity";
import { TransportEvent } from "./events/Transport";
import type { TransportSystemInventory } from "./Inventory";
import type { ProcessStep } from "./ProcessStep";

enum TransportSystemStatus {
  Operational,
  Maintenance,
  Offline,
  InTransit,
  Idle,
  Loading,
  Unloading,
}

@Entity()
export class TransportSystem extends CommonEntity {
  @Property()
  name!: string;

  @Enum()
  status: TransportSystemStatus = TransportSystemStatus.Operational;

  @OneToOne()
  inventory!: TransportSystemInventory;

  @ManyToOne()
  startStep!: ProcessStep;

  @ManyToOne()
  endStep!: ProcessStep;

  @OneToMany(
    () => TransportEvent,
    (transportEvent) => transportEvent.transportSystem
  )
  events = new Collection<TransportEvent>(this);
}
