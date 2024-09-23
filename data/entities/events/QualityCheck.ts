import { Entity, Enum, ManyToOne } from "@mikro-orm/core";

import type { Resource } from "../resources/Resource";
import { Event, EventSeverity } from "./Event";

enum QualityCheckResult {
  Pass,
  Fail,
}

@Entity()
export class QualityCheckEvent extends Event {
  readonly severity: EventSeverity = EventSeverity.Critical;

  @Enum()
  result!: QualityCheckResult;

  @ManyToOne()
  resource!: Resource;
}
