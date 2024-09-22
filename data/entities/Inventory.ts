import { Column, Entity, OneToMany } from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { Location } from "./Location";
import { InventoryEntry } from "./InventoryEntry";

@Entity()
export class Inventory extends CommonEntity {
  @Column()
  materialType!: string;

  @Column("int")
  quantity!: number;

  @OneToMany(() => Location, (location) => location.inventories)
  location!: Location;

  @OneToMany(() => InventoryEntry, (location) => location.inventory)
  entries!: InventoryEntry[];
}
