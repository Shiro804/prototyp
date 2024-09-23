import { Entity, ManyToOne } from "@mikro-orm/core";

import type { TransportSystem } from "../TransportSystem";
import { Event, EventSeverity } from "./Event";

@Entity()
export class TransportEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Low;

  @ManyToOne()
  transportSystem!: TransportSystem;
}
