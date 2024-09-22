import { ChildEntity } from "typeorm";

import { Resource } from "./Resource";

@ChildEntity()
export class Machine extends Resource {}
