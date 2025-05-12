
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.19.1
 * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
 */
Prisma.prismaVersion = {
  client: "5.19.1",
  engine: "69d742ee20b815d88e17e54db4a2a7a3b30324e3"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.SimulationRecordScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name'
};

exports.Prisma.KpiRecordScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  key: 'key',
  value: 'value',
  name: 'name',
  simulationId: 'simulationId'
};

exports.Prisma.ResourceScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  active: 'active',
  mandatory: 'mandatory',
  productionResource: 'productionResource',
  inventoryResource: 'inventoryResource',
  locationId: 'locationId',
  processStepId: 'processStepId',
  transportSystemId: 'transportSystemId',
  faulty: 'faulty',
  faultyRate: 'faultyRate'
};

exports.Prisma.MachineScalarFieldEnum = {
  id: 'id',
  resourceId: 'resourceId'
};

exports.Prisma.WorkerScalarFieldEnum = {
  id: 'id',
  workerNumber: 'workerNumber',
  fullName: 'fullName',
  address: 'address',
  resourceId: 'resourceId'
};

exports.Prisma.WorkerRoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.InventoryScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  type: 'type',
  limit: 'limit'
};

exports.Prisma.InventoryEntryScalarFieldEnum = {
  id: 'id',
  addedAt: 'addedAt',
  material: 'material',
  inventoryId: 'inventoryId',
  orderId: 'orderId'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  description: 'description'
};

exports.Prisma.ProcessStepScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  status: 'status',
  active: 'active',
  inputSpeed: 'inputSpeed',
  outputSpeed: 'outputSpeed',
  recipeRate: 'recipeRate',
  duration: 'duration',
  locationId: 'locationId',
  inventoryId: 'inventoryId',
  recipeId: 'recipeId',
  errorRate: 'errorRate'
};

exports.Prisma.RecipeScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name'
};

exports.Prisma.RecipeInputScalarFieldEnum = {
  id: 'id',
  material: 'material',
  quantity: 'quantity',
  recipeId: 'recipeId'
};

exports.Prisma.RecipeOutputScalarFieldEnum = {
  id: 'id',
  material: 'material',
  quantity: 'quantity',
  recipeId: 'recipeId'
};

exports.Prisma.LogEntryScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  inputType: 'inputType',
  sensorId: 'sensorId',
  materialId: 'materialId',
  materialName: 'materialName',
  processStepId: 'processStepId',
  transportSystemId: 'transportSystemId'
};

exports.Prisma.SensorScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
  type: 'type',
  value: 'value',
  sensorDelay: 'sensorDelay',
  active: 'active',
  processStepId: 'processStepId',
  transportSystemId: 'transportSystemId'
};

exports.Prisma.FilterEntryScalarFieldEnum = {
  id: 'id',
  addedAt: 'addedAt',
  material: 'material',
  filterId: 'filterId'
};

exports.Prisma.FilterScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  transportSystemId: 'transportSystemId',
  orderId: 'orderId'
};

exports.Prisma.TransportSystemScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  active: 'active',
  name: 'name',
  inputSpeed: 'inputSpeed',
  outputSpeed: 'outputSpeed',
  inventoryId: 'inventoryId',
  minQuantity: 'minQuantity',
  transportDelay: 'transportDelay',
  startStepId: 'startStepId',
  endStepId: 'endStepId',
  type: 'type',
  startTSId: 'startTSId',
  endTSId: 'endTSId'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  status: 'status',
  priority: 'priority',
  dueDate: 'dueDate',
  description: 'description',
  quantity: 'quantity',
  startedAt: 'startedAt',
  startedTick: 'startedTick',
  completedTick: 'completedTick',
  completedAt: 'completedAt',
  canceledAt: 'canceledAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  SimulationRecord: 'SimulationRecord',
  KpiRecord: 'KpiRecord',
  Resource: 'Resource',
  Machine: 'Machine',
  Worker: 'Worker',
  WorkerRole: 'WorkerRole',
  Inventory: 'Inventory',
  InventoryEntry: 'InventoryEntry',
  Location: 'Location',
  ProcessStep: 'ProcessStep',
  Recipe: 'Recipe',
  RecipeInput: 'RecipeInput',
  RecipeOutput: 'RecipeOutput',
  LogEntry: 'LogEntry',
  Sensor: 'Sensor',
  FilterEntry: 'FilterEntry',
  Filter: 'Filter',
  TransportSystem: 'TransportSystem',
  Order: 'Order'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
