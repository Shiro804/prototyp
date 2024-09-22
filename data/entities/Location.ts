import { Column, Entity, OneToMany } from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { Resource } from "./resources/Resource";
import { Inventory } from "./Inventory";
import { ProcessStep } from "./ProcessStep";

@Entity()
export class Location extends CommonEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description: string | null = null;

  @OneToMany(() => Resource, (resource) => resource.location)
  resources!: Resource[];

  @OneToMany(() => Inventory, (inventory) => inventory.location)
  inventories!: Inventory[];

  @OneToMany(() => ProcessStep, (processStep) => processStep.location)
  processSteps!: ProcessStep[];
}
