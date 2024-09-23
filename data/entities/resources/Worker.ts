import { Collection, Entity, ManyToMany } from "@mikro-orm/core";

import { Resource } from "./Resource";
import { WorkerRole } from "./WorkerRole";

@Entity()
export class Worker extends Resource {
  @ManyToMany()
  roles = new Collection<WorkerRole>(this);
}
