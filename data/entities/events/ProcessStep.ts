import { ChildEntity, Entity, ManyToOne } from "typeorm";

import { ProcessStep } from "../ProcessStep";
import { Event, EventSeverity } from "./Event";

@Entity()
@ChildEntity()
export class ProcessStepEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Medium;

  @ManyToOne(() => ProcessStep, (processStep) => processStep.events)
  processStep!: ProcessStep;
}
