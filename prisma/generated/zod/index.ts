import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const ResourceScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','active','locationId','processStepId']);

export const MachineScalarFieldEnumSchema = z.enum(['id','resourceId']);

export const WorkerScalarFieldEnumSchema = z.enum(['id','resourceId']);

export const WorkerRoleScalarFieldEnumSchema = z.enum(['id','name','description']);

export const InventoryScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','type','limit']);

export const InventoryEntryScalarFieldEnumSchema = z.enum(['id','addedAt','material','inventoryId','orderId']);

export const LocationScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','description']);

export const ProcessStepScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','status','active','inputSpeed','outputSpeed','recipeRate','duration','locationId','inventoryId','recipeId','errorRate']);

export const RecipeScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name']);

export const RecipeInputScalarFieldEnumSchema = z.enum(['id','material','quantity','recipeId']);

export const RecipeOutputScalarFieldEnumSchema = z.enum(['id','material','quantity','recipeId']);

export const LogEntryScalarFieldEnumSchema = z.enum(['id','createdAt','inputType','sensorId','materialId','materialName','processStepId','transportSystemId']);

export const SensorScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','type','value','sensorDelay','processStepId','transportSystemId']);

export const FilterEntryScalarFieldEnumSchema = z.enum(['id','addedAt','material','filterId']);

export const FilterScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','transportSystemId','orderId']);

export const TransportSystemScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','active','name','inputSpeed','outputSpeed','inventoryId','minQuantity','transportDelay','startStepId','endStepId','type']);

export const OrderScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','status','priority','dueDate','description','quantity','startedAt','startedTick','completedTick','completedAt','canceledAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// RESOURCE SCHEMA
/////////////////////////////////////////

export const ResourceSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string().nullable(),
  active: z.boolean(),
  locationId: z.number().int(),
  processStepId: z.number().int(),
})

export type Resource = z.infer<typeof ResourceSchema>

/////////////////////////////////////////
// MACHINE SCHEMA
/////////////////////////////////////////

export const MachineSchema = z.object({
  id: z.number().int(),
  resourceId: z.number().int(),
})

export type Machine = z.infer<typeof MachineSchema>

/////////////////////////////////////////
// WORKER SCHEMA
/////////////////////////////////////////

export const WorkerSchema = z.object({
  id: z.number().int(),
  resourceId: z.number().int(),
})

export type Worker = z.infer<typeof WorkerSchema>

/////////////////////////////////////////
// WORKER ROLE SCHEMA
/////////////////////////////////////////

export const WorkerRoleSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
})

export type WorkerRole = z.infer<typeof WorkerRoleSchema>

/////////////////////////////////////////
// INVENTORY SCHEMA
/////////////////////////////////////////

export const InventorySchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.string(),
  limit: z.number().int(),
})

export type Inventory = z.infer<typeof InventorySchema>

/////////////////////////////////////////
// INVENTORY ENTRY SCHEMA
/////////////////////////////////////////

export const InventoryEntrySchema = z.object({
  id: z.number().int(),
  addedAt: z.coerce.date(),
  material: z.string(),
  inventoryId: z.number().int(),
  orderId: z.number().int().nullable(),
})

export type InventoryEntry = z.infer<typeof InventoryEntrySchema>

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  description: z.string().nullable(),
})

export type Location = z.infer<typeof LocationSchema>

/////////////////////////////////////////
// PROCESS STEP SCHEMA
/////////////////////////////////////////

export const ProcessStepSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  status: z.string(),
  active: z.boolean(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int(),
  duration: z.number().int(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().nullable(),
  errorRate: z.number().nullable(),
})

export type ProcessStep = z.infer<typeof ProcessStepSchema>

/////////////////////////////////////////
// RECIPE SCHEMA
/////////////////////////////////////////

export const RecipeSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
})

export type Recipe = z.infer<typeof RecipeSchema>

/////////////////////////////////////////
// RECIPE INPUT SCHEMA
/////////////////////////////////////////

export const RecipeInputSchema = z.object({
  id: z.number().int(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().nullable(),
})

export type RecipeInput = z.infer<typeof RecipeInputSchema>

/////////////////////////////////////////
// RECIPE OUTPUT SCHEMA
/////////////////////////////////////////

export const RecipeOutputSchema = z.object({
  id: z.number().int(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().nullable(),
})

export type RecipeOutput = z.infer<typeof RecipeOutputSchema>

/////////////////////////////////////////
// LOG ENTRY SCHEMA
/////////////////////////////////////////

export const LogEntrySchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  inputType: z.string(),
  sensorId: z.number().int().nullable(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().nullable(),
  transportSystemId: z.number().int().nullable(),
})

export type LogEntry = z.infer<typeof LogEntrySchema>

/////////////////////////////////////////
// SENSOR SCHEMA
/////////////////////////////////////////

export const SensorSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  type: z.string(),
  value: z.number().int(),
  sensorDelay: z.number().int(),
  processStepId: z.number().int().nullable(),
  transportSystemId: z.number().int().nullable(),
})

export type Sensor = z.infer<typeof SensorSchema>

/////////////////////////////////////////
// FILTER ENTRY SCHEMA
/////////////////////////////////////////

export const FilterEntrySchema = z.object({
  id: z.number().int(),
  addedAt: z.coerce.date(),
  material: z.string(),
  filterId: z.number().int(),
})

export type FilterEntry = z.infer<typeof FilterEntrySchema>

/////////////////////////////////////////
// FILTER SCHEMA
/////////////////////////////////////////

export const FilterSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  transportSystemId: z.number().int(),
  orderId: z.number().int().nullable(),
})

export type Filter = z.infer<typeof FilterSchema>

/////////////////////////////////////////
// TRANSPORT SYSTEM SCHEMA
/////////////////////////////////////////

export const TransportSystemSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  active: z.boolean(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().nullable(),
  transportDelay: z.number().int().nullable(),
  startStepId: z.number().int().nullable(),
  endStepId: z.number().int().nullable(),
  type: z.string(),
})

export type TransportSystem = z.infer<typeof TransportSystemSchema>

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: z.string(),
  priority: z.number().int(),
  dueDate: z.coerce.date().nullable(),
  description: z.string().nullable(),
  quantity: z.number().int(),
  startedAt: z.coerce.date().nullable(),
  startedTick: z.number().int().nullable(),
  completedTick: z.number().int().nullable(),
  completedAt: z.coerce.date().nullable(),
  canceledAt: z.coerce.date().nullable(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// RESOURCE
//------------------------------------------------------

export const ResourceIncludeSchema: z.ZodType<Prisma.ResourceInclude> = z.object({
  Machine: z.union([z.boolean(),z.lazy(() => MachineArgsSchema)]).optional(),
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  Worker: z.union([z.boolean(),z.lazy(() => WorkerArgsSchema)]).optional(),
}).strict()

export const ResourceArgsSchema: z.ZodType<Prisma.ResourceDefaultArgs> = z.object({
  select: z.lazy(() => ResourceSelectSchema).optional(),
  include: z.lazy(() => ResourceIncludeSchema).optional(),
}).strict();

export const ResourceSelectSchema: z.ZodType<Prisma.ResourceSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  active: z.boolean().optional(),
  locationId: z.boolean().optional(),
  processStepId: z.boolean().optional(),
  Machine: z.union([z.boolean(),z.lazy(() => MachineArgsSchema)]).optional(),
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  Worker: z.union([z.boolean(),z.lazy(() => WorkerArgsSchema)]).optional(),
}).strict()

// MACHINE
//------------------------------------------------------

export const MachineIncludeSchema: z.ZodType<Prisma.MachineInclude> = z.object({
  resource: z.union([z.boolean(),z.lazy(() => ResourceArgsSchema)]).optional(),
}).strict()

export const MachineArgsSchema: z.ZodType<Prisma.MachineDefaultArgs> = z.object({
  select: z.lazy(() => MachineSelectSchema).optional(),
  include: z.lazy(() => MachineIncludeSchema).optional(),
}).strict();

export const MachineSelectSchema: z.ZodType<Prisma.MachineSelect> = z.object({
  id: z.boolean().optional(),
  resourceId: z.boolean().optional(),
  resource: z.union([z.boolean(),z.lazy(() => ResourceArgsSchema)]).optional(),
}).strict()

// WORKER
//------------------------------------------------------

export const WorkerIncludeSchema: z.ZodType<Prisma.WorkerInclude> = z.object({
  resource: z.union([z.boolean(),z.lazy(() => ResourceArgsSchema)]).optional(),
  workerRoles: z.union([z.boolean(),z.lazy(() => WorkerRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const WorkerArgsSchema: z.ZodType<Prisma.WorkerDefaultArgs> = z.object({
  select: z.lazy(() => WorkerSelectSchema).optional(),
  include: z.lazy(() => WorkerIncludeSchema).optional(),
}).strict();

export const WorkerCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkerCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkerCountOutputTypeSelect> = z.object({
  workerRoles: z.boolean().optional(),
}).strict();

export const WorkerSelectSchema: z.ZodType<Prisma.WorkerSelect> = z.object({
  id: z.boolean().optional(),
  resourceId: z.boolean().optional(),
  resource: z.union([z.boolean(),z.lazy(() => ResourceArgsSchema)]).optional(),
  workerRoles: z.union([z.boolean(),z.lazy(() => WorkerRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKER ROLE
//------------------------------------------------------

export const WorkerRoleIncludeSchema: z.ZodType<Prisma.WorkerRoleInclude> = z.object({
  workers: z.union([z.boolean(),z.lazy(() => WorkerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkerRoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const WorkerRoleArgsSchema: z.ZodType<Prisma.WorkerRoleDefaultArgs> = z.object({
  select: z.lazy(() => WorkerRoleSelectSchema).optional(),
  include: z.lazy(() => WorkerRoleIncludeSchema).optional(),
}).strict();

export const WorkerRoleCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkerRoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkerRoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkerRoleCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkerRoleCountOutputTypeSelect> = z.object({
  workers: z.boolean().optional(),
}).strict();

export const WorkerRoleSelectSchema: z.ZodType<Prisma.WorkerRoleSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  workers: z.union([z.boolean(),z.lazy(() => WorkerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkerRoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INVENTORY
//------------------------------------------------------

export const InventoryIncludeSchema: z.ZodType<Prisma.InventoryInclude> = z.object({
  entries: z.union([z.boolean(),z.lazy(() => InventoryEntryFindManyArgsSchema)]).optional(),
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InventoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const InventoryArgsSchema: z.ZodType<Prisma.InventoryDefaultArgs> = z.object({
  select: z.lazy(() => InventorySelectSchema).optional(),
  include: z.lazy(() => InventoryIncludeSchema).optional(),
}).strict();

export const InventoryCountOutputTypeArgsSchema: z.ZodType<Prisma.InventoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => InventoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const InventoryCountOutputTypeSelectSchema: z.ZodType<Prisma.InventoryCountOutputTypeSelect> = z.object({
  entries: z.boolean().optional(),
}).strict();

export const InventorySelectSchema: z.ZodType<Prisma.InventorySelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  type: z.boolean().optional(),
  limit: z.boolean().optional(),
  entries: z.union([z.boolean(),z.lazy(() => InventoryEntryFindManyArgsSchema)]).optional(),
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InventoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INVENTORY ENTRY
//------------------------------------------------------

export const InventoryEntryIncludeSchema: z.ZodType<Prisma.InventoryEntryInclude> = z.object({
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

export const InventoryEntryArgsSchema: z.ZodType<Prisma.InventoryEntryDefaultArgs> = z.object({
  select: z.lazy(() => InventoryEntrySelectSchema).optional(),
  include: z.lazy(() => InventoryEntryIncludeSchema).optional(),
}).strict();

export const InventoryEntrySelectSchema: z.ZodType<Prisma.InventoryEntrySelect> = z.object({
  id: z.boolean().optional(),
  addedAt: z.boolean().optional(),
  material: z.boolean().optional(),
  inventoryId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationIncludeSchema: z.ZodType<Prisma.LocationInclude> = z.object({
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  resources: z.union([z.boolean(),z.lazy(() => ResourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
  include: z.lazy(() => LocationIncludeSchema).optional(),
}).strict();

export const LocationCountOutputTypeArgsSchema: z.ZodType<Prisma.LocationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LocationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LocationCountOutputTypeSelectSchema: z.ZodType<Prisma.LocationCountOutputTypeSelect> = z.object({
  processSteps: z.boolean().optional(),
  resources: z.boolean().optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  resources: z.union([z.boolean(),z.lazy(() => ResourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROCESS STEP
//------------------------------------------------------

export const ProcessStepIncludeSchema: z.ZodType<Prisma.ProcessStepInclude> = z.object({
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  resources: z.union([z.boolean(),z.lazy(() => ResourceFindManyArgsSchema)]).optional(),
  sensors: z.union([z.boolean(),z.lazy(() => SensorFindManyArgsSchema)]).optional(),
  inputs: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  outputs: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProcessStepCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProcessStepArgsSchema: z.ZodType<Prisma.ProcessStepDefaultArgs> = z.object({
  select: z.lazy(() => ProcessStepSelectSchema).optional(),
  include: z.lazy(() => ProcessStepIncludeSchema).optional(),
}).strict();

export const ProcessStepCountOutputTypeArgsSchema: z.ZodType<Prisma.ProcessStepCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProcessStepCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProcessStepCountOutputTypeSelectSchema: z.ZodType<Prisma.ProcessStepCountOutputTypeSelect> = z.object({
  orders: z.boolean().optional(),
  resources: z.boolean().optional(),
  sensors: z.boolean().optional(),
  inputs: z.boolean().optional(),
  outputs: z.boolean().optional(),
}).strict();

export const ProcessStepSelectSchema: z.ZodType<Prisma.ProcessStepSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  status: z.boolean().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.boolean().optional(),
  outputSpeed: z.boolean().optional(),
  recipeRate: z.boolean().optional(),
  duration: z.boolean().optional(),
  locationId: z.boolean().optional(),
  inventoryId: z.boolean().optional(),
  recipeId: z.boolean().optional(),
  errorRate: z.boolean().optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  resources: z.union([z.boolean(),z.lazy(() => ResourceFindManyArgsSchema)]).optional(),
  sensors: z.union([z.boolean(),z.lazy(() => SensorFindManyArgsSchema)]).optional(),
  inputs: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  outputs: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProcessStepCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RECIPE
//------------------------------------------------------

export const RecipeIncludeSchema: z.ZodType<Prisma.RecipeInclude> = z.object({
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  inputs: z.union([z.boolean(),z.lazy(() => RecipeInputFindManyArgsSchema)]).optional(),
  outputs: z.union([z.boolean(),z.lazy(() => RecipeOutputFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RecipeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RecipeArgsSchema: z.ZodType<Prisma.RecipeDefaultArgs> = z.object({
  select: z.lazy(() => RecipeSelectSchema).optional(),
  include: z.lazy(() => RecipeIncludeSchema).optional(),
}).strict();

export const RecipeCountOutputTypeArgsSchema: z.ZodType<Prisma.RecipeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RecipeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RecipeCountOutputTypeSelectSchema: z.ZodType<Prisma.RecipeCountOutputTypeSelect> = z.object({
  processSteps: z.boolean().optional(),
  inputs: z.boolean().optional(),
  outputs: z.boolean().optional(),
}).strict();

export const RecipeSelectSchema: z.ZodType<Prisma.RecipeSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  inputs: z.union([z.boolean(),z.lazy(() => RecipeInputFindManyArgsSchema)]).optional(),
  outputs: z.union([z.boolean(),z.lazy(() => RecipeOutputFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RecipeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RECIPE INPUT
//------------------------------------------------------

export const RecipeInputIncludeSchema: z.ZodType<Prisma.RecipeInputInclude> = z.object({
  Recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
}).strict()

export const RecipeInputArgsSchema: z.ZodType<Prisma.RecipeInputDefaultArgs> = z.object({
  select: z.lazy(() => RecipeInputSelectSchema).optional(),
  include: z.lazy(() => RecipeInputIncludeSchema).optional(),
}).strict();

export const RecipeInputSelectSchema: z.ZodType<Prisma.RecipeInputSelect> = z.object({
  id: z.boolean().optional(),
  material: z.boolean().optional(),
  quantity: z.boolean().optional(),
  recipeId: z.boolean().optional(),
  Recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
}).strict()

// RECIPE OUTPUT
//------------------------------------------------------

export const RecipeOutputIncludeSchema: z.ZodType<Prisma.RecipeOutputInclude> = z.object({
  Recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
}).strict()

export const RecipeOutputArgsSchema: z.ZodType<Prisma.RecipeOutputDefaultArgs> = z.object({
  select: z.lazy(() => RecipeOutputSelectSchema).optional(),
  include: z.lazy(() => RecipeOutputIncludeSchema).optional(),
}).strict();

export const RecipeOutputSelectSchema: z.ZodType<Prisma.RecipeOutputSelect> = z.object({
  id: z.boolean().optional(),
  material: z.boolean().optional(),
  quantity: z.boolean().optional(),
  recipeId: z.boolean().optional(),
  Recipe: z.union([z.boolean(),z.lazy(() => RecipeArgsSchema)]).optional(),
}).strict()

// LOG ENTRY
//------------------------------------------------------

export const LogEntryIncludeSchema: z.ZodType<Prisma.LogEntryInclude> = z.object({
  sensor: z.union([z.boolean(),z.lazy(() => SensorArgsSchema)]).optional(),
}).strict()

export const LogEntryArgsSchema: z.ZodType<Prisma.LogEntryDefaultArgs> = z.object({
  select: z.lazy(() => LogEntrySelectSchema).optional(),
  include: z.lazy(() => LogEntryIncludeSchema).optional(),
}).strict();

export const LogEntrySelectSchema: z.ZodType<Prisma.LogEntrySelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  inputType: z.boolean().optional(),
  sensorId: z.boolean().optional(),
  materialId: z.boolean().optional(),
  materialName: z.boolean().optional(),
  processStepId: z.boolean().optional(),
  transportSystemId: z.boolean().optional(),
  sensor: z.union([z.boolean(),z.lazy(() => SensorArgsSchema)]).optional(),
}).strict()

// SENSOR
//------------------------------------------------------

export const SensorIncludeSchema: z.ZodType<Prisma.SensorInclude> = z.object({
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  logEntries: z.union([z.boolean(),z.lazy(() => LogEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SensorCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SensorArgsSchema: z.ZodType<Prisma.SensorDefaultArgs> = z.object({
  select: z.lazy(() => SensorSelectSchema).optional(),
  include: z.lazy(() => SensorIncludeSchema).optional(),
}).strict();

export const SensorCountOutputTypeArgsSchema: z.ZodType<Prisma.SensorCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SensorCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SensorCountOutputTypeSelectSchema: z.ZodType<Prisma.SensorCountOutputTypeSelect> = z.object({
  logEntries: z.boolean().optional(),
}).strict();

export const SensorSelectSchema: z.ZodType<Prisma.SensorSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  value: z.boolean().optional(),
  sensorDelay: z.boolean().optional(),
  processStepId: z.boolean().optional(),
  transportSystemId: z.boolean().optional(),
  processStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  logEntries: z.union([z.boolean(),z.lazy(() => LogEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SensorCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FILTER ENTRY
//------------------------------------------------------

export const FilterEntryIncludeSchema: z.ZodType<Prisma.FilterEntryInclude> = z.object({
  filter: z.union([z.boolean(),z.lazy(() => FilterArgsSchema)]).optional(),
}).strict()

export const FilterEntryArgsSchema: z.ZodType<Prisma.FilterEntryDefaultArgs> = z.object({
  select: z.lazy(() => FilterEntrySelectSchema).optional(),
  include: z.lazy(() => FilterEntryIncludeSchema).optional(),
}).strict();

export const FilterEntrySelectSchema: z.ZodType<Prisma.FilterEntrySelect> = z.object({
  id: z.boolean().optional(),
  addedAt: z.boolean().optional(),
  material: z.boolean().optional(),
  filterId: z.boolean().optional(),
  filter: z.union([z.boolean(),z.lazy(() => FilterArgsSchema)]).optional(),
}).strict()

// FILTER
//------------------------------------------------------

export const FilterIncludeSchema: z.ZodType<Prisma.FilterInclude> = z.object({
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  entries: z.union([z.boolean(),z.lazy(() => FilterEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FilterCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const FilterArgsSchema: z.ZodType<Prisma.FilterDefaultArgs> = z.object({
  select: z.lazy(() => FilterSelectSchema).optional(),
  include: z.lazy(() => FilterIncludeSchema).optional(),
}).strict();

export const FilterCountOutputTypeArgsSchema: z.ZodType<Prisma.FilterCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FilterCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FilterCountOutputTypeSelectSchema: z.ZodType<Prisma.FilterCountOutputTypeSelect> = z.object({
  entries: z.boolean().optional(),
}).strict();

export const FilterSelectSchema: z.ZodType<Prisma.FilterSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  transportSystemId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  transportSystem: z.union([z.boolean(),z.lazy(() => TransportSystemArgsSchema)]).optional(),
  entries: z.union([z.boolean(),z.lazy(() => FilterEntryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FilterCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TRANSPORT SYSTEM
//------------------------------------------------------

export const TransportSystemIncludeSchema: z.ZodType<Prisma.TransportSystemInclude> = z.object({
  filter: z.union([z.boolean(),z.lazy(() => FilterArgsSchema)]).optional(),
  endStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  startStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  sensors: z.union([z.boolean(),z.lazy(() => SensorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TransportSystemCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TransportSystemArgsSchema: z.ZodType<Prisma.TransportSystemDefaultArgs> = z.object({
  select: z.lazy(() => TransportSystemSelectSchema).optional(),
  include: z.lazy(() => TransportSystemIncludeSchema).optional(),
}).strict();

export const TransportSystemCountOutputTypeArgsSchema: z.ZodType<Prisma.TransportSystemCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TransportSystemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TransportSystemCountOutputTypeSelectSchema: z.ZodType<Prisma.TransportSystemCountOutputTypeSelect> = z.object({
  orders: z.boolean().optional(),
  sensors: z.boolean().optional(),
}).strict();

export const TransportSystemSelectSchema: z.ZodType<Prisma.TransportSystemSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  active: z.boolean().optional(),
  name: z.boolean().optional(),
  inputSpeed: z.boolean().optional(),
  outputSpeed: z.boolean().optional(),
  inventoryId: z.boolean().optional(),
  minQuantity: z.boolean().optional(),
  transportDelay: z.boolean().optional(),
  startStepId: z.boolean().optional(),
  endStepId: z.boolean().optional(),
  type: z.boolean().optional(),
  filter: z.union([z.boolean(),z.lazy(() => FilterArgsSchema)]).optional(),
  endStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  startStep: z.union([z.boolean(),z.lazy(() => ProcessStepArgsSchema)]).optional(),
  inventory: z.union([z.boolean(),z.lazy(() => InventoryArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  sensors: z.union([z.boolean(),z.lazy(() => SensorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TransportSystemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER
//------------------------------------------------------

export const OrderIncludeSchema: z.ZodType<Prisma.OrderInclude> = z.object({
  inventoryEntries: z.union([z.boolean(),z.lazy(() => InventoryEntryFindManyArgsSchema)]).optional(),
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  transportSystems: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrderArgsSchema: z.ZodType<Prisma.OrderDefaultArgs> = z.object({
  select: z.lazy(() => OrderSelectSchema).optional(),
  include: z.lazy(() => OrderIncludeSchema).optional(),
}).strict();

export const OrderCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = z.object({
  inventoryEntries: z.boolean().optional(),
  processSteps: z.boolean().optional(),
  transportSystems: z.boolean().optional(),
}).strict();

export const OrderSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  status: z.boolean().optional(),
  priority: z.boolean().optional(),
  dueDate: z.boolean().optional(),
  description: z.boolean().optional(),
  quantity: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  startedTick: z.boolean().optional(),
  completedTick: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  canceledAt: z.boolean().optional(),
  inventoryEntries: z.union([z.boolean(),z.lazy(() => InventoryEntryFindManyArgsSchema)]).optional(),
  processSteps: z.union([z.boolean(),z.lazy(() => ProcessStepFindManyArgsSchema)]).optional(),
  transportSystems: z.union([z.boolean(),z.lazy(() => TransportSystemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ResourceWhereInputSchema: z.ZodType<Prisma.ResourceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResourceWhereInputSchema),z.lazy(() => ResourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResourceWhereInputSchema),z.lazy(() => ResourceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  Machine: z.union([ z.lazy(() => MachineNullableRelationFilterSchema),z.lazy(() => MachineWhereInputSchema) ]).optional().nullable(),
  processStep: z.union([ z.lazy(() => ProcessStepRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  Worker: z.union([ z.lazy(() => WorkerNullableRelationFilterSchema),z.lazy(() => WorkerWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ResourceOrderByWithRelationInputSchema: z.ZodType<Prisma.ResourceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  Machine: z.lazy(() => MachineOrderByWithRelationInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepOrderByWithRelationInputSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  Worker: z.lazy(() => WorkerOrderByWithRelationInputSchema).optional()
}).strict();

export const ResourceWhereUniqueInputSchema: z.ZodType<Prisma.ResourceWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ResourceWhereInputSchema),z.lazy(() => ResourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResourceWhereInputSchema),z.lazy(() => ResourceWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  Machine: z.union([ z.lazy(() => MachineNullableRelationFilterSchema),z.lazy(() => MachineWhereInputSchema) ]).optional().nullable(),
  processStep: z.union([ z.lazy(() => ProcessStepRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  Worker: z.union([ z.lazy(() => WorkerNullableRelationFilterSchema),z.lazy(() => WorkerWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ResourceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResourceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResourceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResourceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResourceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResourceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResourceSumOrderByAggregateInputSchema).optional()
}).strict();

export const ResourceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResourceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ResourceScalarWhereWithAggregatesInputSchema),z.lazy(() => ResourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResourceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResourceScalarWhereWithAggregatesInputSchema),z.lazy(() => ResourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  locationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const MachineWhereInputSchema: z.ZodType<Prisma.MachineWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MachineWhereInputSchema),z.lazy(() => MachineWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MachineWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MachineWhereInputSchema),z.lazy(() => MachineWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  resourceId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  resource: z.union([ z.lazy(() => ResourceRelationFilterSchema),z.lazy(() => ResourceWhereInputSchema) ]).optional(),
}).strict();

export const MachineOrderByWithRelationInputSchema: z.ZodType<Prisma.MachineOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  resource: z.lazy(() => ResourceOrderByWithRelationInputSchema).optional()
}).strict();

export const MachineWhereUniqueInputSchema: z.ZodType<Prisma.MachineWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    resourceId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    resourceId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MachineWhereInputSchema),z.lazy(() => MachineWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MachineWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MachineWhereInputSchema),z.lazy(() => MachineWhereInputSchema).array() ]).optional(),
  resource: z.union([ z.lazy(() => ResourceRelationFilterSchema),z.lazy(() => ResourceWhereInputSchema) ]).optional(),
}).strict());

export const MachineOrderByWithAggregationInputSchema: z.ZodType<Prisma.MachineOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MachineCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MachineAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MachineMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MachineMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MachineSumOrderByAggregateInputSchema).optional()
}).strict();

export const MachineScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MachineScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MachineScalarWhereWithAggregatesInputSchema),z.lazy(() => MachineScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MachineScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MachineScalarWhereWithAggregatesInputSchema),z.lazy(() => MachineScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  resourceId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const WorkerWhereInputSchema: z.ZodType<Prisma.WorkerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerWhereInputSchema),z.lazy(() => WorkerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerWhereInputSchema),z.lazy(() => WorkerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  resourceId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  resource: z.union([ z.lazy(() => ResourceRelationFilterSchema),z.lazy(() => ResourceWhereInputSchema) ]).optional(),
  workerRoles: z.lazy(() => WorkerRoleListRelationFilterSchema).optional()
}).strict();

export const WorkerOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  resource: z.lazy(() => ResourceOrderByWithRelationInputSchema).optional(),
  workerRoles: z.lazy(() => WorkerRoleOrderByRelationAggregateInputSchema).optional()
}).strict();

export const WorkerWhereUniqueInputSchema: z.ZodType<Prisma.WorkerWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    resourceId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    resourceId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => WorkerWhereInputSchema),z.lazy(() => WorkerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerWhereInputSchema),z.lazy(() => WorkerWhereInputSchema).array() ]).optional(),
  resource: z.union([ z.lazy(() => ResourceRelationFilterSchema),z.lazy(() => ResourceWhereInputSchema) ]).optional(),
  workerRoles: z.lazy(() => WorkerRoleListRelationFilterSchema).optional()
}).strict());

export const WorkerOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkerSumOrderByAggregateInputSchema).optional()
}).strict();

export const WorkerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  resourceId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const WorkerRoleWhereInputSchema: z.ZodType<Prisma.WorkerRoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerRoleWhereInputSchema),z.lazy(() => WorkerRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerRoleWhereInputSchema),z.lazy(() => WorkerRoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  workers: z.lazy(() => WorkerListRelationFilterSchema).optional()
}).strict();

export const WorkerRoleOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkerRoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  workers: z.lazy(() => WorkerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const WorkerRoleWhereUniqueInputSchema: z.ZodType<Prisma.WorkerRoleWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    name: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => WorkerRoleWhereInputSchema),z.lazy(() => WorkerRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerRoleWhereInputSchema),z.lazy(() => WorkerRoleWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  workers: z.lazy(() => WorkerListRelationFilterSchema).optional()
}).strict());

export const WorkerRoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkerRoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => WorkerRoleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkerRoleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkerRoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkerRoleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkerRoleSumOrderByAggregateInputSchema).optional()
}).strict();

export const WorkerRoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkerRoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkerRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerRoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => WorkerRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const InventoryWhereInputSchema: z.ZodType<Prisma.InventoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryWhereInputSchema),z.lazy(() => InventoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryWhereInputSchema),z.lazy(() => InventoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  limit: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  entries: z.lazy(() => InventoryEntryListRelationFilterSchema).optional(),
  processStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemNullableRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryOrderByWithRelationInputSchema: z.ZodType<Prisma.InventoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional(),
  entries: z.lazy(() => InventoryEntryOrderByRelationAggregateInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepOrderByWithRelationInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemOrderByWithRelationInputSchema).optional()
}).strict();

export const InventoryWhereUniqueInputSchema: z.ZodType<Prisma.InventoryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => InventoryWhereInputSchema),z.lazy(() => InventoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryWhereInputSchema),z.lazy(() => InventoryWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  limit: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  entries: z.lazy(() => InventoryEntryListRelationFilterSchema).optional(),
  processStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemNullableRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional().nullable(),
}).strict());

export const InventoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.InventoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InventoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InventoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InventoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InventoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InventorySumOrderByAggregateInputSchema).optional()
}).strict();

export const InventoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InventoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  limit: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const InventoryEntryWhereInputSchema: z.ZodType<Prisma.InventoryEntryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryEntryWhereInputSchema),z.lazy(() => InventoryEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryEntryWhereInputSchema),z.lazy(() => InventoryEntryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  Order: z.union([ z.lazy(() => OrderNullableRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryEntryOrderByWithRelationInputSchema: z.ZodType<Prisma.InventoryEntryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  inventory: z.lazy(() => InventoryOrderByWithRelationInputSchema).optional(),
  Order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional()
}).strict();

export const InventoryEntryWhereUniqueInputSchema: z.ZodType<Prisma.InventoryEntryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => InventoryEntryWhereInputSchema),z.lazy(() => InventoryEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryEntryWhereInputSchema),z.lazy(() => InventoryEntryWhereInputSchema).array() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  Order: z.union([ z.lazy(() => OrderNullableRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional().nullable(),
}).strict());

export const InventoryEntryOrderByWithAggregationInputSchema: z.ZodType<Prisma.InventoryEntryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => InventoryEntryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InventoryEntryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InventoryEntryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InventoryEntryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InventoryEntrySumOrderByAggregateInputSchema).optional()
}).strict();

export const InventoryEntryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InventoryEntryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryEntryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => InventoryEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  resources: z.lazy(() => ResourceListRelationFilterSchema).optional()
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepOrderByRelationAggregateInputSchema).optional(),
  resources: z.lazy(() => ResourceOrderByRelationAggregateInputSchema).optional()
}).strict();

export const LocationWhereUniqueInputSchema: z.ZodType<Prisma.LocationWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  resources: z.lazy(() => ResourceListRelationFilterSchema).optional()
}).strict());

export const LocationOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LocationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LocationSumOrderByAggregateInputSchema).optional()
}).strict();

export const LocationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ProcessStepWhereInputSchema: z.ZodType<Prisma.ProcessStepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProcessStepWhereInputSchema),z.lazy(() => ProcessStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProcessStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProcessStepWhereInputSchema),z.lazy(() => ProcessStepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeRate: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  errorRate: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  resources: z.lazy(() => ResourceListRelationFilterSchema).optional(),
  sensors: z.lazy(() => SensorListRelationFilterSchema).optional(),
  inputs: z.lazy(() => TransportSystemListRelationFilterSchema).optional(),
  outputs: z.lazy(() => TransportSystemListRelationFilterSchema).optional()
}).strict();

export const ProcessStepOrderByWithRelationInputSchema: z.ZodType<Prisma.ProcessStepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorRate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional(),
  recipe: z.lazy(() => RecipeOrderByWithRelationInputSchema).optional(),
  inventory: z.lazy(() => InventoryOrderByWithRelationInputSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  resources: z.lazy(() => ResourceOrderByRelationAggregateInputSchema).optional(),
  sensors: z.lazy(() => SensorOrderByRelationAggregateInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemOrderByRelationAggregateInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProcessStepWhereUniqueInputSchema: z.ZodType<Prisma.ProcessStepWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    inventoryId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    inventoryId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  inventoryId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProcessStepWhereInputSchema),z.lazy(() => ProcessStepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProcessStepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProcessStepWhereInputSchema),z.lazy(() => ProcessStepWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  recipeRate: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  duration: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  errorRate: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  location: z.union([ z.lazy(() => LocationRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  resources: z.lazy(() => ResourceListRelationFilterSchema).optional(),
  sensors: z.lazy(() => SensorListRelationFilterSchema).optional(),
  inputs: z.lazy(() => TransportSystemListRelationFilterSchema).optional(),
  outputs: z.lazy(() => TransportSystemListRelationFilterSchema).optional()
}).strict());

export const ProcessStepOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProcessStepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  errorRate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProcessStepCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProcessStepAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProcessStepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProcessStepMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProcessStepSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProcessStepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProcessStepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProcessStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ProcessStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProcessStepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProcessStepScalarWhereWithAggregatesInputSchema),z.lazy(() => ProcessStepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  recipeRate: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  locationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  errorRate: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const RecipeWhereInputSchema: z.ZodType<Prisma.RecipeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeWhereInputSchema),z.lazy(() => RecipeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeWhereInputSchema),z.lazy(() => RecipeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  inputs: z.lazy(() => RecipeInputListRelationFilterSchema).optional(),
  outputs: z.lazy(() => RecipeOutputListRelationFilterSchema).optional()
}).strict();

export const RecipeOrderByWithRelationInputSchema: z.ZodType<Prisma.RecipeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  processSteps: z.lazy(() => ProcessStepOrderByRelationAggregateInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputOrderByRelationAggregateInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RecipeWhereUniqueInputSchema: z.ZodType<Prisma.RecipeWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RecipeWhereInputSchema),z.lazy(() => RecipeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeWhereInputSchema),z.lazy(() => RecipeWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  inputs: z.lazy(() => RecipeInputListRelationFilterSchema).optional(),
  outputs: z.lazy(() => RecipeOutputListRelationFilterSchema).optional()
}).strict());

export const RecipeOrderByWithAggregationInputSchema: z.ZodType<Prisma.RecipeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RecipeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RecipeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RecipeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RecipeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RecipeSumOrderByAggregateInputSchema).optional()
}).strict();

export const RecipeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RecipeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const RecipeInputWhereInputSchema: z.ZodType<Prisma.RecipeInputWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeInputWhereInputSchema),z.lazy(() => RecipeInputWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeInputWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeInputWhereInputSchema),z.lazy(() => RecipeInputWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  Recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeInputOrderByWithRelationInputSchema: z.ZodType<Prisma.RecipeInputOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  Recipe: z.lazy(() => RecipeOrderByWithRelationInputSchema).optional()
}).strict();

export const RecipeInputWhereUniqueInputSchema: z.ZodType<Prisma.RecipeInputWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    material_recipeId: z.lazy(() => RecipeInputMaterialRecipeIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    material_recipeId: z.lazy(() => RecipeInputMaterialRecipeIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  material_recipeId: z.lazy(() => RecipeInputMaterialRecipeIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => RecipeInputWhereInputSchema),z.lazy(() => RecipeInputWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeInputWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeInputWhereInputSchema),z.lazy(() => RecipeInputWhereInputSchema).array() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  Recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
}).strict());

export const RecipeInputOrderByWithAggregationInputSchema: z.ZodType<Prisma.RecipeInputOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => RecipeInputCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RecipeInputAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RecipeInputMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RecipeInputMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RecipeInputSumOrderByAggregateInputSchema).optional()
}).strict();

export const RecipeInputScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RecipeInputScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeInputScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeInputScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeInputScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeInputScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeInputScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const RecipeOutputWhereInputSchema: z.ZodType<Prisma.RecipeOutputWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeOutputWhereInputSchema),z.lazy(() => RecipeOutputWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeOutputWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeOutputWhereInputSchema),z.lazy(() => RecipeOutputWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  Recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeOutputOrderByWithRelationInputSchema: z.ZodType<Prisma.RecipeOutputOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  Recipe: z.lazy(() => RecipeOrderByWithRelationInputSchema).optional()
}).strict();

export const RecipeOutputWhereUniqueInputSchema: z.ZodType<Prisma.RecipeOutputWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RecipeOutputWhereInputSchema),z.lazy(() => RecipeOutputWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeOutputWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeOutputWhereInputSchema),z.lazy(() => RecipeOutputWhereInputSchema).array() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  Recipe: z.union([ z.lazy(() => RecipeNullableRelationFilterSchema),z.lazy(() => RecipeWhereInputSchema) ]).optional().nullable(),
}).strict());

export const RecipeOutputOrderByWithAggregationInputSchema: z.ZodType<Prisma.RecipeOutputOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => RecipeOutputCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RecipeOutputAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RecipeOutputMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RecipeOutputMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RecipeOutputSumOrderByAggregateInputSchema).optional()
}).strict();

export const RecipeOutputScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RecipeOutputScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeOutputScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeOutputScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeOutputScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeOutputScalarWhereWithAggregatesInputSchema),z.lazy(() => RecipeOutputScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const LogEntryWhereInputSchema: z.ZodType<Prisma.LogEntryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LogEntryWhereInputSchema),z.lazy(() => LogEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogEntryWhereInputSchema),z.lazy(() => LogEntryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inputType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sensorId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  materialId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  materialName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  sensor: z.union([ z.lazy(() => SensorNullableRelationFilterSchema),z.lazy(() => SensorWhereInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryOrderByWithRelationInputSchema: z.ZodType<Prisma.LogEntryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  inputType: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  materialName: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportSystemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sensor: z.lazy(() => SensorOrderByWithRelationInputSchema).optional()
}).strict();

export const LogEntryWhereUniqueInputSchema: z.ZodType<Prisma.LogEntryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LogEntryWhereInputSchema),z.lazy(() => LogEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogEntryWhereInputSchema),z.lazy(() => LogEntryWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inputType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sensorId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  materialId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  materialName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  sensor: z.union([ z.lazy(() => SensorNullableRelationFilterSchema),z.lazy(() => SensorWhereInputSchema) ]).optional().nullable(),
}).strict());

export const LogEntryOrderByWithAggregationInputSchema: z.ZodType<Prisma.LogEntryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  inputType: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  materialName: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportSystemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => LogEntryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LogEntryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LogEntryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LogEntryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LogEntrySumOrderByAggregateInputSchema).optional()
}).strict();

