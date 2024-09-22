import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from "typeorm";

import { CommonEntity } from "../CommonEntity";
import { Location } from "../Location";
import { ProcessStep } from "../ProcessStep";
import { QualityCheckEvent } from "../events/QualityCheck";

export enum ResourceStatus {
  Active,
  Inactive,
}

@Entity()
@TableInheritance({ column: "type" })
export abstract class Resource extends CommonEntity {
  @Column()
  type!: string;

  @Column({ nullable: true })
  name!: string | null;

  @Column({
    type: "simple-enum",
    enum: ResourceStatus,
    default: ResourceStatus.Active,
  })
  status!: ResourceStatus;

  @ManyToOne(() => Location, (location) => location.resources)
  location!: Location;

  @Column({ nullable: true })
  @ManyToOne(() => ProcessStep, (processStep) => processStep.resources)
  processStep: ProcessStep | null = null;

  @OneToMany(() => QualityCheckEvent, (event) => event.resources)
  qualityChecks!: QualityCheckEvent[];
}
