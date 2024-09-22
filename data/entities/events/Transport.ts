import { ChildEntity, Entity, ManyToOne } from "typeorm";

import { TransportSystem } from "../TransportSystem";
import { Event, EventSeverity } from "./Event";

@Entity()
@ChildEntity()
export class TransportEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Low;

  @ManyToOne(() => TransportSystem, (transportSystem) => transportSystem.events)
  transportSystem!: TransportSystem;
}