export const LogEntryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LogEntryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LogEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => LogEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogEntryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => LogEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  inputType: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sensorId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  materialId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  materialName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const SensorWhereInputSchema: z.ZodType<Prisma.SensorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SensorWhereInputSchema),z.lazy(() => SensorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SensorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SensorWhereInputSchema),z.lazy(() => SensorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  sensorDelay: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  processStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemNullableRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional().nullable(),
  logEntries: z.lazy(() => LogEntryListRelationFilterSchema).optional()
}).strict();

export const SensorOrderByWithRelationInputSchema: z.ZodType<Prisma.SensorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportSystemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepOrderByWithRelationInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemOrderByWithRelationInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SensorWhereUniqueInputSchema: z.ZodType<Prisma.SensorWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => SensorWhereInputSchema),z.lazy(() => SensorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SensorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SensorWhereInputSchema),z.lazy(() => SensorWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  sensorDelay: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  processStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemNullableRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional().nullable(),
  logEntries: z.lazy(() => LogEntryListRelationFilterSchema).optional()
}).strict());

export const SensorOrderByWithAggregationInputSchema: z.ZodType<Prisma.SensorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportSystemId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SensorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SensorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SensorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SensorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SensorSumOrderByAggregateInputSchema).optional()
}).strict();

export const SensorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SensorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SensorScalarWhereWithAggregatesInputSchema),z.lazy(() => SensorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SensorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SensorScalarWhereWithAggregatesInputSchema),z.lazy(() => SensorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  sensorDelay: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const FilterEntryWhereInputSchema: z.ZodType<Prisma.FilterEntryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FilterEntryWhereInputSchema),z.lazy(() => FilterEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterEntryWhereInputSchema),z.lazy(() => FilterEntryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  filter: z.union([ z.lazy(() => FilterRelationFilterSchema),z.lazy(() => FilterWhereInputSchema) ]).optional(),
}).strict();

export const FilterEntryOrderByWithRelationInputSchema: z.ZodType<Prisma.FilterEntryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional(),
  filter: z.lazy(() => FilterOrderByWithRelationInputSchema).optional()
}).strict();

export const FilterEntryWhereUniqueInputSchema: z.ZodType<Prisma.FilterEntryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => FilterEntryWhereInputSchema),z.lazy(() => FilterEntryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterEntryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterEntryWhereInputSchema),z.lazy(() => FilterEntryWhereInputSchema).array() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filterId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  filter: z.union([ z.lazy(() => FilterRelationFilterSchema),z.lazy(() => FilterWhereInputSchema) ]).optional(),
}).strict());

export const FilterEntryOrderByWithAggregationInputSchema: z.ZodType<Prisma.FilterEntryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FilterEntryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FilterEntryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FilterEntryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FilterEntryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FilterEntrySumOrderByAggregateInputSchema).optional()
}).strict();

export const FilterEntryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FilterEntryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FilterEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => FilterEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterEntryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterEntryScalarWhereWithAggregatesInputSchema),z.lazy(() => FilterEntryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  filterId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const FilterWhereInputSchema: z.ZodType<Prisma.FilterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FilterWhereInputSchema),z.lazy(() => FilterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterWhereInputSchema),z.lazy(() => FilterWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  transportSystemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  entries: z.lazy(() => FilterEntryListRelationFilterSchema).optional()
}).strict();

export const FilterOrderByWithRelationInputSchema: z.ZodType<Prisma.FilterOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportSystem: z.lazy(() => TransportSystemOrderByWithRelationInputSchema).optional(),
  entries: z.lazy(() => FilterEntryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const FilterWhereUniqueInputSchema: z.ZodType<Prisma.FilterWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    transportSystemId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    transportSystemId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  transportSystemId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => FilterWhereInputSchema),z.lazy(() => FilterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterWhereInputSchema),z.lazy(() => FilterWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  transportSystem: z.union([ z.lazy(() => TransportSystemRelationFilterSchema),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  entries: z.lazy(() => FilterEntryListRelationFilterSchema).optional()
}).strict());

export const FilterOrderByWithAggregationInputSchema: z.ZodType<Prisma.FilterOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => FilterCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FilterAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FilterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FilterMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FilterSumOrderByAggregateInputSchema).optional()
}).strict();

export const FilterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FilterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FilterScalarWhereWithAggregatesInputSchema),z.lazy(() => FilterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterScalarWhereWithAggregatesInputSchema),z.lazy(() => FilterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  transportSystemId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const TransportSystemWhereInputSchema: z.ZodType<Prisma.TransportSystemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransportSystemWhereInputSchema),z.lazy(() => TransportSystemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransportSystemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransportSystemWhereInputSchema),z.lazy(() => TransportSystemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  minQuantity: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportDelay: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  startStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  endStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filter: z.union([ z.lazy(() => FilterNullableRelationFilterSchema),z.lazy(() => FilterWhereInputSchema) ]).optional().nullable(),
  endStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  startStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  sensors: z.lazy(() => SensorListRelationFilterSchema).optional()
}).strict();

export const TransportSystemOrderByWithRelationInputSchema: z.ZodType<Prisma.TransportSystemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportDelay: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  filter: z.lazy(() => FilterOrderByWithRelationInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepOrderByWithRelationInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepOrderByWithRelationInputSchema).optional(),
  inventory: z.lazy(() => InventoryOrderByWithRelationInputSchema).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional(),
  sensors: z.lazy(() => SensorOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TransportSystemWhereUniqueInputSchema: z.ZodType<Prisma.TransportSystemWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    inventoryId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    inventoryId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  inventoryId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TransportSystemWhereInputSchema),z.lazy(() => TransportSystemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransportSystemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransportSystemWhereInputSchema),z.lazy(() => TransportSystemWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  minQuantity: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  transportDelay: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  startStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  endStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filter: z.union([ z.lazy(() => FilterNullableRelationFilterSchema),z.lazy(() => FilterWhereInputSchema) ]).optional().nullable(),
  endStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  startStep: z.union([ z.lazy(() => ProcessStepNullableRelationFilterSchema),z.lazy(() => ProcessStepWhereInputSchema) ]).optional().nullable(),
  inventory: z.union([ z.lazy(() => InventoryRelationFilterSchema),z.lazy(() => InventoryWhereInputSchema) ]).optional(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
  sensors: z.lazy(() => SensorListRelationFilterSchema).optional()
}).strict());

export const TransportSystemOrderByWithAggregationInputSchema: z.ZodType<Prisma.TransportSystemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  transportDelay: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  endStepId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TransportSystemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TransportSystemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TransportSystemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TransportSystemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TransportSystemSumOrderByAggregateInputSchema).optional()
}).strict();

export const TransportSystemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TransportSystemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TransportSystemScalarWhereWithAggregatesInputSchema),z.lazy(() => TransportSystemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransportSystemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransportSystemScalarWhereWithAggregatesInputSchema),z.lazy(() => TransportSystemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  minQuantity: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  transportDelay: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  startStepId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  endStepId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const OrderWhereInputSchema: z.ZodType<Prisma.OrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priority: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dueDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  startedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  completedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  canceledAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryListRelationFilterSchema).optional(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemListRelationFilterSchema).optional()
}).strict();

export const OrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  dueDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startedTick: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  completedTick: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  canceledAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  inventoryEntries: z.lazy(() => InventoryEntryOrderByRelationAggregateInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepOrderByRelationAggregateInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OrderWhereUniqueInputSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priority: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dueDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  startedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  completedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  canceledAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryListRelationFilterSchema).optional(),
  processSteps: z.lazy(() => ProcessStepListRelationFilterSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemListRelationFilterSchema).optional()
}).strict());

export const OrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  dueDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startedTick: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  completedTick: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  canceledAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => OrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  priority: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dueDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  startedTick: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  completedTick: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  canceledAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ResourceCreateInputSchema: z.ZodType<Prisma.ResourceCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  Machine: z.lazy(() => MachineCreateNestedOneWithoutResourceInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutResourcesInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutResourcesInputSchema),
  Worker: z.lazy(() => WorkerCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceUncheckedCreateInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int(),
  processStepId: z.number().int(),
  Machine: z.lazy(() => MachineUncheckedCreateNestedOneWithoutResourceInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceUpdateInputSchema: z.ZodType<Prisma.ResourceUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUpdateOneWithoutResourceNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUncheckedUpdateOneWithoutResourceNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceCreateManyInputSchema: z.ZodType<Prisma.ResourceCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int(),
  processStepId: z.number().int()
}).strict();

export const ResourceUpdateManyMutationInputSchema: z.ZodType<Prisma.ResourceUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResourceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MachineCreateInputSchema: z.ZodType<Prisma.MachineCreateInput> = z.object({
  resource: z.lazy(() => ResourceCreateNestedOneWithoutMachineInputSchema)
}).strict();

export const MachineUncheckedCreateInputSchema: z.ZodType<Prisma.MachineUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int()
}).strict();

export const MachineUpdateInputSchema: z.ZodType<Prisma.MachineUpdateInput> = z.object({
  resource: z.lazy(() => ResourceUpdateOneRequiredWithoutMachineNestedInputSchema).optional()
}).strict();

export const MachineUncheckedUpdateInputSchema: z.ZodType<Prisma.MachineUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MachineCreateManyInputSchema: z.ZodType<Prisma.MachineCreateManyInput> = z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int()
}).strict();

export const MachineUpdateManyMutationInputSchema: z.ZodType<Prisma.MachineUpdateManyMutationInput> = z.object({
}).strict();

export const MachineUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MachineUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkerCreateInputSchema: z.ZodType<Prisma.WorkerCreateInput> = z.object({
  resource: z.lazy(() => ResourceCreateNestedOneWithoutWorkerInputSchema),
  workerRoles: z.lazy(() => WorkerRoleCreateNestedManyWithoutWorkersInputSchema).optional()
}).strict();

export const WorkerUncheckedCreateInputSchema: z.ZodType<Prisma.WorkerUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int(),
  workerRoles: z.lazy(() => WorkerRoleUncheckedCreateNestedManyWithoutWorkersInputSchema).optional()
}).strict();

export const WorkerUpdateInputSchema: z.ZodType<Prisma.WorkerUpdateInput> = z.object({
  resource: z.lazy(() => ResourceUpdateOneRequiredWithoutWorkerNestedInputSchema).optional(),
  workerRoles: z.lazy(() => WorkerRoleUpdateManyWithoutWorkersNestedInputSchema).optional()
}).strict();

export const WorkerUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workerRoles: z.lazy(() => WorkerRoleUncheckedUpdateManyWithoutWorkersNestedInputSchema).optional()
}).strict();

export const WorkerCreateManyInputSchema: z.ZodType<Prisma.WorkerCreateManyInput> = z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int()
}).strict();

export const WorkerUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkerUpdateManyMutationInput> = z.object({
}).strict();

export const WorkerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkerRoleCreateInputSchema: z.ZodType<Prisma.WorkerRoleCreateInput> = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  workers: z.lazy(() => WorkerCreateNestedManyWithoutWorkerRolesInputSchema).optional()
}).strict();

export const WorkerRoleUncheckedCreateInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  workers: z.lazy(() => WorkerUncheckedCreateNestedManyWithoutWorkerRolesInputSchema).optional()
}).strict();

export const WorkerRoleUpdateInputSchema: z.ZodType<Prisma.WorkerRoleUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workers: z.lazy(() => WorkerUpdateManyWithoutWorkerRolesNestedInputSchema).optional()
}).strict();

export const WorkerRoleUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workers: z.lazy(() => WorkerUncheckedUpdateManyWithoutWorkerRolesNestedInputSchema).optional()
}).strict();

export const WorkerRoleCreateManyInputSchema: z.ZodType<Prisma.WorkerRoleCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable()
}).strict();

export const WorkerRoleUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkerRoleUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const WorkerRoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryCreateInputSchema: z.ZodType<Prisma.InventoryCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryCreateNestedManyWithoutInventoryInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryUncheckedCreateInputSchema: z.ZodType<Prisma.InventoryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutInventoryInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUncheckedCreateNestedOneWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryUpdateInputSchema: z.ZodType<Prisma.InventoryUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUpdateManyWithoutInventoryNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const InventoryUncheckedUpdateInputSchema: z.ZodType<Prisma.InventoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutInventoryNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const InventoryCreateManyInputSchema: z.ZodType<Prisma.InventoryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int()
}).strict();

export const InventoryUpdateManyMutationInputSchema: z.ZodType<Prisma.InventoryUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InventoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryEntryCreateInputSchema: z.ZodType<Prisma.InventoryEntryCreateInput> = z.object({
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutEntriesInputSchema),
  Order: z.lazy(() => OrderCreateNestedOneWithoutInventoryEntriesInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedCreateInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventoryId: z.number().int(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const InventoryEntryUpdateInputSchema: z.ZodType<Prisma.InventoryEntryUpdateInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutEntriesNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUpdateOneWithoutInventoryEntriesNestedInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedUpdateInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryEntryCreateManyInputSchema: z.ZodType<Prisma.InventoryEntryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventoryId: z.number().int(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const InventoryEntryUpdateManyMutationInputSchema: z.ZodType<Prisma.InventoryEntryUpdateManyMutationInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryEntryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LocationCreateInputSchema: z.ZodType<Prisma.LocationCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutLocationInputSchema).optional(),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUncheckedCreateInputSchema: z.ZodType<Prisma.LocationUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutLocationInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutLocationNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutLocationNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationCreateManyInputSchema: z.ZodType<Prisma.LocationCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable()
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProcessStepCreateInputSchema: z.ZodType<Prisma.ProcessStepCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUpdateInputSchema: z.ZodType<Prisma.ProcessStepUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepCreateManyInputSchema: z.ZodType<Prisma.ProcessStepCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable()
}).strict();

export const ProcessStepUpdateManyMutationInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProcessStepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeCreateInputSchema: z.ZodType<Prisma.RecipeCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutRecipeInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeUncheckedCreateInputSchema: z.ZodType<Prisma.RecipeUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutRecipeInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeUpdateInputSchema: z.ZodType<Prisma.RecipeUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutRecipeNestedInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeUncheckedUpdateInputSchema: z.ZodType<Prisma.RecipeUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeCreateManyInputSchema: z.ZodType<Prisma.RecipeCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string()
}).strict();

export const RecipeUpdateManyMutationInputSchema: z.ZodType<Prisma.RecipeUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RecipeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeInputCreateInputSchema: z.ZodType<Prisma.RecipeInputCreateInput> = z.object({
  material: z.string(),
  quantity: z.number().int(),
  Recipe: z.lazy(() => RecipeCreateNestedOneWithoutInputsInputSchema).optional()
}).strict();

export const RecipeInputUncheckedCreateInputSchema: z.ZodType<Prisma.RecipeInputUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().optional().nullable()
}).strict();

export const RecipeInputUpdateInputSchema: z.ZodType<Prisma.RecipeInputUpdateInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Recipe: z.lazy(() => RecipeUpdateOneWithoutInputsNestedInputSchema).optional()
}).strict();

export const RecipeInputUncheckedUpdateInputSchema: z.ZodType<Prisma.RecipeInputUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeInputCreateManyInputSchema: z.ZodType<Prisma.RecipeInputCreateManyInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().optional().nullable()
}).strict();

export const RecipeInputUpdateManyMutationInputSchema: z.ZodType<Prisma.RecipeInputUpdateManyMutationInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeInputUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RecipeInputUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeOutputCreateInputSchema: z.ZodType<Prisma.RecipeOutputCreateInput> = z.object({
  material: z.string(),
  quantity: z.number().int(),
  Recipe: z.lazy(() => RecipeCreateNestedOneWithoutOutputsInputSchema).optional()
}).strict();

export const RecipeOutputUncheckedCreateInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().optional().nullable()
}).strict();

export const RecipeOutputUpdateInputSchema: z.ZodType<Prisma.RecipeOutputUpdateInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Recipe: z.lazy(() => RecipeUpdateOneWithoutOutputsNestedInputSchema).optional()
}).strict();

export const RecipeOutputUncheckedUpdateInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeOutputCreateManyInputSchema: z.ZodType<Prisma.RecipeOutputCreateManyInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int(),
  recipeId: z.number().int().optional().nullable()
}).strict();

export const RecipeOutputUpdateManyMutationInputSchema: z.ZodType<Prisma.RecipeOutputUpdateManyMutationInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeOutputUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryCreateInputSchema: z.ZodType<Prisma.LogEntryCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable(),
  sensor: z.lazy(() => SensorCreateNestedOneWithoutLogEntriesInputSchema).optional()
}).strict();

export const LogEntryUncheckedCreateInputSchema: z.ZodType<Prisma.LogEntryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  sensorId: z.number().int().optional().nullable(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const LogEntryUpdateInputSchema: z.ZodType<Prisma.LogEntryUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sensor: z.lazy(() => SensorUpdateOneWithoutLogEntriesNestedInputSchema).optional()
}).strict();

export const LogEntryUncheckedUpdateInputSchema: z.ZodType<Prisma.LogEntryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sensorId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryCreateManyInputSchema: z.ZodType<Prisma.LogEntryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  sensorId: z.number().int().optional().nullable(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const LogEntryUpdateManyMutationInputSchema: z.ZodType<Prisma.LogEntryUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LogEntryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sensorId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SensorCreateInputSchema: z.ZodType<Prisma.SensorCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutSensorsInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutSensorsInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorUncheckedCreateInputSchema: z.ZodType<Prisma.SensorUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorUpdateInputSchema: z.ZodType<Prisma.SensorUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutSensorsNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutSensorsNestedInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorCreateManyInputSchema: z.ZodType<Prisma.SensorCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const SensorUpdateManyMutationInputSchema: z.ZodType<Prisma.SensorUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SensorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FilterEntryCreateInputSchema: z.ZodType<Prisma.FilterEntryCreateInput> = z.object({
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutEntriesInputSchema)
}).strict();

