import { Entity } from "@mikro-orm/core";

import { Resource } from "./Resource";

@Entity()
export class Machine extends Resource {}
