import { ChildEntity, Entity } from "typeorm";

import { Event, EventSeverity } from "./Event";

@Entity()
@ChildEntity()
export class ExceptionEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Critical;
}
