import { Entity, ManyToOne } from "@mikro-orm/core";

import type { ProcessStep } from "../ProcessStep";
import { Event, EventSeverity } from "./Event";

@Entity()
export class ProcessStepEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Medium;

  @ManyToOne()
  processStep!: ProcessStep;
}
