import { Entity, ManyToOne, Property, types, Unique } from "@mikro-orm/core";

import { CommonEntity } from "./CommonEntity";
import type { Inventory } from "./Inventory";

@Entity()
@Unique({ properties: ["materialType", "inventory"] })
export class InventoryEntry extends CommonEntity {
  @Property()
  materialType!: string;

  @Property({ type: types.integer })
  quantity!: number;

  @ManyToOne()
  inventory!: Inventory;
}
