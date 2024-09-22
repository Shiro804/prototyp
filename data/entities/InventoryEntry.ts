import { Column, Entity, ManyToOne, Unique } from "typeorm";

import { CommonEntity } from "./CommonEntity";
import { Inventory } from "./Inventory";

@Entity()
@Unique(["materialType", "inventory"])
export class InventoryEntry extends CommonEntity {
  @Column()
  materialType!: string;

  @Column("int")
  quantity!: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.entries)
  inventory!: Inventory;
}
