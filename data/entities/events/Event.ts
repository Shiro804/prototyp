import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

export enum EventSeverity {
  Low,
  Medium,
  Critical,
}

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class Event {
  @PrimaryKey()
  id!: number;

  @Property()
  timestamp: Date = new Date();

  @Property()
  details?: string;

  @Property()
  type!: string;

  abstract readonly severity: EventSeverity;
}
