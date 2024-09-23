import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from "@mikro-orm/core";

import { CommonEntity } from "../CommonEntity";
import type { Worker } from "./Worker";

@Entity()
export class WorkerRole extends CommonEntity {
  @Property()
  @Unique()
  name!: string;

  @Property()
  description?: string;

  @ManyToMany()
  workers = new Collection<Worker>(this);
}