export const FilterEntryUncheckedCreateInputSchema: z.ZodType<Prisma.FilterEntryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  filterId: z.number().int()
}).strict();

export const FilterEntryUpdateInputSchema: z.ZodType<Prisma.FilterEntryUpdateInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneRequiredWithoutEntriesNestedInputSchema).optional()
}).strict();

export const FilterEntryUncheckedUpdateInputSchema: z.ZodType<Prisma.FilterEntryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FilterEntryCreateManyInputSchema: z.ZodType<Prisma.FilterEntryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  filterId: z.number().int()
}).strict();

export const FilterEntryUpdateManyMutationInputSchema: z.ZodType<Prisma.FilterEntryUpdateManyMutationInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FilterEntryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FilterEntryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FilterCreateInputSchema: z.ZodType<Prisma.FilterCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orderId: z.number().int().optional().nullable(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutFilterInputSchema),
  entries: z.lazy(() => FilterEntryCreateNestedManyWithoutFilterInputSchema).optional()
}).strict();

export const FilterUncheckedCreateInputSchema: z.ZodType<Prisma.FilterUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transportSystemId: z.number().int(),
  orderId: z.number().int().optional().nullable(),
  entries: z.lazy(() => FilterEntryUncheckedCreateNestedManyWithoutFilterInputSchema).optional()
}).strict();

export const FilterUpdateInputSchema: z.ZodType<Prisma.FilterUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneRequiredWithoutFilterNestedInputSchema).optional(),
  entries: z.lazy(() => FilterEntryUpdateManyWithoutFilterNestedInputSchema).optional()
}).strict();

export const FilterUncheckedUpdateInputSchema: z.ZodType<Prisma.FilterUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  entries: z.lazy(() => FilterEntryUncheckedUpdateManyWithoutFilterNestedInputSchema).optional()
}).strict();

export const FilterCreateManyInputSchema: z.ZodType<Prisma.FilterCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transportSystemId: z.number().int(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const FilterUpdateManyMutationInputSchema: z.ZodType<Prisma.FilterUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FilterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FilterUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransportSystemCreateInputSchema: z.ZodType<Prisma.TransportSystemCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUpdateInputSchema: z.ZodType<Prisma.TransportSystemUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemCreateManyInputSchema: z.ZodType<Prisma.TransportSystemCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string()
}).strict();

export const TransportSystemUpdateManyMutationInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransportSystemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderCreateInputSchema: z.ZodType<Prisma.OrderCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryCreateNestedManyWithoutOrderInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutOrdersInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderUncheckedCreateInputSchema: z.ZodType<Prisma.OrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutOrdersInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderUpdateInputSchema: z.ZodType<Prisma.OrderUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUpdateManyWithoutOrderNestedInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutOrdersNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderCreateManyInputSchema: z.ZodType<Prisma.OrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable()
}).strict();

export const OrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const MachineNullableRelationFilterSchema: z.ZodType<Prisma.MachineNullableRelationFilter> = z.object({
  is: z.lazy(() => MachineWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => MachineWhereInputSchema).optional().nullable()
}).strict();

export const ProcessStepRelationFilterSchema: z.ZodType<Prisma.ProcessStepRelationFilter> = z.object({
  is: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  isNot: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const LocationRelationFilterSchema: z.ZodType<Prisma.LocationRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const WorkerNullableRelationFilterSchema: z.ZodType<Prisma.WorkerNullableRelationFilter> = z.object({
  is: z.lazy(() => WorkerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => WorkerWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ResourceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResourceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResourceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResourceAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResourceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResourceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResourceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResourceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResourceSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResourceSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ResourceRelationFilterSchema: z.ZodType<Prisma.ResourceRelationFilter> = z.object({
  is: z.lazy(() => ResourceWhereInputSchema).optional(),
  isNot: z.lazy(() => ResourceWhereInputSchema).optional()
}).strict();

export const MachineCountOrderByAggregateInputSchema: z.ZodType<Prisma.MachineCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MachineAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MachineAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MachineMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MachineMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MachineMinOrderByAggregateInputSchema: z.ZodType<Prisma.MachineMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MachineSumOrderByAggregateInputSchema: z.ZodType<Prisma.MachineSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleListRelationFilterSchema: z.ZodType<Prisma.WorkerRoleListRelationFilter> = z.object({
  every: z.lazy(() => WorkerRoleWhereInputSchema).optional(),
  some: z.lazy(() => WorkerRoleWhereInputSchema).optional(),
  none: z.lazy(() => WorkerRoleWhereInputSchema).optional()
}).strict();

export const WorkerRoleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkerRoleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  resourceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const WorkerListRelationFilterSchema: z.ZodType<Prisma.WorkerListRelationFilter> = z.object({
  every: z.lazy(() => WorkerWhereInputSchema).optional(),
  some: z.lazy(() => WorkerWhereInputSchema).optional(),
  none: z.lazy(() => WorkerWhereInputSchema).optional()
}).strict();

export const WorkerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerRoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerRoleAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerRoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerRoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const WorkerRoleSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkerRoleSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const InventoryEntryListRelationFilterSchema: z.ZodType<Prisma.InventoryEntryListRelationFilter> = z.object({
  every: z.lazy(() => InventoryEntryWhereInputSchema).optional(),
  some: z.lazy(() => InventoryEntryWhereInputSchema).optional(),
  none: z.lazy(() => InventoryEntryWhereInputSchema).optional()
}).strict();

export const ProcessStepNullableRelationFilterSchema: z.ZodType<Prisma.ProcessStepNullableRelationFilter> = z.object({
  is: z.lazy(() => ProcessStepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProcessStepWhereInputSchema).optional().nullable()
}).strict();

export const TransportSystemNullableRelationFilterSchema: z.ZodType<Prisma.TransportSystemNullableRelationFilter> = z.object({
  is: z.lazy(() => TransportSystemWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TransportSystemWhereInputSchema).optional().nullable()
}).strict();

export const InventoryEntryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.InventoryEntryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventorySumOrderByAggregateInputSchema: z.ZodType<Prisma.InventorySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const InventoryRelationFilterSchema: z.ZodType<Prisma.InventoryRelationFilter> = z.object({
  is: z.lazy(() => InventoryWhereInputSchema).optional(),
  isNot: z.lazy(() => InventoryWhereInputSchema).optional()
}).strict();

export const OrderNullableRelationFilterSchema: z.ZodType<Prisma.OrderNullableRelationFilter> = z.object({
  is: z.lazy(() => OrderWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => OrderWhereInputSchema).optional().nullable()
}).strict();

export const InventoryEntryCountOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryEntryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryEntryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryEntryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryEntryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryEntryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryEntryMinOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryEntryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InventoryEntrySumOrderByAggregateInputSchema: z.ZodType<Prisma.InventoryEntrySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const ProcessStepListRelationFilterSchema: z.ZodType<Prisma.ProcessStepListRelationFilter> = z.object({
  every: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  some: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  none: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ResourceListRelationFilterSchema: z.ZodType<Prisma.ResourceListRelationFilter> = z.object({
  every: z.lazy(() => ResourceWhereInputSchema).optional(),
  some: z.lazy(() => ResourceWhereInputSchema).optional(),
  none: z.lazy(() => ResourceWhereInputSchema).optional()
}).strict();

export const ProcessStepOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProcessStepOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResourceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResourceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationSumOrderByAggregateInputSchema: z.ZodType<Prisma.LocationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OrderListRelationFilterSchema: z.ZodType<Prisma.OrderListRelationFilter> = z.object({
  every: z.lazy(() => OrderWhereInputSchema).optional(),
  some: z.lazy(() => OrderWhereInputSchema).optional(),
  none: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const RecipeNullableRelationFilterSchema: z.ZodType<Prisma.RecipeNullableRelationFilter> = z.object({
  is: z.lazy(() => RecipeWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => RecipeWhereInputSchema).optional().nullable()
}).strict();

export const SensorListRelationFilterSchema: z.ZodType<Prisma.SensorListRelationFilter> = z.object({
  every: z.lazy(() => SensorWhereInputSchema).optional(),
  some: z.lazy(() => SensorWhereInputSchema).optional(),
  none: z.lazy(() => SensorWhereInputSchema).optional()
}).strict();

export const TransportSystemListRelationFilterSchema: z.ZodType<Prisma.TransportSystemListRelationFilter> = z.object({
  every: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  some: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  none: z.lazy(() => TransportSystemWhereInputSchema).optional()
}).strict();

export const OrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SensorOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TransportSystemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProcessStepCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProcessStepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProcessStepAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProcessStepAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProcessStepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProcessStepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProcessStepMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProcessStepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProcessStepSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProcessStepSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  recipeRate: z.lazy(() => SortOrderSchema).optional(),
  duration: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const RecipeInputListRelationFilterSchema: z.ZodType<Prisma.RecipeInputListRelationFilter> = z.object({
  every: z.lazy(() => RecipeInputWhereInputSchema).optional(),
  some: z.lazy(() => RecipeInputWhereInputSchema).optional(),
  none: z.lazy(() => RecipeInputWhereInputSchema).optional()
}).strict();

export const RecipeOutputListRelationFilterSchema: z.ZodType<Prisma.RecipeOutputListRelationFilter> = z.object({
  every: z.lazy(() => RecipeOutputWhereInputSchema).optional(),
  some: z.lazy(() => RecipeOutputWhereInputSchema).optional(),
  none: z.lazy(() => RecipeOutputWhereInputSchema).optional()
}).strict();

export const RecipeInputOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RecipeInputOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RecipeOutputOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeCountOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeMinOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeSumOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeInputMaterialRecipeIdCompoundUniqueInputSchema: z.ZodType<Prisma.RecipeInputMaterialRecipeIdCompoundUniqueInput> = z.object({
  material: z.string(),
  recipeId: z.number()
}).strict();

export const RecipeInputCountOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeInputCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeInputAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeInputAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeInputMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeInputMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeInputMinOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeInputMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeInputSumOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeInputSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputCountOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeOutputCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeOutputAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeOutputMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputMinOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeOutputMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RecipeOutputSumOrderByAggregateInputSchema: z.ZodType<Prisma.RecipeOutputSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  recipeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorNullableRelationFilterSchema: z.ZodType<Prisma.SensorNullableRelationFilter> = z.object({
  is: z.lazy(() => SensorWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SensorWhereInputSchema).optional().nullable()
}).strict();

export const LogEntryCountOrderByAggregateInputSchema: z.ZodType<Prisma.LogEntryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  inputType: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.lazy(() => SortOrderSchema).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  materialName: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogEntryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LogEntryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.lazy(() => SortOrderSchema).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogEntryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LogEntryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  inputType: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.lazy(() => SortOrderSchema).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  materialName: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogEntryMinOrderByAggregateInputSchema: z.ZodType<Prisma.LogEntryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  inputType: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.lazy(() => SortOrderSchema).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  materialName: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogEntrySumOrderByAggregateInputSchema: z.ZodType<Prisma.LogEntrySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sensorId: z.lazy(() => SortOrderSchema).optional(),
  materialId: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogEntryListRelationFilterSchema: z.ZodType<Prisma.LogEntryListRelationFilter> = z.object({
  every: z.lazy(() => LogEntryWhereInputSchema).optional(),
  some: z.lazy(() => LogEntryWhereInputSchema).optional(),
  none: z.lazy(() => LogEntryWhereInputSchema).optional()
}).strict();

export const LogEntryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LogEntryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorCountOrderByAggregateInputSchema: z.ZodType<Prisma.SensorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SensorAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SensorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorMinOrderByAggregateInputSchema: z.ZodType<Prisma.SensorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SensorSumOrderByAggregateInputSchema: z.ZodType<Prisma.SensorSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  sensorDelay: z.lazy(() => SortOrderSchema).optional(),
  processStepId: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterRelationFilterSchema: z.ZodType<Prisma.FilterRelationFilter> = z.object({
  is: z.lazy(() => FilterWhereInputSchema).optional(),
  isNot: z.lazy(() => FilterWhereInputSchema).optional()
}).strict();

export const FilterEntryCountOrderByAggregateInputSchema: z.ZodType<Prisma.FilterEntryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterEntryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FilterEntryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterEntryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FilterEntryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterEntryMinOrderByAggregateInputSchema: z.ZodType<Prisma.FilterEntryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addedAt: z.lazy(() => SortOrderSchema).optional(),
  material: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterEntrySumOrderByAggregateInputSchema: z.ZodType<Prisma.FilterEntrySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  filterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemRelationFilterSchema: z.ZodType<Prisma.TransportSystemRelationFilter> = z.object({
  is: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  isNot: z.lazy(() => TransportSystemWhereInputSchema).optional()
}).strict();

export const FilterEntryListRelationFilterSchema: z.ZodType<Prisma.FilterEntryListRelationFilter> = z.object({
  every: z.lazy(() => FilterEntryWhereInputSchema).optional(),
  some: z.lazy(() => FilterEntryWhereInputSchema).optional(),
  none: z.lazy(() => FilterEntryWhereInputSchema).optional()
}).strict();

export const FilterEntryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FilterEntryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterCountOrderByAggregateInputSchema: z.ZodType<Prisma.FilterCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FilterAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FilterMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterMinOrderByAggregateInputSchema: z.ZodType<Prisma.FilterMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterSumOrderByAggregateInputSchema: z.ZodType<Prisma.FilterSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  transportSystemId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FilterNullableRelationFilterSchema: z.ZodType<Prisma.FilterNullableRelationFilter> = z.object({
  is: z.lazy(() => FilterWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => FilterWhereInputSchema).optional().nullable()
}).strict();

export const TransportSystemCountOrderByAggregateInputSchema: z.ZodType<Prisma.TransportSystemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  transportDelay: z.lazy(() => SortOrderSchema).optional(),
  startStepId: z.lazy(() => SortOrderSchema).optional(),
  endStepId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TransportSystemAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  transportDelay: z.lazy(() => SortOrderSchema).optional(),
  startStepId: z.lazy(() => SortOrderSchema).optional(),
  endStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TransportSystemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  transportDelay: z.lazy(() => SortOrderSchema).optional(),
  startStepId: z.lazy(() => SortOrderSchema).optional(),
  endStepId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemMinOrderByAggregateInputSchema: z.ZodType<Prisma.TransportSystemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  transportDelay: z.lazy(() => SortOrderSchema).optional(),
  startStepId: z.lazy(() => SortOrderSchema).optional(),
  endStepId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransportSystemSumOrderByAggregateInputSchema: z.ZodType<Prisma.TransportSystemSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inputSpeed: z.lazy(() => SortOrderSchema).optional(),
  outputSpeed: z.lazy(() => SortOrderSchema).optional(),
  inventoryId: z.lazy(() => SortOrderSchema).optional(),
  minQuantity: z.lazy(() => SortOrderSchema).optional(),
  transportDelay: z.lazy(() => SortOrderSchema).optional(),
  startStepId: z.lazy(() => SortOrderSchema).optional(),
  endStepId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  dueDate: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  startedTick: z.lazy(() => SortOrderSchema).optional(),
  completedTick: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  canceledAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedTick: z.lazy(() => SortOrderSchema).optional(),
  completedTick: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  dueDate: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  startedTick: z.lazy(() => SortOrderSchema).optional(),
  completedTick: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  canceledAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  dueDate: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  startedTick: z.lazy(() => SortOrderSchema).optional(),
  completedTick: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  canceledAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  startedTick: z.lazy(() => SortOrderSchema).optional(),
  completedTick: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const MachineCreateNestedOneWithoutResourceInputSchema: z.ZodType<Prisma.MachineCreateNestedOneWithoutResourceInput> = z.object({
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MachineCreateOrConnectWithoutResourceInputSchema).optional(),
  connect: z.lazy(() => MachineWhereUniqueInputSchema).optional()
}).strict();

export const ProcessStepCreateNestedOneWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedOneWithoutResourcesInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutResourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutResourcesInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const LocationCreateNestedOneWithoutResourcesInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutResourcesInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedCreateWithoutResourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutResourcesInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const WorkerCreateNestedOneWithoutResourceInputSchema: z.ZodType<Prisma.WorkerCreateNestedOneWithoutResourceInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkerCreateOrConnectWithoutResourceInputSchema).optional(),
  connect: z.lazy(() => WorkerWhereUniqueInputSchema).optional()
}).strict();

export const MachineUncheckedCreateNestedOneWithoutResourceInputSchema: z.ZodType<Prisma.MachineUncheckedCreateNestedOneWithoutResourceInput> = z.object({
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MachineCreateOrConnectWithoutResourceInputSchema).optional(),
  connect: z.lazy(() => MachineWhereUniqueInputSchema).optional()
}).strict();

export const WorkerUncheckedCreateNestedOneWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUncheckedCreateNestedOneWithoutResourceInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkerCreateOrConnectWithoutResourceInputSchema).optional(),
  connect: z.lazy(() => WorkerWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const MachineUpdateOneWithoutResourceNestedInputSchema: z.ZodType<Prisma.MachineUpdateOneWithoutResourceNestedInput> = z.object({
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MachineCreateOrConnectWithoutResourceInputSchema).optional(),
  upsert: z.lazy(() => MachineUpsertWithoutResourceInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MachineWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MachineWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MachineWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MachineUpdateToOneWithWhereWithoutResourceInputSchema),z.lazy(() => MachineUpdateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedUpdateWithoutResourceInputSchema) ]).optional(),
}).strict();

export const ProcessStepUpdateOneRequiredWithoutResourcesNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateOneRequiredWithoutResourcesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutResourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutResourcesInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutResourcesInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutResourcesInputSchema),z.lazy(() => ProcessStepUpdateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutResourcesInputSchema) ]).optional(),
}).strict();

export const LocationUpdateOneRequiredWithoutResourcesNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneRequiredWithoutResourcesNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedCreateWithoutResourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutResourcesInputSchema).optional(),
  upsert: z.lazy(() => LocationUpsertWithoutResourcesInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutResourcesInputSchema),z.lazy(() => LocationUpdateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutResourcesInputSchema) ]).optional(),
}).strict();

export const WorkerUpdateOneWithoutResourceNestedInputSchema: z.ZodType<Prisma.WorkerUpdateOneWithoutResourceNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkerCreateOrConnectWithoutResourceInputSchema).optional(),
  upsert: z.lazy(() => WorkerUpsertWithoutResourceInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => WorkerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => WorkerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => WorkerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkerUpdateToOneWithWhereWithoutResourceInputSchema),z.lazy(() => WorkerUpdateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutResourceInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const MachineUncheckedUpdateOneWithoutResourceNestedInputSchema: z.ZodType<Prisma.MachineUncheckedUpdateOneWithoutResourceNestedInput> = z.object({
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MachineCreateOrConnectWithoutResourceInputSchema).optional(),
  upsert: z.lazy(() => MachineUpsertWithoutResourceInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MachineWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MachineWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MachineWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MachineUpdateToOneWithWhereWithoutResourceInputSchema),z.lazy(() => MachineUpdateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedUpdateWithoutResourceInputSchema) ]).optional(),
}).strict();

export const WorkerUncheckedUpdateOneWithoutResourceNestedInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateOneWithoutResourceNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkerCreateOrConnectWithoutResourceInputSchema).optional(),
  upsert: z.lazy(() => WorkerUpsertWithoutResourceInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => WorkerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => WorkerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => WorkerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkerUpdateToOneWithWhereWithoutResourceInputSchema),z.lazy(() => WorkerUpdateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutResourceInputSchema) ]).optional(),
}).strict();

export const ResourceCreateNestedOneWithoutMachineInputSchema: z.ZodType<Prisma.ResourceCreateNestedOneWithoutMachineInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutMachineInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResourceCreateOrConnectWithoutMachineInputSchema).optional(),
  connect: z.lazy(() => ResourceWhereUniqueInputSchema).optional()
}).strict();

export const ResourceUpdateOneRequiredWithoutMachineNestedInputSchema: z.ZodType<Prisma.ResourceUpdateOneRequiredWithoutMachineNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutMachineInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResourceCreateOrConnectWithoutMachineInputSchema).optional(),
  upsert: z.lazy(() => ResourceUpsertWithoutMachineInputSchema).optional(),
  connect: z.lazy(() => ResourceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateToOneWithWhereWithoutMachineInputSchema),z.lazy(() => ResourceUpdateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutMachineInputSchema) ]).optional(),
}).strict();

export const ResourceCreateNestedOneWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceCreateNestedOneWithoutWorkerInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutWorkerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResourceCreateOrConnectWithoutWorkerInputSchema).optional(),
  connect: z.lazy(() => ResourceWhereUniqueInputSchema).optional()
}).strict();

export const WorkerRoleCreateNestedManyWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleCreateNestedManyWithoutWorkersInput> = z.object({
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema).array(),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkerRoleUncheckedCreateNestedManyWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedCreateNestedManyWithoutWorkersInput> = z.object({
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema).array(),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResourceUpdateOneRequiredWithoutWorkerNestedInputSchema: z.ZodType<Prisma.ResourceUpdateOneRequiredWithoutWorkerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutWorkerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResourceCreateOrConnectWithoutWorkerInputSchema).optional(),
  upsert: z.lazy(() => ResourceUpsertWithoutWorkerInputSchema).optional(),
  connect: z.lazy(() => ResourceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateToOneWithWhereWithoutWorkerInputSchema),z.lazy(() => ResourceUpdateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutWorkerInputSchema) ]).optional(),
}).strict();

export const WorkerRoleUpdateManyWithoutWorkersNestedInputSchema: z.ZodType<Prisma.WorkerRoleUpdateManyWithoutWorkersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema).array(),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkerRoleUpsertWithWhereUniqueWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpsertWithWhereUniqueWithoutWorkersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkerRoleUpdateWithWhereUniqueWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpdateWithWhereUniqueWithoutWorkersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkerRoleUpdateManyWithWhereWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpdateManyWithWhereWithoutWorkersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkerRoleScalarWhereInputSchema),z.lazy(() => WorkerRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkerRoleUncheckedUpdateManyWithoutWorkersNestedInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedUpdateManyWithoutWorkersNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema).array(),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema),z.lazy(() => WorkerRoleCreateOrConnectWithoutWorkersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkerRoleUpsertWithWhereUniqueWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpsertWithWhereUniqueWithoutWorkersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerRoleWhereUniqueInputSchema),z.lazy(() => WorkerRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkerRoleUpdateWithWhereUniqueWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpdateWithWhereUniqueWithoutWorkersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkerRoleUpdateManyWithWhereWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUpdateManyWithWhereWithoutWorkersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkerRoleScalarWhereInputSchema),z.lazy(() => WorkerRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkerCreateNestedManyWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerCreateNestedManyWithoutWorkerRolesInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema).array(),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const WorkerUncheckedCreateNestedManyWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUncheckedCreateNestedManyWithoutWorkerRolesInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema).array(),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const WorkerUpdateManyWithoutWorkerRolesNestedInputSchema: z.ZodType<Prisma.WorkerUpdateManyWithoutWorkerRolesNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema).array(),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkerUpsertWithWhereUniqueWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpsertWithWhereUniqueWithoutWorkerRolesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkerUpdateWithWhereUniqueWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpdateWithWhereUniqueWithoutWorkerRolesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkerUpdateManyWithWhereWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpdateManyWithWhereWithoutWorkerRolesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkerScalarWhereInputSchema),z.lazy(() => WorkerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const WorkerUncheckedUpdateManyWithoutWorkerRolesNestedInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateManyWithoutWorkerRolesNestedInput> = z.object({
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema).array(),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema),z.lazy(() => WorkerCreateOrConnectWithoutWorkerRolesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkerUpsertWithWhereUniqueWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpsertWithWhereUniqueWithoutWorkerRolesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkerWhereUniqueInputSchema),z.lazy(() => WorkerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkerUpdateWithWhereUniqueWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpdateWithWhereUniqueWithoutWorkerRolesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkerUpdateManyWithWhereWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUpdateManyWithWhereWithoutWorkerRolesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkerScalarWhereInputSchema),z.lazy(() => WorkerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryEntryCreateNestedManyWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryCreateNestedManyWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyInventoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepCreateNestedOneWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedOneWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInventoryInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const TransportSystemCreateNestedOneWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedOneWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutInventoryInputSchema).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedCreateNestedManyWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedCreateNestedManyWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyInventoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedCreateNestedOneWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateNestedOneWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInventoryInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateNestedOneWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateNestedOneWithoutInventoryInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutInventoryInputSchema).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional()
}).strict();

export const InventoryEntryUpdateManyWithoutInventoryNestedInputSchema: z.ZodType<Prisma.InventoryEntryUpdateManyWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutInventoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyInventoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutInventoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutInventoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUpdateOneWithoutInventoryNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateOneWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInventoryInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutInventoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutInventoryInputSchema),z.lazy(() => ProcessStepUpdateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInventoryInputSchema) ]).optional(),
}).strict();

export const TransportSystemUpdateOneWithoutInventoryNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateOneWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutInventoryInputSchema).optional(),
  upsert: z.lazy(() => TransportSystemUpsertWithoutInventoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateToOneWithWhereWithoutInventoryInputSchema),z.lazy(() => TransportSystemUpdateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutInventoryInputSchema) ]).optional(),
}).strict();

export const InventoryEntryUncheckedUpdateManyWithoutInventoryNestedInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateManyWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutInventoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutInventoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyInventoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutInventoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutInventoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedUpdateOneWithoutInventoryNestedInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateOneWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInventoryInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutInventoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutInventoryInputSchema),z.lazy(() => ProcessStepUpdateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInventoryInputSchema) ]).optional(),
}).strict();

export const TransportSystemUncheckedUpdateOneWithoutInventoryNestedInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateOneWithoutInventoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutInventoryInputSchema).optional(),
  upsert: z.lazy(() => TransportSystemUpsertWithoutInventoryInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateToOneWithWhereWithoutInventoryInputSchema),z.lazy(() => TransportSystemUpdateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutInventoryInputSchema) ]).optional(),
}).strict();

export const InventoryCreateNestedOneWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryCreateNestedOneWithoutEntriesInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutEntriesInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional()
}).strict();

export const OrderCreateNestedOneWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutInventoryEntriesInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedCreateWithoutInventoryEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutInventoryEntriesInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const InventoryUpdateOneRequiredWithoutEntriesNestedInputSchema: z.ZodType<Prisma.InventoryUpdateOneRequiredWithoutEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutEntriesInputSchema).optional(),
  upsert: z.lazy(() => InventoryUpsertWithoutEntriesInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InventoryUpdateToOneWithWhereWithoutEntriesInputSchema),z.lazy(() => InventoryUpdateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutEntriesInputSchema) ]).optional(),
}).strict();

export const OrderUpdateOneWithoutInventoryEntriesNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneWithoutInventoryEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedCreateWithoutInventoryEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutInventoryEntriesInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutInventoryEntriesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUpdateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutInventoryEntriesInputSchema) ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProcessStepCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateWithoutLocationInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResourceCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.ResourceCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceCreateWithoutLocationInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateWithoutLocationInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResourceUncheckedCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceCreateWithoutLocationInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateWithoutLocationInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResourceUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.ResourceUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceCreateWithoutLocationInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResourceUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ResourceUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ResourceUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResourceUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => ResourceUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateWithoutLocationInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResourceUncheckedUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceCreateWithoutLocationInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResourceUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ResourceUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => ResourceUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResourceUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => ResourceUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderCreateNestedManyWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutProcessStepsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateWithoutProcessStepsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RecipeCreateNestedOneWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeCreateNestedOneWithoutProcessStepsInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutProcessStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutProcessStepsInputSchema).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional()
}).strict();

export const InventoryCreateNestedOneWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryCreateNestedOneWithoutProcessStepInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutProcessStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutProcessStepInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional()
}).strict();

