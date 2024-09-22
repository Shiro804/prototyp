import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { ProcessStepEvent } from "./events/ProcessStep";
import { Location } from "./Location";
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
  @Column()
  name!: string;

  @Column({
    type: "simple-enum",
    enum: ProcessStepStatus,
    default: ProcessStepStatus.Pending,
  })
  status!: ProcessStepStatus;

  @OneToMany(() => Resource, (resource) => resource.processStep)
  resources!: Resource[];

  @ManyToOne(() => Location, (location) => location.processSteps)
  location!: Location;

  @OneToMany(
    () => TransportSystem,
    (transportSystem) => transportSystem.startStep
  )
  outputs!: TransportSystem[];

  @OneToMany(
    () => TransportSystem,
    (transportSystem) => transportSystem.endStep
  )
  inputs!: TransportSystem[];

  @OneToMany(() => ProcessStepEvent, (event) => event.processStep)
  events!: ProcessStepEvent[];

  @OneToMany(() => Sensor, (sensor) => sensor.processStep)
  sensors!: Sensor[];
}
