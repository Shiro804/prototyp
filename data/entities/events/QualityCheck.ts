import { ChildEntity, Column, Entity, ManyToOne } from "typeorm";

import { Event, EventSeverity } from "./Event";
import { Resource } from "../resources/Resource";

enum QualityCheckResult {
  Pass,
  Fail,
}

@Entity()
@ChildEntity()
export class QualityCheckEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Critical;

  @Column({
    type: "simple-enum",
    enum: QualityCheckResult,
  })
  result!: QualityCheckResult;

  @ManyToOne(() => Resource, (resource) => resource.qualityChecks)
  resources!: Resource;
}