export const LocationCreateNestedOneWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutProcessStepsInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedCreateWithoutProcessStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutProcessStepsInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const ResourceCreateNestedManyWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceCreateNestedManyWithoutProcessStepInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateWithoutProcessStepInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyProcessStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SensorCreateNestedManyWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorCreateNestedManyWithoutProcessStepInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorCreateWithoutProcessStepInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyProcessStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemCreateNestedManyWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedManyWithoutEndStepInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyEndStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemCreateNestedManyWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedManyWithoutStartStepInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyStartStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutProcessStepsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateWithoutProcessStepsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateNestedManyWithoutProcessStepInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateWithoutProcessStepInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyProcessStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUncheckedCreateNestedManyWithoutProcessStepInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorCreateWithoutProcessStepInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyProcessStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateNestedManyWithoutEndStepInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyEndStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateNestedManyWithoutStartStepInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyStartStepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OrderUpdateManyWithoutProcessStepsNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutProcessStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateWithoutProcessStepsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutProcessStepsInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutProcessStepsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutProcessStepsInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutProcessStepsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutProcessStepsInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutProcessStepsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeUpdateOneWithoutProcessStepsNestedInputSchema: z.ZodType<Prisma.RecipeUpdateOneWithoutProcessStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutProcessStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutProcessStepsInputSchema).optional(),
  upsert: z.lazy(() => RecipeUpsertWithoutProcessStepsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RecipeUpdateToOneWithWhereWithoutProcessStepsInputSchema),z.lazy(() => RecipeUpdateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutProcessStepsInputSchema) ]).optional(),
}).strict();

export const InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema: z.ZodType<Prisma.InventoryUpdateOneRequiredWithoutProcessStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutProcessStepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutProcessStepInputSchema).optional(),
  upsert: z.lazy(() => InventoryUpsertWithoutProcessStepInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InventoryUpdateToOneWithWhereWithoutProcessStepInputSchema),z.lazy(() => InventoryUpdateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutProcessStepInputSchema) ]).optional(),
}).strict();

export const LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneRequiredWithoutProcessStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedCreateWithoutProcessStepsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutProcessStepsInputSchema).optional(),
  upsert: z.lazy(() => LocationUpsertWithoutProcessStepsInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutProcessStepsInputSchema),z.lazy(() => LocationUpdateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutProcessStepsInputSchema) ]).optional(),
}).strict();

export const ResourceUpdateManyWithoutProcessStepNestedInputSchema: z.ZodType<Prisma.ResourceUpdateManyWithoutProcessStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateWithoutProcessStepInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResourceUpsertWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => ResourceUpsertWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyProcessStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => ResourceUpdateWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResourceUpdateManyWithWhereWithoutProcessStepInputSchema),z.lazy(() => ResourceUpdateManyWithWhereWithoutProcessStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SensorUpdateManyWithoutProcessStepNestedInputSchema: z.ZodType<Prisma.SensorUpdateManyWithoutProcessStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorCreateWithoutProcessStepInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SensorUpsertWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => SensorUpsertWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyProcessStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SensorUpdateWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => SensorUpdateWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SensorUpdateManyWithWhereWithoutProcessStepInputSchema),z.lazy(() => SensorUpdateManyWithWhereWithoutProcessStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUpdateManyWithoutEndStepNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithoutEndStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutEndStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyEndStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutEndStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutEndStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUpdateManyWithoutStartStepNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithoutStartStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutStartStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyStartStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutStartStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutStartStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutProcessStepsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateWithoutProcessStepsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutProcessStepsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutProcessStepsInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutProcessStepsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutProcessStepsInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutProcessStepsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutProcessStepsInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutProcessStepsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateManyWithoutProcessStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateWithoutProcessStepInputSchema).array(),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => ResourceCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResourceUpsertWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => ResourceUpsertWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResourceCreateManyProcessStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResourceWhereUniqueInputSchema),z.lazy(() => ResourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResourceUpdateWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => ResourceUpdateWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResourceUpdateManyWithWhereWithoutProcessStepInputSchema),z.lazy(() => ResourceUpdateManyWithWhereWithoutProcessStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateManyWithoutProcessStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorCreateWithoutProcessStepInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema),z.lazy(() => SensorCreateOrConnectWithoutProcessStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SensorUpsertWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => SensorUpsertWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyProcessStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SensorUpdateWithWhereUniqueWithoutProcessStepInputSchema),z.lazy(() => SensorUpdateWithWhereUniqueWithoutProcessStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SensorUpdateManyWithWhereWithoutProcessStepInputSchema),z.lazy(() => SensorUpdateManyWithWhereWithoutProcessStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutEndStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutEndStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutEndStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyEndStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutEndStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutEndStepInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutEndStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutStartStepNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutStartStepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutStartStepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransportSystemCreateManyStartStepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutStartStepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutStartStepInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutStartStepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RecipeInputCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeInputCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RecipeOutputCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeOutputCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RecipeInputUncheckedCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUncheckedCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeInputCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RecipeOutputUncheckedCreateNestedManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedCreateNestedManyWithoutRecipeInput> = z.object({
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeOutputCreateManyRecipeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeInputUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.RecipeInputUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RecipeInputUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeInputCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RecipeInputUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RecipeInputUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RecipeInputScalarWhereInputSchema),z.lazy(() => RecipeInputScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeOutputUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.RecipeOutputUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RecipeOutputUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeOutputCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RecipeOutputUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RecipeOutputUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RecipeOutputScalarWhereInputSchema),z.lazy(() => RecipeOutputScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProcessStepCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeInputUncheckedUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.RecipeInputUncheckedUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeInputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RecipeInputUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeInputCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RecipeInputWhereUniqueInputSchema),z.lazy(() => RecipeInputWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RecipeInputUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RecipeInputUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => RecipeInputUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RecipeInputScalarWhereInputSchema),z.lazy(() => RecipeInputScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeOutputUncheckedUpdateManyWithoutRecipeNestedInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedUpdateManyWithoutRecipeNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema).array(),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema),z.lazy(() => RecipeOutputCreateOrConnectWithoutRecipeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RecipeOutputUpsertWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpsertWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RecipeOutputCreateManyRecipeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RecipeOutputWhereUniqueInputSchema),z.lazy(() => RecipeOutputWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RecipeOutputUpdateWithWhereUniqueWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpdateWithWhereUniqueWithoutRecipeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RecipeOutputUpdateManyWithWhereWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUpdateManyWithWhereWithoutRecipeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RecipeOutputScalarWhereInputSchema),z.lazy(() => RecipeOutputScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RecipeCreateNestedOneWithoutInputsInputSchema: z.ZodType<Prisma.RecipeCreateNestedOneWithoutInputsInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutInputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutInputsInputSchema).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional()
}).strict();

export const RecipeUpdateOneWithoutInputsNestedInputSchema: z.ZodType<Prisma.RecipeUpdateOneWithoutInputsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutInputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutInputsInputSchema).optional(),
  upsert: z.lazy(() => RecipeUpsertWithoutInputsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RecipeUpdateToOneWithWhereWithoutInputsInputSchema),z.lazy(() => RecipeUpdateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutInputsInputSchema) ]).optional(),
}).strict();

export const RecipeCreateNestedOneWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeCreateNestedOneWithoutOutputsInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutOutputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutOutputsInputSchema).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional()
}).strict();

export const RecipeUpdateOneWithoutOutputsNestedInputSchema: z.ZodType<Prisma.RecipeUpdateOneWithoutOutputsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RecipeCreateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutOutputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RecipeCreateOrConnectWithoutOutputsInputSchema).optional(),
  upsert: z.lazy(() => RecipeUpsertWithoutOutputsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RecipeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RecipeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RecipeUpdateToOneWithWhereWithoutOutputsInputSchema),z.lazy(() => RecipeUpdateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutOutputsInputSchema) ]).optional(),
}).strict();

export const SensorCreateNestedOneWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorCreateNestedOneWithoutLogEntriesInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedCreateWithoutLogEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SensorCreateOrConnectWithoutLogEntriesInputSchema).optional(),
  connect: z.lazy(() => SensorWhereUniqueInputSchema).optional()
}).strict();

export const SensorUpdateOneWithoutLogEntriesNestedInputSchema: z.ZodType<Prisma.SensorUpdateOneWithoutLogEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedCreateWithoutLogEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SensorCreateOrConnectWithoutLogEntriesInputSchema).optional(),
  upsert: z.lazy(() => SensorUpsertWithoutLogEntriesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => SensorWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => SensorWhereInputSchema) ]).optional(),
  connect: z.lazy(() => SensorWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SensorUpdateToOneWithWhereWithoutLogEntriesInputSchema),z.lazy(() => SensorUpdateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutLogEntriesInputSchema) ]).optional(),
}).strict();

export const ProcessStepCreateNestedOneWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedOneWithoutSensorsInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutSensorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutSensorsInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const TransportSystemCreateNestedOneWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedOneWithoutSensorsInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutSensorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutSensorsInputSchema).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional()
}).strict();

export const LogEntryCreateNestedManyWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryCreateNestedManyWithoutSensorInput> = z.object({
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryCreateWithoutSensorInputSchema).array(),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema),z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LogEntryCreateManySensorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LogEntryUncheckedCreateNestedManyWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUncheckedCreateNestedManyWithoutSensorInput> = z.object({
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryCreateWithoutSensorInputSchema).array(),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema),z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LogEntryCreateManySensorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUpdateOneWithoutSensorsNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateOneWithoutSensorsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutSensorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutSensorsInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutSensorsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutSensorsInputSchema),z.lazy(() => ProcessStepUpdateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutSensorsInputSchema) ]).optional(),
}).strict();

export const TransportSystemUpdateOneWithoutSensorsNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateOneWithoutSensorsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutSensorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutSensorsInputSchema).optional(),
  upsert: z.lazy(() => TransportSystemUpsertWithoutSensorsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TransportSystemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateToOneWithWhereWithoutSensorsInputSchema),z.lazy(() => TransportSystemUpdateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutSensorsInputSchema) ]).optional(),
}).strict();

export const LogEntryUpdateManyWithoutSensorNestedInputSchema: z.ZodType<Prisma.LogEntryUpdateManyWithoutSensorNestedInput> = z.object({
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryCreateWithoutSensorInputSchema).array(),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema),z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LogEntryUpsertWithWhereUniqueWithoutSensorInputSchema),z.lazy(() => LogEntryUpsertWithWhereUniqueWithoutSensorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LogEntryCreateManySensorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LogEntryUpdateWithWhereUniqueWithoutSensorInputSchema),z.lazy(() => LogEntryUpdateWithWhereUniqueWithoutSensorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LogEntryUpdateManyWithWhereWithoutSensorInputSchema),z.lazy(() => LogEntryUpdateManyWithWhereWithoutSensorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LogEntryScalarWhereInputSchema),z.lazy(() => LogEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LogEntryUncheckedUpdateManyWithoutSensorNestedInputSchema: z.ZodType<Prisma.LogEntryUncheckedUpdateManyWithoutSensorNestedInput> = z.object({
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryCreateWithoutSensorInputSchema).array(),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema),z.lazy(() => LogEntryCreateOrConnectWithoutSensorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LogEntryUpsertWithWhereUniqueWithoutSensorInputSchema),z.lazy(() => LogEntryUpsertWithWhereUniqueWithoutSensorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LogEntryCreateManySensorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LogEntryWhereUniqueInputSchema),z.lazy(() => LogEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LogEntryUpdateWithWhereUniqueWithoutSensorInputSchema),z.lazy(() => LogEntryUpdateWithWhereUniqueWithoutSensorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LogEntryUpdateManyWithWhereWithoutSensorInputSchema),z.lazy(() => LogEntryUpdateManyWithWhereWithoutSensorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LogEntryScalarWhereInputSchema),z.lazy(() => LogEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FilterCreateNestedOneWithoutEntriesInputSchema: z.ZodType<Prisma.FilterCreateNestedOneWithoutEntriesInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedCreateWithoutEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutEntriesInputSchema).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional()
}).strict();

export const FilterUpdateOneRequiredWithoutEntriesNestedInputSchema: z.ZodType<Prisma.FilterUpdateOneRequiredWithoutEntriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedCreateWithoutEntriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutEntriesInputSchema).optional(),
  upsert: z.lazy(() => FilterUpsertWithoutEntriesInputSchema).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FilterUpdateToOneWithWhereWithoutEntriesInputSchema),z.lazy(() => FilterUpdateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutEntriesInputSchema) ]).optional(),
}).strict();

export const TransportSystemCreateNestedOneWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedOneWithoutFilterInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutFilterInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutFilterInputSchema).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional()
}).strict();

export const FilterEntryCreateNestedManyWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryCreateNestedManyWithoutFilterInput> = z.object({
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateWithoutFilterInputSchema).array(),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FilterEntryCreateManyFilterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FilterEntryUncheckedCreateNestedManyWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUncheckedCreateNestedManyWithoutFilterInput> = z.object({
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateWithoutFilterInputSchema).array(),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FilterEntryCreateManyFilterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUpdateOneRequiredWithoutFilterNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateOneRequiredWithoutFilterNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutFilterInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TransportSystemCreateOrConnectWithoutFilterInputSchema).optional(),
  upsert: z.lazy(() => TransportSystemUpsertWithoutFilterInputSchema).optional(),
  connect: z.lazy(() => TransportSystemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateToOneWithWhereWithoutFilterInputSchema),z.lazy(() => TransportSystemUpdateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutFilterInputSchema) ]).optional(),
}).strict();

export const FilterEntryUpdateManyWithoutFilterNestedInputSchema: z.ZodType<Prisma.FilterEntryUpdateManyWithoutFilterNestedInput> = z.object({
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateWithoutFilterInputSchema).array(),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FilterEntryUpsertWithWhereUniqueWithoutFilterInputSchema),z.lazy(() => FilterEntryUpsertWithWhereUniqueWithoutFilterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FilterEntryCreateManyFilterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FilterEntryUpdateWithWhereUniqueWithoutFilterInputSchema),z.lazy(() => FilterEntryUpdateWithWhereUniqueWithoutFilterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FilterEntryUpdateManyWithWhereWithoutFilterInputSchema),z.lazy(() => FilterEntryUpdateManyWithWhereWithoutFilterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FilterEntryScalarWhereInputSchema),z.lazy(() => FilterEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FilterEntryUncheckedUpdateManyWithoutFilterNestedInputSchema: z.ZodType<Prisma.FilterEntryUncheckedUpdateManyWithoutFilterNestedInput> = z.object({
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateWithoutFilterInputSchema).array(),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema),z.lazy(() => FilterEntryCreateOrConnectWithoutFilterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FilterEntryUpsertWithWhereUniqueWithoutFilterInputSchema),z.lazy(() => FilterEntryUpsertWithWhereUniqueWithoutFilterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FilterEntryCreateManyFilterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FilterEntryWhereUniqueInputSchema),z.lazy(() => FilterEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FilterEntryUpdateWithWhereUniqueWithoutFilterInputSchema),z.lazy(() => FilterEntryUpdateWithWhereUniqueWithoutFilterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FilterEntryUpdateManyWithWhereWithoutFilterInputSchema),z.lazy(() => FilterEntryUpdateManyWithWhereWithoutFilterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FilterEntryScalarWhereInputSchema),z.lazy(() => FilterEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FilterCreateNestedOneWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterCreateNestedOneWithoutTransportSystemInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional()
}).strict();

export const ProcessStepCreateNestedOneWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedOneWithoutInputsInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInputsInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const ProcessStepCreateNestedOneWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedOneWithoutOutputsInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOutputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutOutputsInputSchema).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional()
}).strict();

export const InventoryCreateNestedOneWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryCreateNestedOneWithoutTransportSystemInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional()
}).strict();

export const OrderCreateNestedManyWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutTransportSystemsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SensorCreateNestedManyWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorCreateNestedManyWithoutTransportSystemInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateWithoutTransportSystemInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyTransportSystemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUncheckedCreateNestedOneWithoutTransportSystemInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional()
}).strict();

export const OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutTransportSystemsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUncheckedCreateNestedManyWithoutTransportSystemInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateWithoutTransportSystemInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyTransportSystemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FilterUpdateOneWithoutTransportSystemNestedInputSchema: z.ZodType<Prisma.FilterUpdateOneWithoutTransportSystemNestedInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  upsert: z.lazy(() => FilterUpsertWithoutTransportSystemInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FilterWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FilterWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FilterUpdateToOneWithWhereWithoutTransportSystemInputSchema),z.lazy(() => FilterUpdateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutTransportSystemInputSchema) ]).optional(),
}).strict();

export const ProcessStepUpdateOneWithoutInputsNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateOneWithoutInputsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutInputsInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutInputsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutInputsInputSchema),z.lazy(() => ProcessStepUpdateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInputsInputSchema) ]).optional(),
}).strict();

export const ProcessStepUpdateOneWithoutOutputsNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateOneWithoutOutputsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOutputsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProcessStepCreateOrConnectWithoutOutputsInputSchema).optional(),
  upsert: z.lazy(() => ProcessStepUpsertWithoutOutputsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProcessStepWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProcessStepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateToOneWithWhereWithoutOutputsInputSchema),z.lazy(() => ProcessStepUpdateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutOutputsInputSchema) ]).optional(),
}).strict();

export const InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema: z.ZodType<Prisma.InventoryUpdateOneRequiredWithoutTransportSystemNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryCreateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InventoryCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  upsert: z.lazy(() => InventoryUpsertWithoutTransportSystemInputSchema).optional(),
  connect: z.lazy(() => InventoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InventoryUpdateToOneWithWhereWithoutTransportSystemInputSchema),z.lazy(() => InventoryUpdateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutTransportSystemInputSchema) ]).optional(),
}).strict();

export const OrderUpdateManyWithoutTransportSystemsNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutTransportSystemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransportSystemsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransportSystemsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutTransportSystemsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SensorUpdateManyWithoutTransportSystemNestedInputSchema: z.ZodType<Prisma.SensorUpdateManyWithoutTransportSystemNestedInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateWithoutTransportSystemInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SensorUpsertWithWhereUniqueWithoutTransportSystemInputSchema),z.lazy(() => SensorUpsertWithWhereUniqueWithoutTransportSystemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyTransportSystemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SensorUpdateWithWhereUniqueWithoutTransportSystemInputSchema),z.lazy(() => SensorUpdateWithWhereUniqueWithoutTransportSystemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SensorUpdateManyWithWhereWithoutTransportSystemInputSchema),z.lazy(() => SensorUpdateManyWithWhereWithoutTransportSystemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema: z.ZodType<Prisma.FilterUncheckedUpdateOneWithoutTransportSystemNestedInput> = z.object({
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FilterCreateOrConnectWithoutTransportSystemInputSchema).optional(),
  upsert: z.lazy(() => FilterUpsertWithoutTransportSystemInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FilterWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FilterWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FilterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FilterUpdateToOneWithWhereWithoutTransportSystemInputSchema),z.lazy(() => FilterUpdateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutTransportSystemInputSchema) ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutTransportSystemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema).array(),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema),z.lazy(() => OrderCreateOrConnectWithoutTransportSystemsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpsertWithWhereUniqueWithoutTransportSystemsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema),z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpdateWithWhereUniqueWithoutTransportSystemsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutTransportSystemsInputSchema),z.lazy(() => OrderUpdateManyWithWhereWithoutTransportSystemsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateManyWithoutTransportSystemNestedInput> = z.object({
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateWithoutTransportSystemInputSchema).array(),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema),z.lazy(() => SensorCreateOrConnectWithoutTransportSystemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SensorUpsertWithWhereUniqueWithoutTransportSystemInputSchema),z.lazy(() => SensorUpsertWithWhereUniqueWithoutTransportSystemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SensorCreateManyTransportSystemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SensorWhereUniqueInputSchema),z.lazy(() => SensorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SensorUpdateWithWhereUniqueWithoutTransportSystemInputSchema),z.lazy(() => SensorUpdateWithWhereUniqueWithoutTransportSystemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SensorUpdateManyWithWhereWithoutTransportSystemInputSchema),z.lazy(() => SensorUpdateManyWithWhereWithoutTransportSystemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryEntryCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepCreateNestedManyWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepCreateNestedManyWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemCreateNestedManyWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemCreateNestedManyWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InventoryEntryUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedCreateNestedManyWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateNestedManyWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedCreateNestedManyWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateNestedManyWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const InventoryEntryUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.InventoryEntryUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUpdateManyWithoutOrdersNestedInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutOrdersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUpdateManyWithoutOrdersNestedInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutOrdersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InventoryEntryUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema).array(),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema),z.lazy(() => InventoryEntryCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InventoryEntryCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InventoryEntryWhereUniqueInputSchema),z.lazy(() => InventoryEntryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => InventoryEntryUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutOrdersNestedInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema).array(),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => ProcessStepCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpsertWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProcessStepWhereUniqueInputSchema),z.lazy(() => ProcessStepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpdateWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProcessStepUpdateManyWithWhereWithoutOrdersInputSchema),z.lazy(() => ProcessStepUpdateManyWithWhereWithoutOrdersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutOrdersNestedInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema).array(),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema),z.lazy(() => TransportSystemCreateOrConnectWithoutOrdersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpsertWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransportSystemWhereUniqueInputSchema),z.lazy(() => TransportSystemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpdateWithWhereUniqueWithoutOrdersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransportSystemUpdateManyWithWhereWithoutOrdersInputSchema),z.lazy(() => TransportSystemUpdateManyWithWhereWithoutOrdersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const MachineCreateWithoutResourceInputSchema: z.ZodType<Prisma.MachineCreateWithoutResourceInput> = z.object({
}).strict();

export const MachineUncheckedCreateWithoutResourceInputSchema: z.ZodType<Prisma.MachineUncheckedCreateWithoutResourceInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const MachineCreateOrConnectWithoutResourceInputSchema: z.ZodType<Prisma.MachineCreateOrConnectWithoutResourceInput> = z.object({
  where: z.lazy(() => MachineWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]),
}).strict();

export const ProcessStepCreateWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutResourcesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutResourcesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutResourcesInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutResourcesInputSchema) ]),
}).strict();

export const LocationCreateWithoutResourcesInputSchema: z.ZodType<Prisma.LocationCreateWithoutResourcesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUncheckedCreateWithoutResourcesInputSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutResourcesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationCreateOrConnectWithoutResourcesInputSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutResourcesInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationCreateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedCreateWithoutResourcesInputSchema) ]),
}).strict();

export const WorkerCreateWithoutResourceInputSchema: z.ZodType<Prisma.WorkerCreateWithoutResourceInput> = z.object({
  workerRoles: z.lazy(() => WorkerRoleCreateNestedManyWithoutWorkersInputSchema).optional()
}).strict();

export const WorkerUncheckedCreateWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUncheckedCreateWithoutResourceInput> = z.object({
  id: z.number().int().optional(),
  workerRoles: z.lazy(() => WorkerRoleUncheckedCreateNestedManyWithoutWorkersInputSchema).optional()
}).strict();

export const WorkerCreateOrConnectWithoutResourceInputSchema: z.ZodType<Prisma.WorkerCreateOrConnectWithoutResourceInput> = z.object({
  where: z.lazy(() => WorkerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]),
}).strict();

export const MachineUpsertWithoutResourceInputSchema: z.ZodType<Prisma.MachineUpsertWithoutResourceInput> = z.object({
  update: z.union([ z.lazy(() => MachineUpdateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedUpdateWithoutResourceInputSchema) ]),
  create: z.union([ z.lazy(() => MachineCreateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedCreateWithoutResourceInputSchema) ]),
  where: z.lazy(() => MachineWhereInputSchema).optional()
}).strict();

export const MachineUpdateToOneWithWhereWithoutResourceInputSchema: z.ZodType<Prisma.MachineUpdateToOneWithWhereWithoutResourceInput> = z.object({
  where: z.lazy(() => MachineWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MachineUpdateWithoutResourceInputSchema),z.lazy(() => MachineUncheckedUpdateWithoutResourceInputSchema) ]),
}).strict();

export const MachineUpdateWithoutResourceInputSchema: z.ZodType<Prisma.MachineUpdateWithoutResourceInput> = z.object({
}).strict();

export const MachineUncheckedUpdateWithoutResourceInputSchema: z.ZodType<Prisma.MachineUncheckedUpdateWithoutResourceInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProcessStepUpsertWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithoutResourcesInput> = z.object({
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutResourcesInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutResourcesInputSchema) ]),
  where: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ProcessStepUpdateToOneWithWhereWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepUpdateToOneWithWhereWithoutResourcesInput> = z.object({
  where: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutResourcesInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutResourcesInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutResourcesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutResourcesInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutResourcesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const LocationUpsertWithoutResourcesInputSchema: z.ZodType<Prisma.LocationUpsertWithoutResourcesInput> = z.object({
  update: z.union([ z.lazy(() => LocationUpdateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutResourcesInputSchema) ]),
  create: z.union([ z.lazy(() => LocationCreateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedCreateWithoutResourcesInputSchema) ]),
  where: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutResourcesInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutResourcesInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutResourcesInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutResourcesInputSchema) ]),
}).strict();

export const LocationUpdateWithoutResourcesInputSchema: z.ZodType<Prisma.LocationUpdateWithoutResourcesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateWithoutResourcesInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutResourcesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const WorkerUpsertWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUpsertWithoutResourceInput> = z.object({
  update: z.union([ z.lazy(() => WorkerUpdateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutResourceInputSchema) ]),
  create: z.union([ z.lazy(() => WorkerCreateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutResourceInputSchema) ]),
  where: z.lazy(() => WorkerWhereInputSchema).optional()
}).strict();

export const WorkerUpdateToOneWithWhereWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUpdateToOneWithWhereWithoutResourceInput> = z.object({
  where: z.lazy(() => WorkerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkerUpdateWithoutResourceInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutResourceInputSchema) ]),
}).strict();

export const WorkerUpdateWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUpdateWithoutResourceInput> = z.object({
  workerRoles: z.lazy(() => WorkerRoleUpdateManyWithoutWorkersNestedInputSchema).optional()
}).strict();

export const WorkerUncheckedUpdateWithoutResourceInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateWithoutResourceInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workerRoles: z.lazy(() => WorkerRoleUncheckedUpdateManyWithoutWorkersNestedInputSchema).optional()
}).strict();

export const ResourceCreateWithoutMachineInputSchema: z.ZodType<Prisma.ResourceCreateWithoutMachineInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutResourcesInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutResourcesInputSchema),
  Worker: z.lazy(() => WorkerCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceUncheckedCreateWithoutMachineInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateWithoutMachineInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int(),
  processStepId: z.number().int(),
  Worker: z.lazy(() => WorkerUncheckedCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceCreateOrConnectWithoutMachineInputSchema: z.ZodType<Prisma.ResourceCreateOrConnectWithoutMachineInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResourceCreateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutMachineInputSchema) ]),
}).strict();

export const ResourceUpsertWithoutMachineInputSchema: z.ZodType<Prisma.ResourceUpsertWithoutMachineInput> = z.object({
  update: z.union([ z.lazy(() => ResourceUpdateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutMachineInputSchema) ]),
  create: z.union([ z.lazy(() => ResourceCreateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutMachineInputSchema) ]),
  where: z.lazy(() => ResourceWhereInputSchema).optional()
}).strict();

export const ResourceUpdateToOneWithWhereWithoutMachineInputSchema: z.ZodType<Prisma.ResourceUpdateToOneWithWhereWithoutMachineInput> = z.object({
  where: z.lazy(() => ResourceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResourceUpdateWithoutMachineInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutMachineInputSchema) ]),
}).strict();

export const ResourceUpdateWithoutMachineInputSchema: z.ZodType<Prisma.ResourceUpdateWithoutMachineInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateWithoutMachineInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateWithoutMachineInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Worker: z.lazy(() => WorkerUncheckedUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceCreateWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceCreateWithoutWorkerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  Machine: z.lazy(() => MachineCreateNestedOneWithoutResourceInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutResourcesInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutResourcesInputSchema)
}).strict();

export const ResourceUncheckedCreateWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateWithoutWorkerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int(),
  processStepId: z.number().int(),
  Machine: z.lazy(() => MachineUncheckedCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceCreateOrConnectWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceCreateOrConnectWithoutWorkerInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResourceCreateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutWorkerInputSchema) ]),
}).strict();

export const WorkerRoleCreateWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleCreateWithoutWorkersInput> = z.object({
  name: z.string(),
  description: z.string().optional().nullable()
}).strict();

export const WorkerRoleUncheckedCreateWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedCreateWithoutWorkersInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string().optional().nullable()
}).strict();

export const WorkerRoleCreateOrConnectWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleCreateOrConnectWithoutWorkersInput> = z.object({
  where: z.lazy(() => WorkerRoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema) ]),
}).strict();

export const ResourceUpsertWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceUpsertWithoutWorkerInput> = z.object({
  update: z.union([ z.lazy(() => ResourceUpdateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutWorkerInputSchema) ]),
  create: z.union([ z.lazy(() => ResourceCreateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutWorkerInputSchema) ]),
  where: z.lazy(() => ResourceWhereInputSchema).optional()
}).strict();

export const ResourceUpdateToOneWithWhereWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceUpdateToOneWithWhereWithoutWorkerInput> = z.object({
  where: z.lazy(() => ResourceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResourceUpdateWithoutWorkerInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutWorkerInputSchema) ]),
}).strict();

export const ResourceUpdateWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceUpdateWithoutWorkerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUpdateOneWithoutResourceNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutResourcesNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateWithoutWorkerInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateWithoutWorkerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUncheckedUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const WorkerRoleUpsertWithWhereUniqueWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUpsertWithWhereUniqueWithoutWorkersInput> = z.object({
  where: z.lazy(() => WorkerRoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkerRoleUpdateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedUpdateWithoutWorkersInputSchema) ]),
  create: z.union([ z.lazy(() => WorkerRoleCreateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedCreateWithoutWorkersInputSchema) ]),
}).strict();

export const WorkerRoleUpdateWithWhereUniqueWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUpdateWithWhereUniqueWithoutWorkersInput> = z.object({
  where: z.lazy(() => WorkerRoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkerRoleUpdateWithoutWorkersInputSchema),z.lazy(() => WorkerRoleUncheckedUpdateWithoutWorkersInputSchema) ]),
}).strict();

export const WorkerRoleUpdateManyWithWhereWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUpdateManyWithWhereWithoutWorkersInput> = z.object({
  where: z.lazy(() => WorkerRoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkerRoleUpdateManyMutationInputSchema),z.lazy(() => WorkerRoleUncheckedUpdateManyWithoutWorkersInputSchema) ]),
}).strict();

export const WorkerRoleScalarWhereInputSchema: z.ZodType<Prisma.WorkerRoleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerRoleScalarWhereInputSchema),z.lazy(() => WorkerRoleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerRoleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerRoleScalarWhereInputSchema),z.lazy(() => WorkerRoleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const WorkerCreateWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerCreateWithoutWorkerRolesInput> = z.object({
  resource: z.lazy(() => ResourceCreateNestedOneWithoutWorkerInputSchema)
}).strict();

export const WorkerUncheckedCreateWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUncheckedCreateWithoutWorkerRolesInput> = z.object({
  id: z.number().int().optional(),
  resourceId: z.number().int()
}).strict();

export const WorkerCreateOrConnectWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerCreateOrConnectWithoutWorkerRolesInput> = z.object({
  where: z.lazy(() => WorkerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema) ]),
}).strict();

export const WorkerUpsertWithWhereUniqueWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUpsertWithWhereUniqueWithoutWorkerRolesInput> = z.object({
  where: z.lazy(() => WorkerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkerUpdateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutWorkerRolesInputSchema) ]),
  create: z.union([ z.lazy(() => WorkerCreateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedCreateWithoutWorkerRolesInputSchema) ]),
}).strict();

export const WorkerUpdateWithWhereUniqueWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUpdateWithWhereUniqueWithoutWorkerRolesInput> = z.object({
  where: z.lazy(() => WorkerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkerUpdateWithoutWorkerRolesInputSchema),z.lazy(() => WorkerUncheckedUpdateWithoutWorkerRolesInputSchema) ]),
}).strict();

export const WorkerUpdateManyWithWhereWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUpdateManyWithWhereWithoutWorkerRolesInput> = z.object({
  where: z.lazy(() => WorkerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkerUpdateManyMutationInputSchema),z.lazy(() => WorkerUncheckedUpdateManyWithoutWorkerRolesInputSchema) ]),
}).strict();

export const WorkerScalarWhereInputSchema: z.ZodType<Prisma.WorkerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => WorkerScalarWhereInputSchema),z.lazy(() => WorkerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkerScalarWhereInputSchema),z.lazy(() => WorkerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  resourceId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const InventoryEntryCreateWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryCreateWithoutInventoryInput> = z.object({
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutInventoryEntriesInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedCreateWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedCreateWithoutInventoryInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const InventoryEntryCreateOrConnectWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryCreateOrConnectWithoutInventoryInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema) ]),
}).strict();

export const InventoryEntryCreateManyInventoryInputEnvelopeSchema: z.ZodType<Prisma.InventoryEntryCreateManyInventoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InventoryEntryCreateManyInventoryInputSchema),z.lazy(() => InventoryEntryCreateManyInventoryInputSchema).array() ]),
}).strict();

export const ProcessStepCreateWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutInventoryInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutInventoryInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutInventoryInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]),
}).strict();

export const TransportSystemCreateWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutInventoryInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutInventoryInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutInventoryInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]),
}).strict();

export const InventoryEntryUpsertWithWhereUniqueWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUpsertWithWhereUniqueWithoutInventoryInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateWithoutInventoryInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutInventoryInputSchema) ]),
}).strict();

export const InventoryEntryUpdateWithWhereUniqueWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUpdateWithWhereUniqueWithoutInventoryInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InventoryEntryUpdateWithoutInventoryInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateWithoutInventoryInputSchema) ]),
}).strict();

export const InventoryEntryUpdateManyWithWhereWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUpdateManyWithWhereWithoutInventoryInput> = z.object({
  where: z.lazy(() => InventoryEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InventoryEntryUpdateManyMutationInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutInventoryInputSchema) ]),
}).strict();

export const InventoryEntryScalarWhereInputSchema: z.ZodType<Prisma.InventoryEntryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InventoryEntryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InventoryEntryScalarWhereInputSchema),z.lazy(() => InventoryEntryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ProcessStepUpsertWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithoutInventoryInput> = z.object({
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInventoryInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInventoryInputSchema) ]),
  where: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ProcessStepUpdateToOneWithWhereWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUpdateToOneWithWhereWithoutInventoryInput> = z.object({
  where: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutInventoryInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInventoryInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutInventoryInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutInventoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const TransportSystemUpsertWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithoutInventoryInput> = z.object({
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutInventoryInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutInventoryInputSchema) ]),
  where: z.lazy(() => TransportSystemWhereInputSchema).optional()
}).strict();

export const TransportSystemUpdateToOneWithWhereWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUpdateToOneWithWhereWithoutInventoryInput> = z.object({
  where: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutInventoryInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutInventoryInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutInventoryInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutInventoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const InventoryCreateWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryCreateWithoutEntriesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryUncheckedCreateWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryUncheckedCreateWithoutEntriesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  processStep: z.lazy(() => ProcessStepUncheckedCreateNestedOneWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryCreateOrConnectWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryCreateOrConnectWithoutEntriesInput> = z.object({
  where: z.lazy(() => InventoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryCreateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutEntriesInputSchema) ]),
}).strict();

export const OrderCreateWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderCreateWithoutInventoryEntriesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutOrdersInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutInventoryEntriesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutOrdersInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutInventoryEntriesInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedCreateWithoutInventoryEntriesInputSchema) ]),
}).strict();

export const InventoryUpsertWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryUpsertWithoutEntriesInput> = z.object({
  update: z.union([ z.lazy(() => InventoryUpdateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryCreateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutEntriesInputSchema) ]),
  where: z.lazy(() => InventoryWhereInputSchema).optional()
}).strict();

export const InventoryUpdateToOneWithWhereWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryUpdateToOneWithWhereWithoutEntriesInput> = z.object({
  where: z.lazy(() => InventoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InventoryUpdateWithoutEntriesInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutEntriesInputSchema) ]),
}).strict();

export const InventoryUpdateWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryUpdateWithoutEntriesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const InventoryUncheckedUpdateWithoutEntriesInputSchema: z.ZodType<Prisma.InventoryUncheckedUpdateWithoutEntriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const OrderUpsertWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderUpsertWithoutInventoryEntriesInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutInventoryEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedCreateWithoutInventoryEntriesInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutInventoryEntriesInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutInventoryEntriesInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutInventoryEntriesInputSchema) ]),
}).strict();

export const OrderUpdateWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderUpdateWithoutInventoryEntriesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutOrdersNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutInventoryEntriesInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutInventoryEntriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const ProcessStepCreateWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutLocationInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutLocationInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutLocationInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const ProcessStepCreateManyLocationInputEnvelopeSchema: z.ZodType<Prisma.ProcessStepCreateManyLocationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProcessStepCreateManyLocationInputSchema),z.lazy(() => ProcessStepCreateManyLocationInputSchema).array() ]),
}).strict();

export const ResourceCreateWithoutLocationInputSchema: z.ZodType<Prisma.ResourceCreateWithoutLocationInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  Machine: z.lazy(() => MachineCreateNestedOneWithoutResourceInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutResourcesInputSchema),
  Worker: z.lazy(() => WorkerCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateWithoutLocationInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  processStepId: z.number().int(),
  Machine: z.lazy(() => MachineUncheckedCreateNestedOneWithoutResourceInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceCreateOrConnectWithoutLocationInputSchema: z.ZodType<Prisma.ResourceCreateOrConnectWithoutLocationInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const ResourceCreateManyLocationInputEnvelopeSchema: z.ZodType<Prisma.ResourceCreateManyLocationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResourceCreateManyLocationInputSchema),z.lazy(() => ResourceCreateManyLocationInputSchema).array() ]),
}).strict();

export const ProcessStepUpsertWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutLocationInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutLocationInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutLocationInputSchema) ]),
}).strict();

export const ProcessStepUpdateManyWithWhereWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithWhereWithoutLocationInput> = z.object({
  where: z.lazy(() => ProcessStepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateManyMutationInputSchema),z.lazy(() => ProcessStepUncheckedUpdateManyWithoutLocationInputSchema) ]),
}).strict();

export const ProcessStepScalarWhereInputSchema: z.ZodType<Prisma.ProcessStepScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProcessStepScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProcessStepScalarWhereInputSchema),z.lazy(() => ProcessStepScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeRate: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  duration: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  errorRate: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ResourceUpsertWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUpsertWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResourceUpdateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutLocationInputSchema) ]),
  create: z.union([ z.lazy(() => ResourceCreateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const ResourceUpdateWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUpdateWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResourceUpdateWithoutLocationInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutLocationInputSchema) ]),
}).strict();

export const ResourceUpdateManyWithWhereWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUpdateManyWithWhereWithoutLocationInput> = z.object({
  where: z.lazy(() => ResourceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResourceUpdateManyMutationInputSchema),z.lazy(() => ResourceUncheckedUpdateManyWithoutLocationInputSchema) ]),
}).strict();

export const ResourceScalarWhereInputSchema: z.ZodType<Prisma.ResourceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResourceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResourceScalarWhereInputSchema),z.lazy(() => ResourceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  locationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const OrderCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderCreateWithoutProcessStepsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryCreateNestedManyWithoutOrderInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutProcessStepsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema) ]),
}).strict();

export const RecipeCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeCreateWithoutProcessStepsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  inputs: z.lazy(() => RecipeInputCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeUncheckedCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeUncheckedCreateWithoutProcessStepsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  inputs: z.lazy(() => RecipeInputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeCreateOrConnectWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeCreateOrConnectWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => RecipeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RecipeCreateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutProcessStepsInputSchema) ]),
}).strict();

export const InventoryCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryCreateWithoutProcessStepInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryCreateNestedManyWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryUncheckedCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryUncheckedCreateWithoutProcessStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutInventoryInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryCreateOrConnectWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryCreateOrConnectWithoutProcessStepInput> = z.object({
  where: z.lazy(() => InventoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryCreateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutProcessStepInputSchema) ]),
}).strict();

export const LocationCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationCreateWithoutProcessStepsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUncheckedCreateWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutProcessStepsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationCreateOrConnectWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationCreateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedCreateWithoutProcessStepsInputSchema) ]),
}).strict();

export const ResourceCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceCreateWithoutProcessStepInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  Machine: z.lazy(() => MachineCreateNestedOneWithoutResourceInputSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutResourcesInputSchema),
  Worker: z.lazy(() => WorkerCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceUncheckedCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUncheckedCreateWithoutProcessStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int(),
  Machine: z.lazy(() => MachineUncheckedCreateNestedOneWithoutResourceInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedCreateNestedOneWithoutResourceInputSchema).optional()
}).strict();

export const ResourceCreateOrConnectWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceCreateOrConnectWithoutProcessStepInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema) ]),
}).strict();

export const ResourceCreateManyProcessStepInputEnvelopeSchema: z.ZodType<Prisma.ResourceCreateManyProcessStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResourceCreateManyProcessStepInputSchema),z.lazy(() => ResourceCreateManyProcessStepInputSchema).array() ]),
}).strict();

export const SensorCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorCreateWithoutProcessStepInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutSensorsInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorUncheckedCreateWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUncheckedCreateWithoutProcessStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  transportSystemId: z.number().int().optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorCreateOrConnectWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorCreateOrConnectWithoutProcessStepInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema) ]),
}).strict();

export const SensorCreateManyProcessStepInputEnvelopeSchema: z.ZodType<Prisma.SensorCreateManyProcessStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SensorCreateManyProcessStepInputSchema),z.lazy(() => SensorCreateManyProcessStepInputSchema).array() ]),
}).strict();

export const TransportSystemCreateWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutEndStepInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutEndStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutEndStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema) ]),
}).strict();

export const TransportSystemCreateManyEndStepInputEnvelopeSchema: z.ZodType<Prisma.TransportSystemCreateManyEndStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransportSystemCreateManyEndStepInputSchema),z.lazy(() => TransportSystemCreateManyEndStepInputSchema).array() ]),
}).strict();

export const TransportSystemCreateWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutStartStepInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutStartStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutStartStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema) ]),
}).strict();

export const TransportSystemCreateManyStartStepInputEnvelopeSchema: z.ZodType<Prisma.TransportSystemCreateManyStartStepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransportSystemCreateManyStartStepInputSchema),z.lazy(() => TransportSystemCreateManyStartStepInputSchema).array() ]),
}).strict();

export const OrderUpsertWithWhereUniqueWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutProcessStepsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProcessStepsInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutProcessStepsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutProcessStepsInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsInputSchema) ]),
}).strict();

export const OrderScalarWhereInputSchema: z.ZodType<Prisma.OrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereInputSchema),z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priority: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dueDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  startedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  completedTick: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  canceledAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const RecipeUpsertWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeUpsertWithoutProcessStepsInput> = z.object({
  update: z.union([ z.lazy(() => RecipeUpdateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutProcessStepsInputSchema) ]),
  create: z.union([ z.lazy(() => RecipeCreateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutProcessStepsInputSchema) ]),
  where: z.lazy(() => RecipeWhereInputSchema).optional()
}).strict();

export const RecipeUpdateToOneWithWhereWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeUpdateToOneWithWhereWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => RecipeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RecipeUpdateWithoutProcessStepsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutProcessStepsInputSchema) ]),
}).strict();

export const RecipeUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeUpdateWithoutProcessStepsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputs: z.lazy(() => RecipeInputUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeUncheckedUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.RecipeUncheckedUpdateWithoutProcessStepsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputs: z.lazy(() => RecipeInputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const InventoryUpsertWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryUpsertWithoutProcessStepInput> = z.object({
  update: z.union([ z.lazy(() => InventoryUpdateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutProcessStepInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryCreateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutProcessStepInputSchema) ]),
  where: z.lazy(() => InventoryWhereInputSchema).optional()
}).strict();

export const InventoryUpdateToOneWithWhereWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryUpdateToOneWithWhereWithoutProcessStepInput> = z.object({
  where: z.lazy(() => InventoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InventoryUpdateWithoutProcessStepInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutProcessStepInputSchema) ]),
}).strict();

export const InventoryUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryUpdateWithoutProcessStepInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUpdateManyWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const InventoryUncheckedUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.InventoryUncheckedUpdateWithoutProcessStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutInventoryNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const LocationUpsertWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationUpsertWithoutProcessStepsInput> = z.object({
  update: z.union([ z.lazy(() => LocationUpdateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutProcessStepsInputSchema) ]),
  create: z.union([ z.lazy(() => LocationCreateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedCreateWithoutProcessStepsInputSchema) ]),
  where: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutProcessStepsInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutProcessStepsInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutProcessStepsInputSchema) ]),
}).strict();

export const LocationUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationUpdateWithoutProcessStepsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resources: z.lazy(() => ResourceUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutProcessStepsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const ResourceUpsertWithWhereUniqueWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUpsertWithWhereUniqueWithoutProcessStepInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResourceUpdateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutProcessStepInputSchema) ]),
  create: z.union([ z.lazy(() => ResourceCreateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedCreateWithoutProcessStepInputSchema) ]),
}).strict();

export const ResourceUpdateWithWhereUniqueWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUpdateWithWhereUniqueWithoutProcessStepInput> = z.object({
  where: z.lazy(() => ResourceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResourceUpdateWithoutProcessStepInputSchema),z.lazy(() => ResourceUncheckedUpdateWithoutProcessStepInputSchema) ]),
}).strict();

export const ResourceUpdateManyWithWhereWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUpdateManyWithWhereWithoutProcessStepInput> = z.object({
  where: z.lazy(() => ResourceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResourceUpdateManyMutationInputSchema),z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepInputSchema) ]),
}).strict();

export const SensorUpsertWithWhereUniqueWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUpsertWithWhereUniqueWithoutProcessStepInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SensorUpdateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutProcessStepInputSchema) ]),
  create: z.union([ z.lazy(() => SensorCreateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedCreateWithoutProcessStepInputSchema) ]),
}).strict();

export const SensorUpdateWithWhereUniqueWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUpdateWithWhereUniqueWithoutProcessStepInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SensorUpdateWithoutProcessStepInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutProcessStepInputSchema) ]),
}).strict();

export const SensorUpdateManyWithWhereWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUpdateManyWithWhereWithoutProcessStepInput> = z.object({
  where: z.lazy(() => SensorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SensorUpdateManyMutationInputSchema),z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepInputSchema) ]),
}).strict();

export const SensorScalarWhereInputSchema: z.ZodType<Prisma.SensorScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SensorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SensorScalarWhereInputSchema),z.lazy(() => SensorScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  sensorDelay: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const TransportSystemUpsertWithWhereUniqueWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithWhereUniqueWithoutEndStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutEndStepInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutEndStepInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithWhereUniqueWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithWhereUniqueWithoutEndStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutEndStepInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutEndStepInputSchema) ]),
}).strict();

export const TransportSystemUpdateManyWithWhereWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithWhereWithoutEndStepInput> = z.object({
  where: z.lazy(() => TransportSystemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateManyMutationInputSchema),z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepInputSchema) ]),
}).strict();

export const TransportSystemScalarWhereInputSchema: z.ZodType<Prisma.TransportSystemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransportSystemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransportSystemScalarWhereInputSchema),z.lazy(() => TransportSystemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  outputSpeed: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  inventoryId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  minQuantity: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportDelay: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  startStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  endStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const TransportSystemUpsertWithWhereUniqueWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithWhereUniqueWithoutStartStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutStartStepInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutStartStepInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithWhereUniqueWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithWhereUniqueWithoutStartStepInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutStartStepInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutStartStepInputSchema) ]),
}).strict();

export const TransportSystemUpdateManyWithWhereWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithWhereWithoutStartStepInput> = z.object({
  where: z.lazy(() => TransportSystemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateManyMutationInputSchema),z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepInputSchema) ]),
}).strict();

export const ProcessStepCreateWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutRecipeInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutRecipeInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutRecipeInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const ProcessStepCreateManyRecipeInputEnvelopeSchema: z.ZodType<Prisma.ProcessStepCreateManyRecipeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProcessStepCreateManyRecipeInputSchema),z.lazy(() => ProcessStepCreateManyRecipeInputSchema).array() ]),
}).strict();

export const RecipeInputCreateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputCreateWithoutRecipeInput> = z.object({
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const RecipeInputUncheckedCreateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUncheckedCreateWithoutRecipeInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const RecipeInputCreateOrConnectWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputCreateOrConnectWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeInputWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeInputCreateManyRecipeInputEnvelopeSchema: z.ZodType<Prisma.RecipeInputCreateManyRecipeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RecipeInputCreateManyRecipeInputSchema),z.lazy(() => RecipeInputCreateManyRecipeInputSchema).array() ]),
}).strict();

export const RecipeOutputCreateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputCreateWithoutRecipeInput> = z.object({
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const RecipeOutputUncheckedCreateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedCreateWithoutRecipeInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const RecipeOutputCreateOrConnectWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputCreateOrConnectWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeOutputWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeOutputCreateManyRecipeInputEnvelopeSchema: z.ZodType<Prisma.RecipeOutputCreateManyRecipeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RecipeOutputCreateManyRecipeInputSchema),z.lazy(() => RecipeOutputCreateManyRecipeInputSchema).array() ]),
}).strict();

export const ProcessStepUpsertWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutRecipeInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutRecipeInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutRecipeInputSchema) ]),
}).strict();

export const ProcessStepUpdateManyWithWhereWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithWhereWithoutRecipeInput> = z.object({
  where: z.lazy(() => ProcessStepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateManyMutationInputSchema),z.lazy(() => ProcessStepUncheckedUpdateManyWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeInputUpsertWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUpsertWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeInputWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RecipeInputUpdateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedUpdateWithoutRecipeInputSchema) ]),
  create: z.union([ z.lazy(() => RecipeInputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeInputUpdateWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUpdateWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeInputWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RecipeInputUpdateWithoutRecipeInputSchema),z.lazy(() => RecipeInputUncheckedUpdateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeInputUpdateManyWithWhereWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUpdateManyWithWhereWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeInputScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RecipeInputUpdateManyMutationInputSchema),z.lazy(() => RecipeInputUncheckedUpdateManyWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeInputScalarWhereInputSchema: z.ZodType<Prisma.RecipeInputScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeInputScalarWhereInputSchema),z.lazy(() => RecipeInputScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeInputScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeInputScalarWhereInputSchema),z.lazy(() => RecipeInputScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const RecipeOutputUpsertWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUpsertWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeOutputWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RecipeOutputUpdateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedUpdateWithoutRecipeInputSchema) ]),
  create: z.union([ z.lazy(() => RecipeOutputCreateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedCreateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeOutputUpdateWithWhereUniqueWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUpdateWithWhereUniqueWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeOutputWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RecipeOutputUpdateWithoutRecipeInputSchema),z.lazy(() => RecipeOutputUncheckedUpdateWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeOutputUpdateManyWithWhereWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUpdateManyWithWhereWithoutRecipeInput> = z.object({
  where: z.lazy(() => RecipeOutputScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RecipeOutputUpdateManyMutationInputSchema),z.lazy(() => RecipeOutputUncheckedUpdateManyWithoutRecipeInputSchema) ]),
}).strict();

export const RecipeOutputScalarWhereInputSchema: z.ZodType<Prisma.RecipeOutputScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RecipeOutputScalarWhereInputSchema),z.lazy(() => RecipeOutputScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RecipeOutputScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RecipeOutputScalarWhereInputSchema),z.lazy(() => RecipeOutputScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  recipeId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const RecipeCreateWithoutInputsInputSchema: z.ZodType<Prisma.RecipeCreateWithoutInputsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeUncheckedCreateWithoutInputsInputSchema: z.ZodType<Prisma.RecipeUncheckedCreateWithoutInputsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutRecipeInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeCreateOrConnectWithoutInputsInputSchema: z.ZodType<Prisma.RecipeCreateOrConnectWithoutInputsInput> = z.object({
  where: z.lazy(() => RecipeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RecipeCreateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutInputsInputSchema) ]),
}).strict();

export const RecipeUpsertWithoutInputsInputSchema: z.ZodType<Prisma.RecipeUpsertWithoutInputsInput> = z.object({
  update: z.union([ z.lazy(() => RecipeUpdateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutInputsInputSchema) ]),
  create: z.union([ z.lazy(() => RecipeCreateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutInputsInputSchema) ]),
  where: z.lazy(() => RecipeWhereInputSchema).optional()
}).strict();

export const RecipeUpdateToOneWithWhereWithoutInputsInputSchema: z.ZodType<Prisma.RecipeUpdateToOneWithWhereWithoutInputsInput> = z.object({
  where: z.lazy(() => RecipeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RecipeUpdateWithoutInputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutInputsInputSchema) ]),
}).strict();

export const RecipeUpdateWithoutInputsInputSchema: z.ZodType<Prisma.RecipeUpdateWithoutInputsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeUncheckedUpdateWithoutInputsInputSchema: z.ZodType<Prisma.RecipeUncheckedUpdateWithoutInputsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional(),
  outputs: z.lazy(() => RecipeOutputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeCreateWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeCreateWithoutOutputsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutRecipeInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeUncheckedCreateWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeUncheckedCreateWithoutOutputsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutRecipeInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUncheckedCreateNestedManyWithoutRecipeInputSchema).optional()
}).strict();

export const RecipeCreateOrConnectWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeCreateOrConnectWithoutOutputsInput> = z.object({
  where: z.lazy(() => RecipeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RecipeCreateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutOutputsInputSchema) ]),
}).strict();

export const RecipeUpsertWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeUpsertWithoutOutputsInput> = z.object({
  update: z.union([ z.lazy(() => RecipeUpdateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutOutputsInputSchema) ]),
  create: z.union([ z.lazy(() => RecipeCreateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedCreateWithoutOutputsInputSchema) ]),
  where: z.lazy(() => RecipeWhereInputSchema).optional()
}).strict();

export const RecipeUpdateToOneWithWhereWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeUpdateToOneWithWhereWithoutOutputsInput> = z.object({
  where: z.lazy(() => RecipeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RecipeUpdateWithoutOutputsInputSchema),z.lazy(() => RecipeUncheckedUpdateWithoutOutputsInputSchema) ]),
}).strict();

export const RecipeUpdateWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeUpdateWithoutOutputsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutRecipeNestedInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const RecipeUncheckedUpdateWithoutOutputsInputSchema: z.ZodType<Prisma.RecipeUncheckedUpdateWithoutOutputsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional(),
  inputs: z.lazy(() => RecipeInputUncheckedUpdateManyWithoutRecipeNestedInputSchema).optional()
}).strict();

export const SensorCreateWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorCreateWithoutLogEntriesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutSensorsInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutSensorsInputSchema).optional()
}).strict();

export const SensorUncheckedCreateWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorUncheckedCreateWithoutLogEntriesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const SensorCreateOrConnectWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorCreateOrConnectWithoutLogEntriesInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SensorCreateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedCreateWithoutLogEntriesInputSchema) ]),
}).strict();

export const SensorUpsertWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorUpsertWithoutLogEntriesInput> = z.object({
  update: z.union([ z.lazy(() => SensorUpdateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutLogEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => SensorCreateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedCreateWithoutLogEntriesInputSchema) ]),
  where: z.lazy(() => SensorWhereInputSchema).optional()
}).strict();

export const SensorUpdateToOneWithWhereWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorUpdateToOneWithWhereWithoutLogEntriesInput> = z.object({
  where: z.lazy(() => SensorWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SensorUpdateWithoutLogEntriesInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutLogEntriesInputSchema) ]),
}).strict();

export const SensorUpdateWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorUpdateWithoutLogEntriesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutSensorsNestedInputSchema).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutSensorsNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateWithoutLogEntriesInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateWithoutLogEntriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProcessStepCreateWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutSensorsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutSensorsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutSensorsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutSensorsInputSchema) ]),
}).strict();

export const TransportSystemCreateWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutSensorsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutSensorsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutSensorsInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutSensorsInputSchema) ]),
}).strict();

export const LogEntryCreateWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryCreateWithoutSensorInput> = z.object({
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const LogEntryUncheckedCreateWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUncheckedCreateWithoutSensorInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const LogEntryCreateOrConnectWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryCreateOrConnectWithoutSensorInput> = z.object({
  where: z.lazy(() => LogEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema) ]),
}).strict();

export const LogEntryCreateManySensorInputEnvelopeSchema: z.ZodType<Prisma.LogEntryCreateManySensorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => LogEntryCreateManySensorInputSchema),z.lazy(() => LogEntryCreateManySensorInputSchema).array() ]),
}).strict();

export const ProcessStepUpsertWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithoutSensorsInput> = z.object({
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutSensorsInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutSensorsInputSchema) ]),
  where: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ProcessStepUpdateToOneWithWhereWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepUpdateToOneWithWhereWithoutSensorsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutSensorsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutSensorsInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutSensorsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutSensorsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutSensorsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const TransportSystemUpsertWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithoutSensorsInput> = z.object({
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutSensorsInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutSensorsInputSchema) ]),
  where: z.lazy(() => TransportSystemWhereInputSchema).optional()
}).strict();

export const TransportSystemUpdateToOneWithWhereWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemUpdateToOneWithWhereWithoutSensorsInput> = z.object({
  where: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutSensorsInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutSensorsInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutSensorsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutSensorsInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutSensorsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional()
}).strict();

export const LogEntryUpsertWithWhereUniqueWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUpsertWithWhereUniqueWithoutSensorInput> = z.object({
  where: z.lazy(() => LogEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LogEntryUpdateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedUpdateWithoutSensorInputSchema) ]),
  create: z.union([ z.lazy(() => LogEntryCreateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedCreateWithoutSensorInputSchema) ]),
}).strict();

export const LogEntryUpdateWithWhereUniqueWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUpdateWithWhereUniqueWithoutSensorInput> = z.object({
  where: z.lazy(() => LogEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LogEntryUpdateWithoutSensorInputSchema),z.lazy(() => LogEntryUncheckedUpdateWithoutSensorInputSchema) ]),
}).strict();

export const LogEntryUpdateManyWithWhereWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUpdateManyWithWhereWithoutSensorInput> = z.object({
  where: z.lazy(() => LogEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LogEntryUpdateManyMutationInputSchema),z.lazy(() => LogEntryUncheckedUpdateManyWithoutSensorInputSchema) ]),
}).strict();

export const LogEntryScalarWhereInputSchema: z.ZodType<Prisma.LogEntryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LogEntryScalarWhereInputSchema),z.lazy(() => LogEntryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogEntryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogEntryScalarWhereInputSchema),z.lazy(() => LogEntryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inputType: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sensorId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  materialId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  materialName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  processStepId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  transportSystemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const FilterCreateWithoutEntriesInputSchema: z.ZodType<Prisma.FilterCreateWithoutEntriesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orderId: z.number().int().optional().nullable(),
  transportSystem: z.lazy(() => TransportSystemCreateNestedOneWithoutFilterInputSchema)
}).strict();

export const FilterUncheckedCreateWithoutEntriesInputSchema: z.ZodType<Prisma.FilterUncheckedCreateWithoutEntriesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transportSystemId: z.number().int(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const FilterCreateOrConnectWithoutEntriesInputSchema: z.ZodType<Prisma.FilterCreateOrConnectWithoutEntriesInput> = z.object({
  where: z.lazy(() => FilterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FilterCreateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedCreateWithoutEntriesInputSchema) ]),
}).strict();

export const FilterUpsertWithoutEntriesInputSchema: z.ZodType<Prisma.FilterUpsertWithoutEntriesInput> = z.object({
  update: z.union([ z.lazy(() => FilterUpdateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutEntriesInputSchema) ]),
  create: z.union([ z.lazy(() => FilterCreateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedCreateWithoutEntriesInputSchema) ]),
  where: z.lazy(() => FilterWhereInputSchema).optional()
}).strict();

export const FilterUpdateToOneWithWhereWithoutEntriesInputSchema: z.ZodType<Prisma.FilterUpdateToOneWithWhereWithoutEntriesInput> = z.object({
  where: z.lazy(() => FilterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FilterUpdateWithoutEntriesInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutEntriesInputSchema) ]),
}).strict();

export const FilterUpdateWithoutEntriesInputSchema: z.ZodType<Prisma.FilterUpdateWithoutEntriesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneRequiredWithoutFilterNestedInputSchema).optional()
}).strict();

export const FilterUncheckedUpdateWithoutEntriesInputSchema: z.ZodType<Prisma.FilterUncheckedUpdateWithoutEntriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransportSystemCreateWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutFilterInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  orders: z.lazy(() => OrderCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutFilterInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutTransportSystemsInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutFilterInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutFilterInputSchema) ]),
}).strict();

export const FilterEntryCreateWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryCreateWithoutFilterInput> = z.object({
  addedAt: z.coerce.date().optional(),
  material: z.string()
}).strict();

export const FilterEntryUncheckedCreateWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUncheckedCreateWithoutFilterInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string()
}).strict();

export const FilterEntryCreateOrConnectWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryCreateOrConnectWithoutFilterInput> = z.object({
  where: z.lazy(() => FilterEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema) ]),
}).strict();

export const FilterEntryCreateManyFilterInputEnvelopeSchema: z.ZodType<Prisma.FilterEntryCreateManyFilterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FilterEntryCreateManyFilterInputSchema),z.lazy(() => FilterEntryCreateManyFilterInputSchema).array() ]),
}).strict();

export const TransportSystemUpsertWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithoutFilterInput> = z.object({
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutFilterInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutFilterInputSchema) ]),
  where: z.lazy(() => TransportSystemWhereInputSchema).optional()
}).strict();

export const TransportSystemUpdateToOneWithWhereWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemUpdateToOneWithWhereWithoutFilterInput> = z.object({
  where: z.lazy(() => TransportSystemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutFilterInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutFilterInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutFilterInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutFilterInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutFilterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const FilterEntryUpsertWithWhereUniqueWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUpsertWithWhereUniqueWithoutFilterInput> = z.object({
  where: z.lazy(() => FilterEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FilterEntryUpdateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedUpdateWithoutFilterInputSchema) ]),
  create: z.union([ z.lazy(() => FilterEntryCreateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedCreateWithoutFilterInputSchema) ]),
}).strict();

export const FilterEntryUpdateWithWhereUniqueWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUpdateWithWhereUniqueWithoutFilterInput> = z.object({
  where: z.lazy(() => FilterEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FilterEntryUpdateWithoutFilterInputSchema),z.lazy(() => FilterEntryUncheckedUpdateWithoutFilterInputSchema) ]),
}).strict();

export const FilterEntryUpdateManyWithWhereWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUpdateManyWithWhereWithoutFilterInput> = z.object({
  where: z.lazy(() => FilterEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FilterEntryUpdateManyMutationInputSchema),z.lazy(() => FilterEntryUncheckedUpdateManyWithoutFilterInputSchema) ]),
}).strict();

export const FilterEntryScalarWhereInputSchema: z.ZodType<Prisma.FilterEntryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FilterEntryScalarWhereInputSchema),z.lazy(() => FilterEntryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FilterEntryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FilterEntryScalarWhereInputSchema),z.lazy(() => FilterEntryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  addedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  material: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const FilterCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterCreateWithoutTransportSystemInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orderId: z.number().int().optional().nullable(),
  entries: z.lazy(() => FilterEntryCreateNestedManyWithoutFilterInputSchema).optional()
}).strict();

export const FilterUncheckedCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUncheckedCreateWithoutTransportSystemInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orderId: z.number().int().optional().nullable(),
  entries: z.lazy(() => FilterEntryUncheckedCreateNestedManyWithoutFilterInputSchema).optional()
}).strict();

export const FilterCreateOrConnectWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterCreateOrConnectWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => FilterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]),
}).strict();

export const ProcessStepCreateWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutInputsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutInputsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutInputsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInputsInputSchema) ]),
}).strict();

export const ProcessStepCreateWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutOutputsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutOutputsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutProcessStepsInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutOutputsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOutputsInputSchema) ]),
}).strict();

export const InventoryCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryCreateWithoutTransportSystemInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryCreateNestedManyWithoutInventoryInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryUncheckedCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryUncheckedCreateWithoutTransportSystemInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string(),
  limit: z.number().int(),
  entries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutInventoryInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUncheckedCreateNestedOneWithoutInventoryInputSchema).optional()
}).strict();

export const InventoryCreateOrConnectWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryCreateOrConnectWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => InventoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryCreateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutTransportSystemInputSchema) ]),
}).strict();

export const OrderCreateWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderCreateWithoutTransportSystemsInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryCreateNestedManyWithoutOrderInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutTransportSystemsInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  startedAt: z.coerce.date().optional().nullable(),
  startedTick: z.number().int().optional().nullable(),
  completedTick: z.number().int().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedCreateNestedManyWithoutOrdersInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutTransportSystemsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema) ]),
}).strict();

export const SensorCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorCreateWithoutTransportSystemInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStep: z.lazy(() => ProcessStepCreateNestedOneWithoutSensorsInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorUncheckedCreateWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUncheckedCreateWithoutTransportSystemInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStepId: z.number().int().optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedCreateNestedManyWithoutSensorInputSchema).optional()
}).strict();

export const SensorCreateOrConnectWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorCreateOrConnectWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema) ]),
}).strict();

export const SensorCreateManyTransportSystemInputEnvelopeSchema: z.ZodType<Prisma.SensorCreateManyTransportSystemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SensorCreateManyTransportSystemInputSchema),z.lazy(() => SensorCreateManyTransportSystemInputSchema).array() ]),
}).strict();

export const FilterUpsertWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUpsertWithoutTransportSystemInput> = z.object({
  update: z.union([ z.lazy(() => FilterUpdateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutTransportSystemInputSchema) ]),
  create: z.union([ z.lazy(() => FilterCreateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedCreateWithoutTransportSystemInputSchema) ]),
  where: z.lazy(() => FilterWhereInputSchema).optional()
}).strict();

export const FilterUpdateToOneWithWhereWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUpdateToOneWithWhereWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => FilterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FilterUpdateWithoutTransportSystemInputSchema),z.lazy(() => FilterUncheckedUpdateWithoutTransportSystemInputSchema) ]),
}).strict();

export const FilterUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUpdateWithoutTransportSystemInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  entries: z.lazy(() => FilterEntryUpdateManyWithoutFilterNestedInputSchema).optional()
}).strict();

export const FilterUncheckedUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.FilterUncheckedUpdateWithoutTransportSystemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  entries: z.lazy(() => FilterEntryUncheckedUpdateManyWithoutFilterNestedInputSchema).optional()
}).strict();

export const ProcessStepUpsertWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithoutInputsInput> = z.object({
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInputsInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutInputsInputSchema) ]),
  where: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ProcessStepUpdateToOneWithWhereWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepUpdateToOneWithWhereWithoutInputsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutInputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutInputsInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutInputsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutInputsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutInputsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUpsertWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithoutOutputsInput> = z.object({
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutOutputsInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOutputsInputSchema) ]),
  where: z.lazy(() => ProcessStepWhereInputSchema).optional()
}).strict();

export const ProcessStepUpdateToOneWithWhereWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepUpdateToOneWithWhereWithoutOutputsInput> = z.object({
  where: z.lazy(() => ProcessStepWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutOutputsInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutOutputsInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutOutputsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutOutputsInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutOutputsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional()
}).strict();

export const InventoryUpsertWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryUpsertWithoutTransportSystemInput> = z.object({
  update: z.union([ z.lazy(() => InventoryUpdateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutTransportSystemInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryCreateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedCreateWithoutTransportSystemInputSchema) ]),
  where: z.lazy(() => InventoryWhereInputSchema).optional()
}).strict();

export const InventoryUpdateToOneWithWhereWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryUpdateToOneWithWhereWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => InventoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InventoryUpdateWithoutTransportSystemInputSchema),z.lazy(() => InventoryUncheckedUpdateWithoutTransportSystemInputSchema) ]),
}).strict();

export const InventoryUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryUpdateWithoutTransportSystemInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUpdateManyWithoutInventoryNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const InventoryUncheckedUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.InventoryUncheckedUpdateWithoutTransportSystemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  entries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutInventoryNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUncheckedUpdateOneWithoutInventoryNestedInputSchema).optional()
}).strict();

export const OrderUpsertWithWhereUniqueWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutTransportSystemsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTransportSystemsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTransportSystemsInputSchema) ]),
}).strict();

export const OrderUpdateWithWhereUniqueWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutTransportSystemsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutTransportSystemsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTransportSystemsInputSchema) ]),
}).strict();

export const OrderUpdateManyWithWhereWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutTransportSystemsInput> = z.object({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema),z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsInputSchema) ]),
}).strict();

export const SensorUpsertWithWhereUniqueWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUpsertWithWhereUniqueWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SensorUpdateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutTransportSystemInputSchema) ]),
  create: z.union([ z.lazy(() => SensorCreateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedCreateWithoutTransportSystemInputSchema) ]),
}).strict();

export const SensorUpdateWithWhereUniqueWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUpdateWithWhereUniqueWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => SensorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SensorUpdateWithoutTransportSystemInputSchema),z.lazy(() => SensorUncheckedUpdateWithoutTransportSystemInputSchema) ]),
}).strict();

export const SensorUpdateManyWithWhereWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUpdateManyWithWhereWithoutTransportSystemInput> = z.object({
  where: z.lazy(() => SensorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SensorUpdateManyMutationInputSchema),z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemInputSchema) ]),
}).strict();

export const InventoryEntryCreateWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryCreateWithoutOrderInput> = z.object({
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutEntriesInputSchema)
}).strict();

export const InventoryEntryUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventoryId: z.number().int()
}).strict();

export const InventoryEntryCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const InventoryEntryCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.InventoryEntryCreateManyOrderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InventoryEntryCreateManyOrderInputSchema),z.lazy(() => InventoryEntryCreateManyOrderInputSchema).array() ]),
}).strict();

export const ProcessStepCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepCreateWithoutOrdersInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  errorRate: z.number().optional().nullable(),
  recipe: z.lazy(() => RecipeCreateNestedOneWithoutProcessStepsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutProcessStepInputSchema),
  location: z.lazy(() => LocationCreateNestedOneWithoutProcessStepsInputSchema),
  resources: z.lazy(() => ResourceCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable(),
  resources: z.lazy(() => ResourceUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutProcessStepInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutEndStepInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedCreateNestedManyWithoutStartStepInputSchema).optional()
}).strict();

export const ProcessStepCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const TransportSystemCreateWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemCreateWithoutOrdersInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepCreateNestedOneWithoutInputsInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepCreateNestedOneWithoutOutputsInputSchema).optional(),
  inventory: z.lazy(() => InventoryCreateNestedOneWithoutTransportSystemInputSchema),
  sensors: z.lazy(() => SensorCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string(),
  filter: z.lazy(() => FilterUncheckedCreateNestedOneWithoutTransportSystemInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedCreateNestedManyWithoutTransportSystemInputSchema).optional()
}).strict();

export const TransportSystemCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const InventoryEntryUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUpsertWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InventoryEntryUpdateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => InventoryEntryCreateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const InventoryEntryUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUpdateWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => InventoryEntryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InventoryEntryUpdateWithoutOrderInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const InventoryEntryUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUpdateManyWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => InventoryEntryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InventoryEntryUpdateManyMutationInputSchema),z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutOrderInputSchema) ]),
}).strict();

export const ProcessStepUpsertWithWhereUniqueWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUpsertWithWhereUniqueWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProcessStepUpdateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => ProcessStepCreateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const ProcessStepUpdateWithWhereUniqueWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithWhereUniqueWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProcessStepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateWithoutOrdersInputSchema),z.lazy(() => ProcessStepUncheckedUpdateWithoutOrdersInputSchema) ]),
}).strict();

export const ProcessStepUpdateManyWithWhereWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUpdateManyWithWhereWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProcessStepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProcessStepUpdateManyMutationInputSchema),z.lazy(() => ProcessStepUncheckedUpdateManyWithoutOrdersInputSchema) ]),
}).strict();

export const TransportSystemUpsertWithWhereUniqueWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUpsertWithWhereUniqueWithoutOrdersInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransportSystemUpdateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => TransportSystemCreateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const TransportSystemUpdateWithWhereUniqueWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithWhereUniqueWithoutOrdersInput> = z.object({
  where: z.lazy(() => TransportSystemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateWithoutOrdersInputSchema),z.lazy(() => TransportSystemUncheckedUpdateWithoutOrdersInputSchema) ]),
}).strict();

export const TransportSystemUpdateManyWithWhereWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUpdateManyWithWhereWithoutOrdersInput> = z.object({
  where: z.lazy(() => TransportSystemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransportSystemUpdateManyMutationInputSchema),z.lazy(() => TransportSystemUncheckedUpdateManyWithoutOrdersInputSchema) ]),
}).strict();

export const WorkerRoleUpdateWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUpdateWithoutWorkersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const WorkerRoleUncheckedUpdateWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedUpdateWithoutWorkersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const WorkerRoleUncheckedUpdateManyWithoutWorkersInputSchema: z.ZodType<Prisma.WorkerRoleUncheckedUpdateManyWithoutWorkersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const WorkerUpdateWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUpdateWithoutWorkerRolesInput> = z.object({
  resource: z.lazy(() => ResourceUpdateOneRequiredWithoutWorkerNestedInputSchema).optional()
}).strict();

export const WorkerUncheckedUpdateWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateWithoutWorkerRolesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const WorkerUncheckedUpdateManyWithoutWorkerRolesInputSchema: z.ZodType<Prisma.WorkerUncheckedUpdateManyWithoutWorkerRolesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  resourceId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryEntryCreateManyInventoryInputSchema: z.ZodType<Prisma.InventoryEntryCreateManyInventoryInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  orderId: z.number().int().optional().nullable()
}).strict();

export const InventoryEntryUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUpdateWithoutInventoryInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Order: z.lazy(() => OrderUpdateOneWithoutInventoryEntriesNestedInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedUpdateWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateWithoutInventoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryEntryUncheckedUpdateManyWithoutInventoryInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateManyWithoutInventoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProcessStepCreateManyLocationInputSchema: z.ZodType<Prisma.ProcessStepCreateManyLocationInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  inventoryId: z.number().int(),
  recipeId: z.number().int().optional().nullable(),
  errorRate: z.number().optional().nullable()
}).strict();

export const ResourceCreateManyLocationInputSchema: z.ZodType<Prisma.ResourceCreateManyLocationInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  processStepId: z.number().int()
}).strict();

export const ProcessStepUpdateWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutLocationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutLocationInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutLocationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ResourceUpdateWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUpdateWithoutLocationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUpdateOneWithoutResourceNestedInputSchema).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateWithoutLocationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUncheckedUpdateOneWithoutResourceNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateManyWithoutLocationInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateManyWithoutLocationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResourceCreateManyProcessStepInputSchema: z.ZodType<Prisma.ResourceCreateManyProcessStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().optional().nullable(),
  active: z.boolean().optional(),
  locationId: z.number().int()
}).strict();

export const SensorCreateManyProcessStepInputSchema: z.ZodType<Prisma.SensorCreateManyProcessStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const TransportSystemCreateManyEndStepInputSchema: z.ZodType<Prisma.TransportSystemCreateManyEndStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  startStepId: z.number().int().optional().nullable(),
  type: z.string()
}).strict();

export const TransportSystemCreateManyStartStepInputSchema: z.ZodType<Prisma.TransportSystemCreateManyStartStepInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  active: z.boolean().optional(),
  name: z.string(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  inventoryId: z.number().int(),
  minQuantity: z.number().int().optional().nullable(),
  transportDelay: z.number().int().optional().nullable(),
  endStepId: z.number().int().optional().nullable(),
  type: z.string()
}).strict();

export const OrderUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutProcessStepsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUpdateManyWithoutOrderNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutProcessStepsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  transportSystems: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutProcessStepsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutProcessStepsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ResourceUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUpdateWithoutProcessStepInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUpdateOneWithoutResourceNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutResourcesNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateWithoutProcessStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Machine: z.lazy(() => MachineUncheckedUpdateOneWithoutResourceNestedInputSchema).optional(),
  Worker: z.lazy(() => WorkerUncheckedUpdateOneWithoutResourceNestedInputSchema).optional()
}).strict();

export const ResourceUncheckedUpdateManyWithoutProcessStepInputSchema: z.ZodType<Prisma.ResourceUncheckedUpdateManyWithoutProcessStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SensorUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUpdateWithoutProcessStepInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystem: z.lazy(() => TransportSystemUpdateOneWithoutSensorsNestedInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateWithoutProcessStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateManyWithoutProcessStepInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateManyWithoutProcessStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransportSystemUpdateWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutEndStepInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutEndStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutEndStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutEndStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransportSystemUpdateWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutStartStepInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutStartStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutTransportSystemsNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutStartStepInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutStartStepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProcessStepCreateManyRecipeInputSchema: z.ZodType<Prisma.ProcessStepCreateManyRecipeInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  status: z.string().optional(),
  active: z.boolean().optional(),
  inputSpeed: z.number().int(),
  outputSpeed: z.number().int(),
  recipeRate: z.number().int().optional(),
  duration: z.number().int().optional(),
  locationId: z.number().int(),
  inventoryId: z.number().int(),
  errorRate: z.number().optional().nullable()
}).strict();

export const RecipeInputCreateManyRecipeInputSchema: z.ZodType<Prisma.RecipeInputCreateManyRecipeInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const RecipeOutputCreateManyRecipeInputSchema: z.ZodType<Prisma.RecipeOutputCreateManyRecipeInput> = z.object({
  id: z.number().int().optional(),
  material: z.string(),
  quantity: z.number().int()
}).strict();

export const ProcessStepUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutRecipeInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutRecipeInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RecipeInputUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUpdateWithoutRecipeInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeInputUncheckedUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUncheckedUpdateWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeInputUncheckedUpdateManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeInputUncheckedUpdateManyWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeOutputUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUpdateWithoutRecipeInput> = z.object({
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeOutputUncheckedUpdateWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedUpdateWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RecipeOutputUncheckedUpdateManyWithoutRecipeInputSchema: z.ZodType<Prisma.RecipeOutputUncheckedUpdateManyWithoutRecipeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LogEntryCreateManySensorInputSchema: z.ZodType<Prisma.LogEntryCreateManySensorInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  inputType: z.string(),
  materialId: z.number().int(),
  materialName: z.string(),
  processStepId: z.number().int().optional().nullable(),
  transportSystemId: z.number().int().optional().nullable()
}).strict();

export const LogEntryUpdateWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUpdateWithoutSensorInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryUncheckedUpdateWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUncheckedUpdateWithoutSensorInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const LogEntryUncheckedUpdateManyWithoutSensorInputSchema: z.ZodType<Prisma.LogEntryUncheckedUpdateManyWithoutSensorInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inputType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  materialId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  materialName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportSystemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FilterEntryCreateManyFilterInputSchema: z.ZodType<Prisma.FilterEntryCreateManyFilterInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string()
}).strict();

export const FilterEntryUpdateWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUpdateWithoutFilterInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FilterEntryUncheckedUpdateWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUncheckedUpdateWithoutFilterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FilterEntryUncheckedUpdateManyWithoutFilterInputSchema: z.ZodType<Prisma.FilterEntryUncheckedUpdateManyWithoutFilterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SensorCreateManyTransportSystemInputSchema: z.ZodType<Prisma.SensorCreateManyTransportSystemInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  value: z.number().int().optional(),
  sensorDelay: z.number().int().optional(),
  processStepId: z.number().int().optional().nullable()
}).strict();

export const OrderUpdateWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutTransportSystemsInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUpdateManyWithoutOrderNestedInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutTransportSystemsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  inventoryEntries: z.lazy(() => InventoryEntryUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  processSteps: z.lazy(() => ProcessStepUncheckedUpdateManyWithoutOrdersNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateManyWithoutTransportSystemsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutTransportSystemsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dueDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedTick: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  canceledAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SensorUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUpdateWithoutTransportSystemInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStep: z.lazy(() => ProcessStepUpdateOneWithoutSensorsNestedInputSchema).optional(),
  logEntries: z.lazy(() => LogEntryUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateWithoutTransportSystemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logEntries: z.lazy(() => LogEntryUncheckedUpdateManyWithoutSensorNestedInputSchema).optional()
}).strict();

export const SensorUncheckedUpdateManyWithoutTransportSystemInputSchema: z.ZodType<Prisma.SensorUncheckedUpdateManyWithoutTransportSystemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  sensorDelay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  processStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const InventoryEntryCreateManyOrderInputSchema: z.ZodType<Prisma.InventoryEntryCreateManyOrderInput> = z.object({
  id: z.number().int().optional(),
  addedAt: z.coerce.date().optional(),
  material: z.string(),
  inventoryId: z.number().int()
}).strict();

export const InventoryEntryUpdateWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUpdateWithoutOrderInput> = z.object({
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutEntriesNestedInputSchema).optional()
}).strict();

export const InventoryEntryUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InventoryEntryUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.InventoryEntryUncheckedUpdateManyWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  addedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  material: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProcessStepUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUpdateWithoutOrdersInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  recipe: z.lazy(() => RecipeUpdateOneWithoutProcessStepsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutProcessStepNestedInputSchema).optional(),
  location: z.lazy(() => LocationUpdateOneRequiredWithoutProcessStepsNestedInputSchema).optional(),
  resources: z.lazy(() => ResourceUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resources: z.lazy(() => ResourceUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutProcessStepNestedInputSchema).optional(),
  inputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutEndStepNestedInputSchema).optional(),
  outputs: z.lazy(() => TransportSystemUncheckedUpdateManyWithoutStartStepNestedInputSchema).optional()
}).strict();

export const ProcessStepUncheckedUpdateManyWithoutOrdersInputSchema: z.ZodType<Prisma.ProcessStepUncheckedUpdateManyWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeRate: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  duration: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  recipeId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  errorRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransportSystemUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUpdateWithoutOrdersInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  endStep: z.lazy(() => ProcessStepUpdateOneWithoutInputsNestedInputSchema).optional(),
  startStep: z.lazy(() => ProcessStepUpdateOneWithoutOutputsNestedInputSchema).optional(),
  inventory: z.lazy(() => InventoryUpdateOneRequiredWithoutTransportSystemNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filter: z.lazy(() => FilterUncheckedUpdateOneWithoutTransportSystemNestedInputSchema).optional(),
  sensors: z.lazy(() => SensorUncheckedUpdateManyWithoutTransportSystemNestedInputSchema).optional()
}).strict();

