import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "@mikro-orm/core";

import { CommonEntity } from "./CommonEntity";
import { InventoryEntry } from "./InventoryEntry";
import type { Location } from "./Location";
import { ProcessStep } from "./ProcessStep";
import { TransportSystem } from "./TransportSystem";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Inventory extends CommonEntity {
  @OneToMany(() => InventoryEntry, (inventoryEntry) => inventoryEntry.inventory)
  entries = new Collection<InventoryEntry>(this);
}

@Entity()
export class GenericInventory extends Inventory {
  @ManyToOne()
  location!: Location;
}

@Entity()
export class TransportSystemInventory extends Inventory {
  @OneToOne(
    () => TransportSystem,
    (transportSystem) => transportSystem.inventory,
    {
      orphanRemoval: true,
    }
  )
  transportSystem!: TransportSystem;
}

@Entity()
export class ProcessStepInventory extends Inventory {
  @OneToOne(() => ProcessStep, (processStep) => processStep.inventory, {
    orphanRemoval: true,
  })
  processStep!: ProcessStep;
}
