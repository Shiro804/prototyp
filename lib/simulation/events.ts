export abstract class Event {
  constructor(
    public readonly timestamp: Date,
    public readonly message: string
  ) {}
}

export class ExceptionEvent extends Event {}

export class ProcessStepEvent extends Event {
  constructor(
    timestamp: Date,
    message: string,
    public readonly processStepId: number
  ) {
    super(timestamp, message);
  }
}

export class QualityCheckEvent extends Event {
  constructor(
    timestamp: Date,
    message: string,
    public readonly result: boolean,
    public readonly resourceId: number
  ) {
    super(timestamp, message);
  }
}

export class TransportEvent extends Event {
  constructor(
    timestamp: Date,
    message: string,
    public readonly transportSystemId: number
  ) {
    super(timestamp, message);
  }
}