export const TransportSystemUncheckedUpdateManyWithoutOrdersInputSchema: z.ZodType<Prisma.TransportSystemUncheckedUpdateManyWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  outputSpeed: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  inventoryId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minQuantity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transportDelay: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endStepId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ResourceFindFirstArgsSchema: z.ZodType<Prisma.ResourceFindFirstArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereInputSchema.optional(),
  orderBy: z.union([ ResourceOrderByWithRelationInputSchema.array(),ResourceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResourceScalarFieldEnumSchema,ResourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResourceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResourceFindFirstOrThrowArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereInputSchema.optional(),
  orderBy: z.union([ ResourceOrderByWithRelationInputSchema.array(),ResourceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResourceScalarFieldEnumSchema,ResourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResourceFindManyArgsSchema: z.ZodType<Prisma.ResourceFindManyArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereInputSchema.optional(),
  orderBy: z.union([ ResourceOrderByWithRelationInputSchema.array(),ResourceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResourceScalarFieldEnumSchema,ResourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResourceAggregateArgsSchema: z.ZodType<Prisma.ResourceAggregateArgs> = z.object({
  where: ResourceWhereInputSchema.optional(),
  orderBy: z.union([ ResourceOrderByWithRelationInputSchema.array(),ResourceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResourceGroupByArgsSchema: z.ZodType<Prisma.ResourceGroupByArgs> = z.object({
  where: ResourceWhereInputSchema.optional(),
  orderBy: z.union([ ResourceOrderByWithAggregationInputSchema.array(),ResourceOrderByWithAggregationInputSchema ]).optional(),
  by: ResourceScalarFieldEnumSchema.array(),
  having: ResourceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResourceFindUniqueArgsSchema: z.ZodType<Prisma.ResourceFindUniqueArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereUniqueInputSchema,
}).strict() ;

export const ResourceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResourceFindUniqueOrThrowArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereUniqueInputSchema,
}).strict() ;

export const MachineFindFirstArgsSchema: z.ZodType<Prisma.MachineFindFirstArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereInputSchema.optional(),
  orderBy: z.union([ MachineOrderByWithRelationInputSchema.array(),MachineOrderByWithRelationInputSchema ]).optional(),
  cursor: MachineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MachineScalarFieldEnumSchema,MachineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MachineFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MachineFindFirstOrThrowArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereInputSchema.optional(),
  orderBy: z.union([ MachineOrderByWithRelationInputSchema.array(),MachineOrderByWithRelationInputSchema ]).optional(),
  cursor: MachineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MachineScalarFieldEnumSchema,MachineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MachineFindManyArgsSchema: z.ZodType<Prisma.MachineFindManyArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereInputSchema.optional(),
  orderBy: z.union([ MachineOrderByWithRelationInputSchema.array(),MachineOrderByWithRelationInputSchema ]).optional(),
  cursor: MachineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MachineScalarFieldEnumSchema,MachineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MachineAggregateArgsSchema: z.ZodType<Prisma.MachineAggregateArgs> = z.object({
  where: MachineWhereInputSchema.optional(),
  orderBy: z.union([ MachineOrderByWithRelationInputSchema.array(),MachineOrderByWithRelationInputSchema ]).optional(),
  cursor: MachineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MachineGroupByArgsSchema: z.ZodType<Prisma.MachineGroupByArgs> = z.object({
  where: MachineWhereInputSchema.optional(),
  orderBy: z.union([ MachineOrderByWithAggregationInputSchema.array(),MachineOrderByWithAggregationInputSchema ]).optional(),
  by: MachineScalarFieldEnumSchema.array(),
  having: MachineScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MachineFindUniqueArgsSchema: z.ZodType<Prisma.MachineFindUniqueArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereUniqueInputSchema,
}).strict() ;

export const MachineFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MachineFindUniqueOrThrowArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereUniqueInputSchema,
}).strict() ;

export const WorkerFindFirstArgsSchema: z.ZodType<Prisma.WorkerFindFirstArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereInputSchema.optional(),
  orderBy: z.union([ WorkerOrderByWithRelationInputSchema.array(),WorkerOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerScalarFieldEnumSchema,WorkerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkerFindFirstOrThrowArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereInputSchema.optional(),
  orderBy: z.union([ WorkerOrderByWithRelationInputSchema.array(),WorkerOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerScalarFieldEnumSchema,WorkerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerFindManyArgsSchema: z.ZodType<Prisma.WorkerFindManyArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereInputSchema.optional(),
  orderBy: z.union([ WorkerOrderByWithRelationInputSchema.array(),WorkerOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerScalarFieldEnumSchema,WorkerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerAggregateArgsSchema: z.ZodType<Prisma.WorkerAggregateArgs> = z.object({
  where: WorkerWhereInputSchema.optional(),
  orderBy: z.union([ WorkerOrderByWithRelationInputSchema.array(),WorkerOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkerGroupByArgsSchema: z.ZodType<Prisma.WorkerGroupByArgs> = z.object({
  where: WorkerWhereInputSchema.optional(),
  orderBy: z.union([ WorkerOrderByWithAggregationInputSchema.array(),WorkerOrderByWithAggregationInputSchema ]).optional(),
  by: WorkerScalarFieldEnumSchema.array(),
  having: WorkerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkerFindUniqueArgsSchema: z.ZodType<Prisma.WorkerFindUniqueArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereUniqueInputSchema,
}).strict() ;

export const WorkerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkerFindUniqueOrThrowArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereUniqueInputSchema,
}).strict() ;

export const WorkerRoleFindFirstArgsSchema: z.ZodType<Prisma.WorkerRoleFindFirstArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereInputSchema.optional(),
  orderBy: z.union([ WorkerRoleOrderByWithRelationInputSchema.array(),WorkerRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerRoleScalarFieldEnumSchema,WorkerRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerRoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkerRoleFindFirstOrThrowArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereInputSchema.optional(),
  orderBy: z.union([ WorkerRoleOrderByWithRelationInputSchema.array(),WorkerRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerRoleScalarFieldEnumSchema,WorkerRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerRoleFindManyArgsSchema: z.ZodType<Prisma.WorkerRoleFindManyArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereInputSchema.optional(),
  orderBy: z.union([ WorkerRoleOrderByWithRelationInputSchema.array(),WorkerRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkerRoleScalarFieldEnumSchema,WorkerRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const WorkerRoleAggregateArgsSchema: z.ZodType<Prisma.WorkerRoleAggregateArgs> = z.object({
  where: WorkerRoleWhereInputSchema.optional(),
  orderBy: z.union([ WorkerRoleOrderByWithRelationInputSchema.array(),WorkerRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkerRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkerRoleGroupByArgsSchema: z.ZodType<Prisma.WorkerRoleGroupByArgs> = z.object({
  where: WorkerRoleWhereInputSchema.optional(),
  orderBy: z.union([ WorkerRoleOrderByWithAggregationInputSchema.array(),WorkerRoleOrderByWithAggregationInputSchema ]).optional(),
  by: WorkerRoleScalarFieldEnumSchema.array(),
  having: WorkerRoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const WorkerRoleFindUniqueArgsSchema: z.ZodType<Prisma.WorkerRoleFindUniqueArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereUniqueInputSchema,
}).strict() ;

export const WorkerRoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkerRoleFindUniqueOrThrowArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereUniqueInputSchema,
}).strict() ;

export const InventoryFindFirstArgsSchema: z.ZodType<Prisma.InventoryFindFirstArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryOrderByWithRelationInputSchema.array(),InventoryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryScalarFieldEnumSchema,InventoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InventoryFindFirstOrThrowArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryOrderByWithRelationInputSchema.array(),InventoryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryScalarFieldEnumSchema,InventoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryFindManyArgsSchema: z.ZodType<Prisma.InventoryFindManyArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryOrderByWithRelationInputSchema.array(),InventoryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryScalarFieldEnumSchema,InventoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryAggregateArgsSchema: z.ZodType<Prisma.InventoryAggregateArgs> = z.object({
  where: InventoryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryOrderByWithRelationInputSchema.array(),InventoryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryGroupByArgsSchema: z.ZodType<Prisma.InventoryGroupByArgs> = z.object({
  where: InventoryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryOrderByWithAggregationInputSchema.array(),InventoryOrderByWithAggregationInputSchema ]).optional(),
  by: InventoryScalarFieldEnumSchema.array(),
  having: InventoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryFindUniqueArgsSchema: z.ZodType<Prisma.InventoryFindUniqueArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereUniqueInputSchema,
}).strict() ;

export const InventoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InventoryFindUniqueOrThrowArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereUniqueInputSchema,
}).strict() ;

export const InventoryEntryFindFirstArgsSchema: z.ZodType<Prisma.InventoryEntryFindFirstArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryEntryOrderByWithRelationInputSchema.array(),InventoryEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryEntryScalarFieldEnumSchema,InventoryEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryEntryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InventoryEntryFindFirstOrThrowArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryEntryOrderByWithRelationInputSchema.array(),InventoryEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryEntryScalarFieldEnumSchema,InventoryEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryEntryFindManyArgsSchema: z.ZodType<Prisma.InventoryEntryFindManyArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryEntryOrderByWithRelationInputSchema.array(),InventoryEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InventoryEntryScalarFieldEnumSchema,InventoryEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InventoryEntryAggregateArgsSchema: z.ZodType<Prisma.InventoryEntryAggregateArgs> = z.object({
  where: InventoryEntryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryEntryOrderByWithRelationInputSchema.array(),InventoryEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: InventoryEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryEntryGroupByArgsSchema: z.ZodType<Prisma.InventoryEntryGroupByArgs> = z.object({
  where: InventoryEntryWhereInputSchema.optional(),
  orderBy: z.union([ InventoryEntryOrderByWithAggregationInputSchema.array(),InventoryEntryOrderByWithAggregationInputSchema ]).optional(),
  by: InventoryEntryScalarFieldEnumSchema.array(),
  having: InventoryEntryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InventoryEntryFindUniqueArgsSchema: z.ZodType<Prisma.InventoryEntryFindUniqueArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereUniqueInputSchema,
}).strict() ;

export const InventoryEntryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InventoryEntryFindUniqueOrThrowArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereUniqueInputSchema,
}).strict() ;

export const LocationFindFirstArgsSchema: z.ZodType<Prisma.LocationFindFirstArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LocationFindFirstOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindManyArgsSchema: z.ZodType<Prisma.LocationFindManyArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationAggregateArgsSchema: z.ZodType<Prisma.LocationAggregateArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationGroupByArgsSchema: z.ZodType<Prisma.LocationGroupByArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithAggregationInputSchema.array(),LocationOrderByWithAggregationInputSchema ]).optional(),
  by: LocationScalarFieldEnumSchema.array(),
  having: LocationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationFindUniqueArgsSchema: z.ZodType<Prisma.LocationFindUniqueArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LocationFindUniqueOrThrowArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const ProcessStepFindFirstArgsSchema: z.ZodType<Prisma.ProcessStepFindFirstArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereInputSchema.optional(),
  orderBy: z.union([ ProcessStepOrderByWithRelationInputSchema.array(),ProcessStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ProcessStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProcessStepScalarFieldEnumSchema,ProcessStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProcessStepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProcessStepFindFirstOrThrowArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereInputSchema.optional(),
  orderBy: z.union([ ProcessStepOrderByWithRelationInputSchema.array(),ProcessStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ProcessStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProcessStepScalarFieldEnumSchema,ProcessStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProcessStepFindManyArgsSchema: z.ZodType<Prisma.ProcessStepFindManyArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereInputSchema.optional(),
  orderBy: z.union([ ProcessStepOrderByWithRelationInputSchema.array(),ProcessStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ProcessStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProcessStepScalarFieldEnumSchema,ProcessStepScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProcessStepAggregateArgsSchema: z.ZodType<Prisma.ProcessStepAggregateArgs> = z.object({
  where: ProcessStepWhereInputSchema.optional(),
  orderBy: z.union([ ProcessStepOrderByWithRelationInputSchema.array(),ProcessStepOrderByWithRelationInputSchema ]).optional(),
  cursor: ProcessStepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProcessStepGroupByArgsSchema: z.ZodType<Prisma.ProcessStepGroupByArgs> = z.object({
  where: ProcessStepWhereInputSchema.optional(),
  orderBy: z.union([ ProcessStepOrderByWithAggregationInputSchema.array(),ProcessStepOrderByWithAggregationInputSchema ]).optional(),
  by: ProcessStepScalarFieldEnumSchema.array(),
  having: ProcessStepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProcessStepFindUniqueArgsSchema: z.ZodType<Prisma.ProcessStepFindUniqueArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereUniqueInputSchema,
}).strict() ;

export const ProcessStepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProcessStepFindUniqueOrThrowArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereUniqueInputSchema,
}).strict() ;

export const RecipeFindFirstArgsSchema: z.ZodType<Prisma.RecipeFindFirstArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOrderByWithRelationInputSchema.array(),RecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeScalarFieldEnumSchema,RecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RecipeFindFirstOrThrowArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOrderByWithRelationInputSchema.array(),RecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeScalarFieldEnumSchema,RecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeFindManyArgsSchema: z.ZodType<Prisma.RecipeFindManyArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOrderByWithRelationInputSchema.array(),RecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeScalarFieldEnumSchema,RecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeAggregateArgsSchema: z.ZodType<Prisma.RecipeAggregateArgs> = z.object({
  where: RecipeWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOrderByWithRelationInputSchema.array(),RecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeGroupByArgsSchema: z.ZodType<Prisma.RecipeGroupByArgs> = z.object({
  where: RecipeWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOrderByWithAggregationInputSchema.array(),RecipeOrderByWithAggregationInputSchema ]).optional(),
  by: RecipeScalarFieldEnumSchema.array(),
  having: RecipeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeFindUniqueArgsSchema: z.ZodType<Prisma.RecipeFindUniqueArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereUniqueInputSchema,
}).strict() ;

export const RecipeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RecipeFindUniqueOrThrowArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereUniqueInputSchema,
}).strict() ;

export const RecipeInputFindFirstArgsSchema: z.ZodType<Prisma.RecipeInputFindFirstArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeInputOrderByWithRelationInputSchema.array(),RecipeInputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeInputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeInputScalarFieldEnumSchema,RecipeInputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeInputFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RecipeInputFindFirstOrThrowArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeInputOrderByWithRelationInputSchema.array(),RecipeInputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeInputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeInputScalarFieldEnumSchema,RecipeInputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeInputFindManyArgsSchema: z.ZodType<Prisma.RecipeInputFindManyArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeInputOrderByWithRelationInputSchema.array(),RecipeInputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeInputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeInputScalarFieldEnumSchema,RecipeInputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeInputAggregateArgsSchema: z.ZodType<Prisma.RecipeInputAggregateArgs> = z.object({
  where: RecipeInputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeInputOrderByWithRelationInputSchema.array(),RecipeInputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeInputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeInputGroupByArgsSchema: z.ZodType<Prisma.RecipeInputGroupByArgs> = z.object({
  where: RecipeInputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeInputOrderByWithAggregationInputSchema.array(),RecipeInputOrderByWithAggregationInputSchema ]).optional(),
  by: RecipeInputScalarFieldEnumSchema.array(),
  having: RecipeInputScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeInputFindUniqueArgsSchema: z.ZodType<Prisma.RecipeInputFindUniqueArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereUniqueInputSchema,
}).strict() ;

export const RecipeInputFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RecipeInputFindUniqueOrThrowArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereUniqueInputSchema,
}).strict() ;

export const RecipeOutputFindFirstArgsSchema: z.ZodType<Prisma.RecipeOutputFindFirstArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOutputOrderByWithRelationInputSchema.array(),RecipeOutputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeOutputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeOutputScalarFieldEnumSchema,RecipeOutputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeOutputFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RecipeOutputFindFirstOrThrowArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOutputOrderByWithRelationInputSchema.array(),RecipeOutputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeOutputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeOutputScalarFieldEnumSchema,RecipeOutputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeOutputFindManyArgsSchema: z.ZodType<Prisma.RecipeOutputFindManyArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOutputOrderByWithRelationInputSchema.array(),RecipeOutputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeOutputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RecipeOutputScalarFieldEnumSchema,RecipeOutputScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RecipeOutputAggregateArgsSchema: z.ZodType<Prisma.RecipeOutputAggregateArgs> = z.object({
  where: RecipeOutputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOutputOrderByWithRelationInputSchema.array(),RecipeOutputOrderByWithRelationInputSchema ]).optional(),
  cursor: RecipeOutputWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeOutputGroupByArgsSchema: z.ZodType<Prisma.RecipeOutputGroupByArgs> = z.object({
  where: RecipeOutputWhereInputSchema.optional(),
  orderBy: z.union([ RecipeOutputOrderByWithAggregationInputSchema.array(),RecipeOutputOrderByWithAggregationInputSchema ]).optional(),
  by: RecipeOutputScalarFieldEnumSchema.array(),
  having: RecipeOutputScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RecipeOutputFindUniqueArgsSchema: z.ZodType<Prisma.RecipeOutputFindUniqueArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereUniqueInputSchema,
}).strict() ;

export const RecipeOutputFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RecipeOutputFindUniqueOrThrowArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereUniqueInputSchema,
}).strict() ;

export const LogEntryFindFirstArgsSchema: z.ZodType<Prisma.LogEntryFindFirstArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereInputSchema.optional(),
  orderBy: z.union([ LogEntryOrderByWithRelationInputSchema.array(),LogEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: LogEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogEntryScalarFieldEnumSchema,LogEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogEntryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LogEntryFindFirstOrThrowArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereInputSchema.optional(),
  orderBy: z.union([ LogEntryOrderByWithRelationInputSchema.array(),LogEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: LogEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogEntryScalarFieldEnumSchema,LogEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogEntryFindManyArgsSchema: z.ZodType<Prisma.LogEntryFindManyArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereInputSchema.optional(),
  orderBy: z.union([ LogEntryOrderByWithRelationInputSchema.array(),LogEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: LogEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogEntryScalarFieldEnumSchema,LogEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogEntryAggregateArgsSchema: z.ZodType<Prisma.LogEntryAggregateArgs> = z.object({
  where: LogEntryWhereInputSchema.optional(),
  orderBy: z.union([ LogEntryOrderByWithRelationInputSchema.array(),LogEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: LogEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LogEntryGroupByArgsSchema: z.ZodType<Prisma.LogEntryGroupByArgs> = z.object({
  where: LogEntryWhereInputSchema.optional(),
  orderBy: z.union([ LogEntryOrderByWithAggregationInputSchema.array(),LogEntryOrderByWithAggregationInputSchema ]).optional(),
  by: LogEntryScalarFieldEnumSchema.array(),
  having: LogEntryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LogEntryFindUniqueArgsSchema: z.ZodType<Prisma.LogEntryFindUniqueArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereUniqueInputSchema,
}).strict() ;

export const LogEntryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LogEntryFindUniqueOrThrowArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereUniqueInputSchema,
}).strict() ;

export const SensorFindFirstArgsSchema: z.ZodType<Prisma.SensorFindFirstArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereInputSchema.optional(),
  orderBy: z.union([ SensorOrderByWithRelationInputSchema.array(),SensorOrderByWithRelationInputSchema ]).optional(),
  cursor: SensorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SensorScalarFieldEnumSchema,SensorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SensorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SensorFindFirstOrThrowArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereInputSchema.optional(),
  orderBy: z.union([ SensorOrderByWithRelationInputSchema.array(),SensorOrderByWithRelationInputSchema ]).optional(),
  cursor: SensorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SensorScalarFieldEnumSchema,SensorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SensorFindManyArgsSchema: z.ZodType<Prisma.SensorFindManyArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereInputSchema.optional(),
  orderBy: z.union([ SensorOrderByWithRelationInputSchema.array(),SensorOrderByWithRelationInputSchema ]).optional(),
  cursor: SensorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SensorScalarFieldEnumSchema,SensorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SensorAggregateArgsSchema: z.ZodType<Prisma.SensorAggregateArgs> = z.object({
  where: SensorWhereInputSchema.optional(),
  orderBy: z.union([ SensorOrderByWithRelationInputSchema.array(),SensorOrderByWithRelationInputSchema ]).optional(),
  cursor: SensorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SensorGroupByArgsSchema: z.ZodType<Prisma.SensorGroupByArgs> = z.object({
  where: SensorWhereInputSchema.optional(),
  orderBy: z.union([ SensorOrderByWithAggregationInputSchema.array(),SensorOrderByWithAggregationInputSchema ]).optional(),
  by: SensorScalarFieldEnumSchema.array(),
  having: SensorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SensorFindUniqueArgsSchema: z.ZodType<Prisma.SensorFindUniqueArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereUniqueInputSchema,
}).strict() ;

export const SensorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SensorFindUniqueOrThrowArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereUniqueInputSchema,
}).strict() ;

export const FilterEntryFindFirstArgsSchema: z.ZodType<Prisma.FilterEntryFindFirstArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereInputSchema.optional(),
  orderBy: z.union([ FilterEntryOrderByWithRelationInputSchema.array(),FilterEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterEntryScalarFieldEnumSchema,FilterEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterEntryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FilterEntryFindFirstOrThrowArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereInputSchema.optional(),
  orderBy: z.union([ FilterEntryOrderByWithRelationInputSchema.array(),FilterEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterEntryScalarFieldEnumSchema,FilterEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterEntryFindManyArgsSchema: z.ZodType<Prisma.FilterEntryFindManyArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereInputSchema.optional(),
  orderBy: z.union([ FilterEntryOrderByWithRelationInputSchema.array(),FilterEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterEntryScalarFieldEnumSchema,FilterEntryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterEntryAggregateArgsSchema: z.ZodType<Prisma.FilterEntryAggregateArgs> = z.object({
  where: FilterEntryWhereInputSchema.optional(),
  orderBy: z.union([ FilterEntryOrderByWithRelationInputSchema.array(),FilterEntryOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterEntryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FilterEntryGroupByArgsSchema: z.ZodType<Prisma.FilterEntryGroupByArgs> = z.object({
  where: FilterEntryWhereInputSchema.optional(),
  orderBy: z.union([ FilterEntryOrderByWithAggregationInputSchema.array(),FilterEntryOrderByWithAggregationInputSchema ]).optional(),
  by: FilterEntryScalarFieldEnumSchema.array(),
  having: FilterEntryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FilterEntryFindUniqueArgsSchema: z.ZodType<Prisma.FilterEntryFindUniqueArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereUniqueInputSchema,
}).strict() ;

export const FilterEntryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FilterEntryFindUniqueOrThrowArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereUniqueInputSchema,
}).strict() ;

export const FilterFindFirstArgsSchema: z.ZodType<Prisma.FilterFindFirstArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereInputSchema.optional(),
  orderBy: z.union([ FilterOrderByWithRelationInputSchema.array(),FilterOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterScalarFieldEnumSchema,FilterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FilterFindFirstOrThrowArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereInputSchema.optional(),
  orderBy: z.union([ FilterOrderByWithRelationInputSchema.array(),FilterOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterScalarFieldEnumSchema,FilterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterFindManyArgsSchema: z.ZodType<Prisma.FilterFindManyArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereInputSchema.optional(),
  orderBy: z.union([ FilterOrderByWithRelationInputSchema.array(),FilterOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FilterScalarFieldEnumSchema,FilterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FilterAggregateArgsSchema: z.ZodType<Prisma.FilterAggregateArgs> = z.object({
  where: FilterWhereInputSchema.optional(),
  orderBy: z.union([ FilterOrderByWithRelationInputSchema.array(),FilterOrderByWithRelationInputSchema ]).optional(),
  cursor: FilterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FilterGroupByArgsSchema: z.ZodType<Prisma.FilterGroupByArgs> = z.object({
  where: FilterWhereInputSchema.optional(),
  orderBy: z.union([ FilterOrderByWithAggregationInputSchema.array(),FilterOrderByWithAggregationInputSchema ]).optional(),
  by: FilterScalarFieldEnumSchema.array(),
  having: FilterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FilterFindUniqueArgsSchema: z.ZodType<Prisma.FilterFindUniqueArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereUniqueInputSchema,
}).strict() ;

export const FilterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FilterFindUniqueOrThrowArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereUniqueInputSchema,
}).strict() ;

export const TransportSystemFindFirstArgsSchema: z.ZodType<Prisma.TransportSystemFindFirstArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereInputSchema.optional(),
  orderBy: z.union([ TransportSystemOrderByWithRelationInputSchema.array(),TransportSystemOrderByWithRelationInputSchema ]).optional(),
  cursor: TransportSystemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransportSystemScalarFieldEnumSchema,TransportSystemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransportSystemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TransportSystemFindFirstOrThrowArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereInputSchema.optional(),
  orderBy: z.union([ TransportSystemOrderByWithRelationInputSchema.array(),TransportSystemOrderByWithRelationInputSchema ]).optional(),
  cursor: TransportSystemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransportSystemScalarFieldEnumSchema,TransportSystemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransportSystemFindManyArgsSchema: z.ZodType<Prisma.TransportSystemFindManyArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereInputSchema.optional(),
  orderBy: z.union([ TransportSystemOrderByWithRelationInputSchema.array(),TransportSystemOrderByWithRelationInputSchema ]).optional(),
  cursor: TransportSystemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransportSystemScalarFieldEnumSchema,TransportSystemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransportSystemAggregateArgsSchema: z.ZodType<Prisma.TransportSystemAggregateArgs> = z.object({
  where: TransportSystemWhereInputSchema.optional(),
  orderBy: z.union([ TransportSystemOrderByWithRelationInputSchema.array(),TransportSystemOrderByWithRelationInputSchema ]).optional(),
  cursor: TransportSystemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransportSystemGroupByArgsSchema: z.ZodType<Prisma.TransportSystemGroupByArgs> = z.object({
  where: TransportSystemWhereInputSchema.optional(),
  orderBy: z.union([ TransportSystemOrderByWithAggregationInputSchema.array(),TransportSystemOrderByWithAggregationInputSchema ]).optional(),
  by: TransportSystemScalarFieldEnumSchema.array(),
  having: TransportSystemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransportSystemFindUniqueArgsSchema: z.ZodType<Prisma.TransportSystemFindUniqueArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereUniqueInputSchema,
}).strict() ;

export const TransportSystemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TransportSystemFindUniqueOrThrowArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereUniqueInputSchema,
}).strict() ;

export const OrderFindFirstArgsSchema: z.ZodType<Prisma.OrderFindFirstArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderFindFirstOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindManyArgsSchema: z.ZodType<Prisma.OrderFindManyArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderAggregateArgsSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderGroupByArgsSchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithAggregationInputSchema.array(),OrderOrderByWithAggregationInputSchema ]).optional(),
  by: OrderScalarFieldEnumSchema.array(),
  having: OrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderFindUniqueArgsSchema: z.ZodType<Prisma.OrderFindUniqueArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderFindUniqueOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const ResourceCreateArgsSchema: z.ZodType<Prisma.ResourceCreateArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  data: z.union([ ResourceCreateInputSchema,ResourceUncheckedCreateInputSchema ]),
}).strict() ;

export const ResourceUpsertArgsSchema: z.ZodType<Prisma.ResourceUpsertArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereUniqueInputSchema,
  create: z.union([ ResourceCreateInputSchema,ResourceUncheckedCreateInputSchema ]),
  update: z.union([ ResourceUpdateInputSchema,ResourceUncheckedUpdateInputSchema ]),
}).strict() ;

export const ResourceCreateManyArgsSchema: z.ZodType<Prisma.ResourceCreateManyArgs> = z.object({
  data: z.union([ ResourceCreateManyInputSchema,ResourceCreateManyInputSchema.array() ]),
}).strict() ;

export const ResourceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResourceCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResourceCreateManyInputSchema,ResourceCreateManyInputSchema.array() ]),
}).strict() ;

export const ResourceDeleteArgsSchema: z.ZodType<Prisma.ResourceDeleteArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  where: ResourceWhereUniqueInputSchema,
}).strict() ;

export const ResourceUpdateArgsSchema: z.ZodType<Prisma.ResourceUpdateArgs> = z.object({
  select: ResourceSelectSchema.optional(),
  include: ResourceIncludeSchema.optional(),
  data: z.union([ ResourceUpdateInputSchema,ResourceUncheckedUpdateInputSchema ]),
  where: ResourceWhereUniqueInputSchema,
}).strict() ;

export const ResourceUpdateManyArgsSchema: z.ZodType<Prisma.ResourceUpdateManyArgs> = z.object({
  data: z.union([ ResourceUpdateManyMutationInputSchema,ResourceUncheckedUpdateManyInputSchema ]),
  where: ResourceWhereInputSchema.optional(),
}).strict() ;

export const ResourceDeleteManyArgsSchema: z.ZodType<Prisma.ResourceDeleteManyArgs> = z.object({
  where: ResourceWhereInputSchema.optional(),
}).strict() ;

export const MachineCreateArgsSchema: z.ZodType<Prisma.MachineCreateArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  data: z.union([ MachineCreateInputSchema,MachineUncheckedCreateInputSchema ]),
}).strict() ;

export const MachineUpsertArgsSchema: z.ZodType<Prisma.MachineUpsertArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereUniqueInputSchema,
  create: z.union([ MachineCreateInputSchema,MachineUncheckedCreateInputSchema ]),
  update: z.union([ MachineUpdateInputSchema,MachineUncheckedUpdateInputSchema ]),
}).strict() ;

export const MachineCreateManyArgsSchema: z.ZodType<Prisma.MachineCreateManyArgs> = z.object({
  data: z.union([ MachineCreateManyInputSchema,MachineCreateManyInputSchema.array() ]),
}).strict() ;

export const MachineCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MachineCreateManyAndReturnArgs> = z.object({
  data: z.union([ MachineCreateManyInputSchema,MachineCreateManyInputSchema.array() ]),
}).strict() ;

export const MachineDeleteArgsSchema: z.ZodType<Prisma.MachineDeleteArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  where: MachineWhereUniqueInputSchema,
}).strict() ;

export const MachineUpdateArgsSchema: z.ZodType<Prisma.MachineUpdateArgs> = z.object({
  select: MachineSelectSchema.optional(),
  include: MachineIncludeSchema.optional(),
  data: z.union([ MachineUpdateInputSchema,MachineUncheckedUpdateInputSchema ]),
  where: MachineWhereUniqueInputSchema,
}).strict() ;

export const MachineUpdateManyArgsSchema: z.ZodType<Prisma.MachineUpdateManyArgs> = z.object({
  data: z.union([ MachineUpdateManyMutationInputSchema,MachineUncheckedUpdateManyInputSchema ]),
  where: MachineWhereInputSchema.optional(),
}).strict() ;

export const MachineDeleteManyArgsSchema: z.ZodType<Prisma.MachineDeleteManyArgs> = z.object({
  where: MachineWhereInputSchema.optional(),
}).strict() ;

export const WorkerCreateArgsSchema: z.ZodType<Prisma.WorkerCreateArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  data: z.union([ WorkerCreateInputSchema,WorkerUncheckedCreateInputSchema ]),
}).strict() ;

export const WorkerUpsertArgsSchema: z.ZodType<Prisma.WorkerUpsertArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereUniqueInputSchema,
  create: z.union([ WorkerCreateInputSchema,WorkerUncheckedCreateInputSchema ]),
  update: z.union([ WorkerUpdateInputSchema,WorkerUncheckedUpdateInputSchema ]),
}).strict() ;

export const WorkerCreateManyArgsSchema: z.ZodType<Prisma.WorkerCreateManyArgs> = z.object({
  data: z.union([ WorkerCreateManyInputSchema,WorkerCreateManyInputSchema.array() ]),
}).strict() ;

export const WorkerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkerCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkerCreateManyInputSchema,WorkerCreateManyInputSchema.array() ]),
}).strict() ;

export const WorkerDeleteArgsSchema: z.ZodType<Prisma.WorkerDeleteArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  where: WorkerWhereUniqueInputSchema,
}).strict() ;

export const WorkerUpdateArgsSchema: z.ZodType<Prisma.WorkerUpdateArgs> = z.object({
  select: WorkerSelectSchema.optional(),
  include: WorkerIncludeSchema.optional(),
  data: z.union([ WorkerUpdateInputSchema,WorkerUncheckedUpdateInputSchema ]),
  where: WorkerWhereUniqueInputSchema,
}).strict() ;

export const WorkerUpdateManyArgsSchema: z.ZodType<Prisma.WorkerUpdateManyArgs> = z.object({
  data: z.union([ WorkerUpdateManyMutationInputSchema,WorkerUncheckedUpdateManyInputSchema ]),
  where: WorkerWhereInputSchema.optional(),
}).strict() ;

export const WorkerDeleteManyArgsSchema: z.ZodType<Prisma.WorkerDeleteManyArgs> = z.object({
  where: WorkerWhereInputSchema.optional(),
}).strict() ;

export const WorkerRoleCreateArgsSchema: z.ZodType<Prisma.WorkerRoleCreateArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  data: z.union([ WorkerRoleCreateInputSchema,WorkerRoleUncheckedCreateInputSchema ]),
}).strict() ;

export const WorkerRoleUpsertArgsSchema: z.ZodType<Prisma.WorkerRoleUpsertArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereUniqueInputSchema,
  create: z.union([ WorkerRoleCreateInputSchema,WorkerRoleUncheckedCreateInputSchema ]),
  update: z.union([ WorkerRoleUpdateInputSchema,WorkerRoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const WorkerRoleCreateManyArgsSchema: z.ZodType<Prisma.WorkerRoleCreateManyArgs> = z.object({
  data: z.union([ WorkerRoleCreateManyInputSchema,WorkerRoleCreateManyInputSchema.array() ]),
}).strict() ;

export const WorkerRoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkerRoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkerRoleCreateManyInputSchema,WorkerRoleCreateManyInputSchema.array() ]),
}).strict() ;

export const WorkerRoleDeleteArgsSchema: z.ZodType<Prisma.WorkerRoleDeleteArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  where: WorkerRoleWhereUniqueInputSchema,
}).strict() ;

export const WorkerRoleUpdateArgsSchema: z.ZodType<Prisma.WorkerRoleUpdateArgs> = z.object({
  select: WorkerRoleSelectSchema.optional(),
  include: WorkerRoleIncludeSchema.optional(),
  data: z.union([ WorkerRoleUpdateInputSchema,WorkerRoleUncheckedUpdateInputSchema ]),
  where: WorkerRoleWhereUniqueInputSchema,
}).strict() ;

export const WorkerRoleUpdateManyArgsSchema: z.ZodType<Prisma.WorkerRoleUpdateManyArgs> = z.object({
  data: z.union([ WorkerRoleUpdateManyMutationInputSchema,WorkerRoleUncheckedUpdateManyInputSchema ]),
  where: WorkerRoleWhereInputSchema.optional(),
}).strict() ;

export const WorkerRoleDeleteManyArgsSchema: z.ZodType<Prisma.WorkerRoleDeleteManyArgs> = z.object({
  where: WorkerRoleWhereInputSchema.optional(),
}).strict() ;

export const InventoryCreateArgsSchema: z.ZodType<Prisma.InventoryCreateArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  data: z.union([ InventoryCreateInputSchema,InventoryUncheckedCreateInputSchema ]),
}).strict() ;

export const InventoryUpsertArgsSchema: z.ZodType<Prisma.InventoryUpsertArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereUniqueInputSchema,
  create: z.union([ InventoryCreateInputSchema,InventoryUncheckedCreateInputSchema ]),
  update: z.union([ InventoryUpdateInputSchema,InventoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const InventoryCreateManyArgsSchema: z.ZodType<Prisma.InventoryCreateManyArgs> = z.object({
  data: z.union([ InventoryCreateManyInputSchema,InventoryCreateManyInputSchema.array() ]),
}).strict() ;

export const InventoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.InventoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ InventoryCreateManyInputSchema,InventoryCreateManyInputSchema.array() ]),
}).strict() ;

export const InventoryDeleteArgsSchema: z.ZodType<Prisma.InventoryDeleteArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  where: InventoryWhereUniqueInputSchema,
}).strict() ;

export const InventoryUpdateArgsSchema: z.ZodType<Prisma.InventoryUpdateArgs> = z.object({
  select: InventorySelectSchema.optional(),
  include: InventoryIncludeSchema.optional(),
  data: z.union([ InventoryUpdateInputSchema,InventoryUncheckedUpdateInputSchema ]),
  where: InventoryWhereUniqueInputSchema,
}).strict() ;

export const InventoryUpdateManyArgsSchema: z.ZodType<Prisma.InventoryUpdateManyArgs> = z.object({
  data: z.union([ InventoryUpdateManyMutationInputSchema,InventoryUncheckedUpdateManyInputSchema ]),
  where: InventoryWhereInputSchema.optional(),
}).strict() ;

export const InventoryDeleteManyArgsSchema: z.ZodType<Prisma.InventoryDeleteManyArgs> = z.object({
  where: InventoryWhereInputSchema.optional(),
}).strict() ;

export const InventoryEntryCreateArgsSchema: z.ZodType<Prisma.InventoryEntryCreateArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  data: z.union([ InventoryEntryCreateInputSchema,InventoryEntryUncheckedCreateInputSchema ]),
}).strict() ;

