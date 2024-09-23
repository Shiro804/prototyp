import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class CommonEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
