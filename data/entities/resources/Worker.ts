import { ChildEntity, JoinTable, ManyToMany } from "typeorm";

import { WorkerRole } from "../WorkerRole";
import { Resource } from "./Resource";

@ChildEntity()
export class Worker extends Resource {
  @ManyToMany(() => WorkerRole, (workerRole) => workerRole.workers)
  @JoinTable()
  roles!: WorkerRole[];
}