export const InventoryEntryUpsertArgsSchema: z.ZodType<Prisma.InventoryEntryUpsertArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereUniqueInputSchema,
  create: z.union([ InventoryEntryCreateInputSchema,InventoryEntryUncheckedCreateInputSchema ]),
  update: z.union([ InventoryEntryUpdateInputSchema,InventoryEntryUncheckedUpdateInputSchema ]),
}).strict() ;

export const InventoryEntryCreateManyArgsSchema: z.ZodType<Prisma.InventoryEntryCreateManyArgs> = z.object({
  data: z.union([ InventoryEntryCreateManyInputSchema,InventoryEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const InventoryEntryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.InventoryEntryCreateManyAndReturnArgs> = z.object({
  data: z.union([ InventoryEntryCreateManyInputSchema,InventoryEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const InventoryEntryDeleteArgsSchema: z.ZodType<Prisma.InventoryEntryDeleteArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  where: InventoryEntryWhereUniqueInputSchema,
}).strict() ;

export const InventoryEntryUpdateArgsSchema: z.ZodType<Prisma.InventoryEntryUpdateArgs> = z.object({
  select: InventoryEntrySelectSchema.optional(),
  include: InventoryEntryIncludeSchema.optional(),
  data: z.union([ InventoryEntryUpdateInputSchema,InventoryEntryUncheckedUpdateInputSchema ]),
  where: InventoryEntryWhereUniqueInputSchema,
}).strict() ;

export const InventoryEntryUpdateManyArgsSchema: z.ZodType<Prisma.InventoryEntryUpdateManyArgs> = z.object({
  data: z.union([ InventoryEntryUpdateManyMutationInputSchema,InventoryEntryUncheckedUpdateManyInputSchema ]),
  where: InventoryEntryWhereInputSchema.optional(),
}).strict() ;

export const InventoryEntryDeleteManyArgsSchema: z.ZodType<Prisma.InventoryEntryDeleteManyArgs> = z.object({
  where: InventoryEntryWhereInputSchema.optional(),
}).strict() ;

export const LocationCreateArgsSchema: z.ZodType<Prisma.LocationCreateArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  data: z.union([ LocationCreateInputSchema,LocationUncheckedCreateInputSchema ]),
}).strict() ;

export const LocationUpsertArgsSchema: z.ZodType<Prisma.LocationUpsertArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
  create: z.union([ LocationCreateInputSchema,LocationUncheckedCreateInputSchema ]),
  update: z.union([ LocationUpdateInputSchema,LocationUncheckedUpdateInputSchema ]),
}).strict() ;

export const LocationCreateManyArgsSchema: z.ZodType<Prisma.LocationCreateManyArgs> = z.object({
  data: z.union([ LocationCreateManyInputSchema,LocationCreateManyInputSchema.array() ]),
}).strict() ;

export const LocationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LocationCreateManyAndReturnArgs> = z.object({
  data: z.union([ LocationCreateManyInputSchema,LocationCreateManyInputSchema.array() ]),
}).strict() ;

export const LocationDeleteArgsSchema: z.ZodType<Prisma.LocationDeleteArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateArgsSchema: z.ZodType<Prisma.LocationUpdateArgs> = z.object({
  select: LocationSelectSchema.optional(),
  include: LocationIncludeSchema.optional(),
  data: z.union([ LocationUpdateInputSchema,LocationUncheckedUpdateInputSchema ]),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateManyArgsSchema: z.ZodType<Prisma.LocationUpdateManyArgs> = z.object({
  data: z.union([ LocationUpdateManyMutationInputSchema,LocationUncheckedUpdateManyInputSchema ]),
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const LocationDeleteManyArgsSchema: z.ZodType<Prisma.LocationDeleteManyArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const ProcessStepCreateArgsSchema: z.ZodType<Prisma.ProcessStepCreateArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  data: z.union([ ProcessStepCreateInputSchema,ProcessStepUncheckedCreateInputSchema ]),
}).strict() ;

export const ProcessStepUpsertArgsSchema: z.ZodType<Prisma.ProcessStepUpsertArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereUniqueInputSchema,
  create: z.union([ ProcessStepCreateInputSchema,ProcessStepUncheckedCreateInputSchema ]),
  update: z.union([ ProcessStepUpdateInputSchema,ProcessStepUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProcessStepCreateManyArgsSchema: z.ZodType<Prisma.ProcessStepCreateManyArgs> = z.object({
  data: z.union([ ProcessStepCreateManyInputSchema,ProcessStepCreateManyInputSchema.array() ]),
}).strict() ;

export const ProcessStepCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProcessStepCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProcessStepCreateManyInputSchema,ProcessStepCreateManyInputSchema.array() ]),
}).strict() ;

export const ProcessStepDeleteArgsSchema: z.ZodType<Prisma.ProcessStepDeleteArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  where: ProcessStepWhereUniqueInputSchema,
}).strict() ;

export const ProcessStepUpdateArgsSchema: z.ZodType<Prisma.ProcessStepUpdateArgs> = z.object({
  select: ProcessStepSelectSchema.optional(),
  include: ProcessStepIncludeSchema.optional(),
  data: z.union([ ProcessStepUpdateInputSchema,ProcessStepUncheckedUpdateInputSchema ]),
  where: ProcessStepWhereUniqueInputSchema,
}).strict() ;

export const ProcessStepUpdateManyArgsSchema: z.ZodType<Prisma.ProcessStepUpdateManyArgs> = z.object({
  data: z.union([ ProcessStepUpdateManyMutationInputSchema,ProcessStepUncheckedUpdateManyInputSchema ]),
  where: ProcessStepWhereInputSchema.optional(),
}).strict() ;

export const ProcessStepDeleteManyArgsSchema: z.ZodType<Prisma.ProcessStepDeleteManyArgs> = z.object({
  where: ProcessStepWhereInputSchema.optional(),
}).strict() ;

export const RecipeCreateArgsSchema: z.ZodType<Prisma.RecipeCreateArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  data: z.union([ RecipeCreateInputSchema,RecipeUncheckedCreateInputSchema ]),
}).strict() ;

export const RecipeUpsertArgsSchema: z.ZodType<Prisma.RecipeUpsertArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereUniqueInputSchema,
  create: z.union([ RecipeCreateInputSchema,RecipeUncheckedCreateInputSchema ]),
  update: z.union([ RecipeUpdateInputSchema,RecipeUncheckedUpdateInputSchema ]),
}).strict() ;

export const RecipeCreateManyArgsSchema: z.ZodType<Prisma.RecipeCreateManyArgs> = z.object({
  data: z.union([ RecipeCreateManyInputSchema,RecipeCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RecipeCreateManyAndReturnArgs> = z.object({
  data: z.union([ RecipeCreateManyInputSchema,RecipeCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeDeleteArgsSchema: z.ZodType<Prisma.RecipeDeleteArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  where: RecipeWhereUniqueInputSchema,
}).strict() ;

export const RecipeUpdateArgsSchema: z.ZodType<Prisma.RecipeUpdateArgs> = z.object({
  select: RecipeSelectSchema.optional(),
  include: RecipeIncludeSchema.optional(),
  data: z.union([ RecipeUpdateInputSchema,RecipeUncheckedUpdateInputSchema ]),
  where: RecipeWhereUniqueInputSchema,
}).strict() ;

export const RecipeUpdateManyArgsSchema: z.ZodType<Prisma.RecipeUpdateManyArgs> = z.object({
  data: z.union([ RecipeUpdateManyMutationInputSchema,RecipeUncheckedUpdateManyInputSchema ]),
  where: RecipeWhereInputSchema.optional(),
}).strict() ;

export const RecipeDeleteManyArgsSchema: z.ZodType<Prisma.RecipeDeleteManyArgs> = z.object({
  where: RecipeWhereInputSchema.optional(),
}).strict() ;

export const RecipeInputCreateArgsSchema: z.ZodType<Prisma.RecipeInputCreateArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  data: z.union([ RecipeInputCreateInputSchema,RecipeInputUncheckedCreateInputSchema ]),
}).strict() ;

export const RecipeInputUpsertArgsSchema: z.ZodType<Prisma.RecipeInputUpsertArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereUniqueInputSchema,
  create: z.union([ RecipeInputCreateInputSchema,RecipeInputUncheckedCreateInputSchema ]),
  update: z.union([ RecipeInputUpdateInputSchema,RecipeInputUncheckedUpdateInputSchema ]),
}).strict() ;

export const RecipeInputCreateManyArgsSchema: z.ZodType<Prisma.RecipeInputCreateManyArgs> = z.object({
  data: z.union([ RecipeInputCreateManyInputSchema,RecipeInputCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeInputCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RecipeInputCreateManyAndReturnArgs> = z.object({
  data: z.union([ RecipeInputCreateManyInputSchema,RecipeInputCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeInputDeleteArgsSchema: z.ZodType<Prisma.RecipeInputDeleteArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  where: RecipeInputWhereUniqueInputSchema,
}).strict() ;

export const RecipeInputUpdateArgsSchema: z.ZodType<Prisma.RecipeInputUpdateArgs> = z.object({
  select: RecipeInputSelectSchema.optional(),
  include: RecipeInputIncludeSchema.optional(),
  data: z.union([ RecipeInputUpdateInputSchema,RecipeInputUncheckedUpdateInputSchema ]),
  where: RecipeInputWhereUniqueInputSchema,
}).strict() ;

export const RecipeInputUpdateManyArgsSchema: z.ZodType<Prisma.RecipeInputUpdateManyArgs> = z.object({
  data: z.union([ RecipeInputUpdateManyMutationInputSchema,RecipeInputUncheckedUpdateManyInputSchema ]),
  where: RecipeInputWhereInputSchema.optional(),
}).strict() ;

export const RecipeInputDeleteManyArgsSchema: z.ZodType<Prisma.RecipeInputDeleteManyArgs> = z.object({
  where: RecipeInputWhereInputSchema.optional(),
}).strict() ;

export const RecipeOutputCreateArgsSchema: z.ZodType<Prisma.RecipeOutputCreateArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  data: z.union([ RecipeOutputCreateInputSchema,RecipeOutputUncheckedCreateInputSchema ]),
}).strict() ;

export const RecipeOutputUpsertArgsSchema: z.ZodType<Prisma.RecipeOutputUpsertArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereUniqueInputSchema,
  create: z.union([ RecipeOutputCreateInputSchema,RecipeOutputUncheckedCreateInputSchema ]),
  update: z.union([ RecipeOutputUpdateInputSchema,RecipeOutputUncheckedUpdateInputSchema ]),
}).strict() ;

export const RecipeOutputCreateManyArgsSchema: z.ZodType<Prisma.RecipeOutputCreateManyArgs> = z.object({
  data: z.union([ RecipeOutputCreateManyInputSchema,RecipeOutputCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeOutputCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RecipeOutputCreateManyAndReturnArgs> = z.object({
  data: z.union([ RecipeOutputCreateManyInputSchema,RecipeOutputCreateManyInputSchema.array() ]),
}).strict() ;

export const RecipeOutputDeleteArgsSchema: z.ZodType<Prisma.RecipeOutputDeleteArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  where: RecipeOutputWhereUniqueInputSchema,
}).strict() ;

export const RecipeOutputUpdateArgsSchema: z.ZodType<Prisma.RecipeOutputUpdateArgs> = z.object({
  select: RecipeOutputSelectSchema.optional(),
  include: RecipeOutputIncludeSchema.optional(),
  data: z.union([ RecipeOutputUpdateInputSchema,RecipeOutputUncheckedUpdateInputSchema ]),
  where: RecipeOutputWhereUniqueInputSchema,
}).strict() ;

export const RecipeOutputUpdateManyArgsSchema: z.ZodType<Prisma.RecipeOutputUpdateManyArgs> = z.object({
  data: z.union([ RecipeOutputUpdateManyMutationInputSchema,RecipeOutputUncheckedUpdateManyInputSchema ]),
  where: RecipeOutputWhereInputSchema.optional(),
}).strict() ;

export const RecipeOutputDeleteManyArgsSchema: z.ZodType<Prisma.RecipeOutputDeleteManyArgs> = z.object({
  where: RecipeOutputWhereInputSchema.optional(),
}).strict() ;

export const LogEntryCreateArgsSchema: z.ZodType<Prisma.LogEntryCreateArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  data: z.union([ LogEntryCreateInputSchema,LogEntryUncheckedCreateInputSchema ]),
}).strict() ;

export const LogEntryUpsertArgsSchema: z.ZodType<Prisma.LogEntryUpsertArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereUniqueInputSchema,
  create: z.union([ LogEntryCreateInputSchema,LogEntryUncheckedCreateInputSchema ]),
  update: z.union([ LogEntryUpdateInputSchema,LogEntryUncheckedUpdateInputSchema ]),
}).strict() ;

export const LogEntryCreateManyArgsSchema: z.ZodType<Prisma.LogEntryCreateManyArgs> = z.object({
  data: z.union([ LogEntryCreateManyInputSchema,LogEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const LogEntryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LogEntryCreateManyAndReturnArgs> = z.object({
  data: z.union([ LogEntryCreateManyInputSchema,LogEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const LogEntryDeleteArgsSchema: z.ZodType<Prisma.LogEntryDeleteArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  where: LogEntryWhereUniqueInputSchema,
}).strict() ;

export const LogEntryUpdateArgsSchema: z.ZodType<Prisma.LogEntryUpdateArgs> = z.object({
  select: LogEntrySelectSchema.optional(),
  include: LogEntryIncludeSchema.optional(),
  data: z.union([ LogEntryUpdateInputSchema,LogEntryUncheckedUpdateInputSchema ]),
  where: LogEntryWhereUniqueInputSchema,
}).strict() ;

export const LogEntryUpdateManyArgsSchema: z.ZodType<Prisma.LogEntryUpdateManyArgs> = z.object({
  data: z.union([ LogEntryUpdateManyMutationInputSchema,LogEntryUncheckedUpdateManyInputSchema ]),
  where: LogEntryWhereInputSchema.optional(),
}).strict() ;

export const LogEntryDeleteManyArgsSchema: z.ZodType<Prisma.LogEntryDeleteManyArgs> = z.object({
  where: LogEntryWhereInputSchema.optional(),
}).strict() ;

export const SensorCreateArgsSchema: z.ZodType<Prisma.SensorCreateArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  data: z.union([ SensorCreateInputSchema,SensorUncheckedCreateInputSchema ]),
}).strict() ;

export const SensorUpsertArgsSchema: z.ZodType<Prisma.SensorUpsertArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereUniqueInputSchema,
  create: z.union([ SensorCreateInputSchema,SensorUncheckedCreateInputSchema ]),
  update: z.union([ SensorUpdateInputSchema,SensorUncheckedUpdateInputSchema ]),
}).strict() ;

export const SensorCreateManyArgsSchema: z.ZodType<Prisma.SensorCreateManyArgs> = z.object({
  data: z.union([ SensorCreateManyInputSchema,SensorCreateManyInputSchema.array() ]),
}).strict() ;

export const SensorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SensorCreateManyAndReturnArgs> = z.object({
  data: z.union([ SensorCreateManyInputSchema,SensorCreateManyInputSchema.array() ]),
}).strict() ;

export const SensorDeleteArgsSchema: z.ZodType<Prisma.SensorDeleteArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  where: SensorWhereUniqueInputSchema,
}).strict() ;

export const SensorUpdateArgsSchema: z.ZodType<Prisma.SensorUpdateArgs> = z.object({
  select: SensorSelectSchema.optional(),
  include: SensorIncludeSchema.optional(),
  data: z.union([ SensorUpdateInputSchema,SensorUncheckedUpdateInputSchema ]),
  where: SensorWhereUniqueInputSchema,
}).strict() ;

export const SensorUpdateManyArgsSchema: z.ZodType<Prisma.SensorUpdateManyArgs> = z.object({
  data: z.union([ SensorUpdateManyMutationInputSchema,SensorUncheckedUpdateManyInputSchema ]),
  where: SensorWhereInputSchema.optional(),
}).strict() ;

export const SensorDeleteManyArgsSchema: z.ZodType<Prisma.SensorDeleteManyArgs> = z.object({
  where: SensorWhereInputSchema.optional(),
}).strict() ;

export const FilterEntryCreateArgsSchema: z.ZodType<Prisma.FilterEntryCreateArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  data: z.union([ FilterEntryCreateInputSchema,FilterEntryUncheckedCreateInputSchema ]),
}).strict() ;

export const FilterEntryUpsertArgsSchema: z.ZodType<Prisma.FilterEntryUpsertArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereUniqueInputSchema,
  create: z.union([ FilterEntryCreateInputSchema,FilterEntryUncheckedCreateInputSchema ]),
  update: z.union([ FilterEntryUpdateInputSchema,FilterEntryUncheckedUpdateInputSchema ]),
}).strict() ;

export const FilterEntryCreateManyArgsSchema: z.ZodType<Prisma.FilterEntryCreateManyArgs> = z.object({
  data: z.union([ FilterEntryCreateManyInputSchema,FilterEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const FilterEntryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FilterEntryCreateManyAndReturnArgs> = z.object({
  data: z.union([ FilterEntryCreateManyInputSchema,FilterEntryCreateManyInputSchema.array() ]),
}).strict() ;

export const FilterEntryDeleteArgsSchema: z.ZodType<Prisma.FilterEntryDeleteArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  where: FilterEntryWhereUniqueInputSchema,
}).strict() ;

export const FilterEntryUpdateArgsSchema: z.ZodType<Prisma.FilterEntryUpdateArgs> = z.object({
  select: FilterEntrySelectSchema.optional(),
  include: FilterEntryIncludeSchema.optional(),
  data: z.union([ FilterEntryUpdateInputSchema,FilterEntryUncheckedUpdateInputSchema ]),
  where: FilterEntryWhereUniqueInputSchema,
}).strict() ;

export const FilterEntryUpdateManyArgsSchema: z.ZodType<Prisma.FilterEntryUpdateManyArgs> = z.object({
  data: z.union([ FilterEntryUpdateManyMutationInputSchema,FilterEntryUncheckedUpdateManyInputSchema ]),
  where: FilterEntryWhereInputSchema.optional(),
}).strict() ;

export const FilterEntryDeleteManyArgsSchema: z.ZodType<Prisma.FilterEntryDeleteManyArgs> = z.object({
  where: FilterEntryWhereInputSchema.optional(),
}).strict() ;

export const FilterCreateArgsSchema: z.ZodType<Prisma.FilterCreateArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  data: z.union([ FilterCreateInputSchema,FilterUncheckedCreateInputSchema ]),
}).strict() ;

export const FilterUpsertArgsSchema: z.ZodType<Prisma.FilterUpsertArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereUniqueInputSchema,
  create: z.union([ FilterCreateInputSchema,FilterUncheckedCreateInputSchema ]),
  update: z.union([ FilterUpdateInputSchema,FilterUncheckedUpdateInputSchema ]),
}).strict() ;

export const FilterCreateManyArgsSchema: z.ZodType<Prisma.FilterCreateManyArgs> = z.object({
  data: z.union([ FilterCreateManyInputSchema,FilterCreateManyInputSchema.array() ]),
}).strict() ;

export const FilterCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FilterCreateManyAndReturnArgs> = z.object({
  data: z.union([ FilterCreateManyInputSchema,FilterCreateManyInputSchema.array() ]),
}).strict() ;

export const FilterDeleteArgsSchema: z.ZodType<Prisma.FilterDeleteArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  where: FilterWhereUniqueInputSchema,
}).strict() ;

export const FilterUpdateArgsSchema: z.ZodType<Prisma.FilterUpdateArgs> = z.object({
  select: FilterSelectSchema.optional(),
  include: FilterIncludeSchema.optional(),
  data: z.union([ FilterUpdateInputSchema,FilterUncheckedUpdateInputSchema ]),
  where: FilterWhereUniqueInputSchema,
}).strict() ;

export const FilterUpdateManyArgsSchema: z.ZodType<Prisma.FilterUpdateManyArgs> = z.object({
  data: z.union([ FilterUpdateManyMutationInputSchema,FilterUncheckedUpdateManyInputSchema ]),
  where: FilterWhereInputSchema.optional(),
}).strict() ;

export const FilterDeleteManyArgsSchema: z.ZodType<Prisma.FilterDeleteManyArgs> = z.object({
  where: FilterWhereInputSchema.optional(),
}).strict() ;

export const TransportSystemCreateArgsSchema: z.ZodType<Prisma.TransportSystemCreateArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  data: z.union([ TransportSystemCreateInputSchema,TransportSystemUncheckedCreateInputSchema ]),
}).strict() ;

export const TransportSystemUpsertArgsSchema: z.ZodType<Prisma.TransportSystemUpsertArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereUniqueInputSchema,
  create: z.union([ TransportSystemCreateInputSchema,TransportSystemUncheckedCreateInputSchema ]),
  update: z.union([ TransportSystemUpdateInputSchema,TransportSystemUncheckedUpdateInputSchema ]),
}).strict() ;

export const TransportSystemCreateManyArgsSchema: z.ZodType<Prisma.TransportSystemCreateManyArgs> = z.object({
  data: z.union([ TransportSystemCreateManyInputSchema,TransportSystemCreateManyInputSchema.array() ]),
}).strict() ;

export const TransportSystemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TransportSystemCreateManyAndReturnArgs> = z.object({
  data: z.union([ TransportSystemCreateManyInputSchema,TransportSystemCreateManyInputSchema.array() ]),
}).strict() ;

export const TransportSystemDeleteArgsSchema: z.ZodType<Prisma.TransportSystemDeleteArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  where: TransportSystemWhereUniqueInputSchema,
}).strict() ;

export const TransportSystemUpdateArgsSchema: z.ZodType<Prisma.TransportSystemUpdateArgs> = z.object({
  select: TransportSystemSelectSchema.optional(),
  include: TransportSystemIncludeSchema.optional(),
  data: z.union([ TransportSystemUpdateInputSchema,TransportSystemUncheckedUpdateInputSchema ]),
  where: TransportSystemWhereUniqueInputSchema,
}).strict() ;

export const TransportSystemUpdateManyArgsSchema: z.ZodType<Prisma.TransportSystemUpdateManyArgs> = z.object({
  data: z.union([ TransportSystemUpdateManyMutationInputSchema,TransportSystemUncheckedUpdateManyInputSchema ]),
  where: TransportSystemWhereInputSchema.optional(),
}).strict() ;

export const TransportSystemDeleteManyArgsSchema: z.ZodType<Prisma.TransportSystemDeleteManyArgs> = z.object({
  where: TransportSystemWhereInputSchema.optional(),
}).strict() ;

export const OrderCreateArgsSchema: z.ZodType<Prisma.OrderCreateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
}).strict() ;

export const OrderUpsertArgsSchema: z.ZodType<Prisma.OrderUpsertArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
  create: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
  update: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrderCreateManyArgsSchema: z.ZodType<Prisma.OrderCreateManyArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
}).strict() ;

export const OrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
}).strict() ;

export const OrderDeleteArgsSchema: z.ZodType<Prisma.OrderDeleteArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateArgsSchema: z.ZodType<Prisma.OrderUpdateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateManyArgsSchema: z.ZodType<Prisma.OrderUpdateManyArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema,OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(),
}).strict() ;

export const OrderDeleteManyArgsSchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
}).strict() ;