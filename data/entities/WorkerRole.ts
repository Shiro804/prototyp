import { Column, Entity, ManyToMany } from "typeorm";
import { CommonEntity } from "./CommonEntity";
import { Worker } from "./Worker";

@Entity()
export class WorkerRole extends CommonEntity {
  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string | null;

  @ManyToMany(() => Worker, (worker) => worker.roles)
  workers!: Worker[];
}
