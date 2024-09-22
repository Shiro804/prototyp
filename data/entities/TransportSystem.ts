import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { TransportEvent } from "./events/Transport";
import { Inventory } from "./Inventory";
import { ProcessStep } from "./ProcessStep";

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
  @Column()
  name!: string;

  @Column({
    type: "simple-enum",
    enum: TransportSystemStatus,
    default: TransportSystemStatus.Operational,
  })
  status!: TransportSystemStatus;

  @OneToOne(() => Inventory)
  @JoinColumn()
  inventory!: Inventory;

  @ManyToOne(() => ProcessStep, (processStep) => processStep.outputs)
  startStep!: ProcessStep;

  @ManyToOne(() => ProcessStep, (processStep) => processStep.inputs)
  endStep!: ProcessStep;

  @OneToMany(() => TransportEvent, (event) => event.transportSystem)
  events!: TransportEvent[];
}
