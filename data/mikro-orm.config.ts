import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Options, SqliteDriver } from "@mikro-orm/sqlite";

import { CommonEntity } from "./entities/CommonEntity";
import { ExceptionEvent } from "./entities/events/Exception";
import { ProcessStepEvent } from "./entities/events/ProcessStep";
import { QualityCheckEvent } from "./entities/events/QualityCheck";
import { TransportEvent } from "./entities/events/Transport";
import {
  GenericInventory,
  Inventory,
  ProcessStepInventory,
  TransportSystemInventory,
} from "./entities/Inventory";
import { InventoryEntry } from "./entities/InventoryEntry";
import { Location } from "./entities/Location";
import { ItemProcessed, Metric } from "./entities/Metrics";
import { ProcessStep } from "./entities/ProcessStep";
import { Machine } from "./entities/resources/Machine";
import { Resource } from "./entities/resources/Resource";
import { Worker } from "./entities/resources/Worker";
import { WorkerRole } from "./entities/resources/WorkerRole";
import { Sensor } from "./entities/Sensor";
import { TransportSystem } from "./entities/TransportSystem";

// async function getEntities(): Promise<any[]> {
//   const promises = fs
//     .readdirSync("data/entities", { recursive: true })
//     .filter((f) => fs.statSync(`data/entities/${f}`).isFile())
//     .map((f) => import(`./entities/${f}`));
//   const modules = await Promise.all(promises);

//   const kp = modules.flatMap((mod) =>
//     Object.keys(mod).map((className) => mod[className])
//   );

//   console.log(modules);

//   return kp;
// }

const config: Options = {
  driver: SqliteDriver,
  dbName: "data.db",
  entities: [
    Location,
    WorkerRole,
    Machine,
    Resource,
    Worker,
    Metric,
    ItemProcessed,
    GenericInventory,
    TransportSystemInventory,
    ProcessStepInventory,
    TransportSystem,
    ExceptionEvent,
    QualityCheckEvent,
    ProcessStepEvent,
    Event,
    TransportEvent,
    ProcessStep,
    InventoryEntry,
    CommonEntity,
    Sensor,
  ],
  // entitiesTs: ["./data/entities/**/*.ts"],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
};

export default config;
