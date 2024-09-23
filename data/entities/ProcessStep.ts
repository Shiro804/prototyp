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
import { ProcessStepEvent } from "./events/ProcessStep";
import type { ProcessStepInventory } from "./Inventory";
import type { Location } from "./Location";
import { Resource } from "./resources/Resource";
import { Sensor } from "./Sensor";
import { TransportSystem } from "./TransportSystem";

enum ProcessStepStatus {
  Pending,
  InProgress,
  Complete,
}

@Entity()
export class ProcessStep extends CommonEntity {
  @Property()
  name!: string;

  @Enum()
  status: ProcessStepStatus = ProcessStepStatus.Pending;

  @OneToMany(() => Resource, (resource) => resource.processStep)
  resources = new Collection<Resource>(this);

  @ManyToOne()
  location!: Location;

  @OneToMany(
    () => TransportSystem,
    (transportSystem) => transportSystem.startStep
  )
  outputs = new Collection<TransportSystem>(this);

  @OneToMany(
    () => TransportSystem,
    (transportSystem) => transportSystem.endStep
  )
  inputs = new Collection<TransportSystem>(this);

  @OneToMany(
    () => ProcessStepEvent,
    (processStepEvent) => processStepEvent.processStep
  )
  events = new Collection<ProcessStepEvent>(this);

  @OneToMany(() => Sensor, (sensor) => sensor.processStep)
  sensors = new Collection<Sensor>(this);

  @OneToOne()
  inventory!: ProcessStepInventory;
}
