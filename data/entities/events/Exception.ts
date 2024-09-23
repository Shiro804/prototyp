import { Entity } from "@mikro-orm/core";

import { Event, EventSeverity } from "./Event";

@Entity()
export class ExceptionEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Critical;
}
