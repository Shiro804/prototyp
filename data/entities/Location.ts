import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";

import { CommonEntity } from "./CommonEntity";
import { GenericInventory } from "./Inventory";
import { ProcessStep } from "./ProcessStep";
import { Resource } from "./resources/Resource";

@Entity()
export class Location extends CommonEntity {
  @Property()
  name!: string;

  @Property()
  description?: string;

  @OneToMany(() => Resource, (resource) => resource.location)
  resources = new Collection<Resource>(this);

  @OneToMany(() => GenericInventory, (inventory) => inventory.location)
  genericInventories = new Collection<GenericInventory>(this);

  @OneToMany(() => ProcessStep, (processStep) => processStep.location)
  processSteps = new Collection<ProcessStep>(this);
}
