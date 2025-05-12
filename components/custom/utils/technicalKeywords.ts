/**
 * A list of technical property names (keys) that we want to skip
 * when rendering tooltips, etc.
 */
export const PROPERTIES_TO_SKIP: string[] = [
  "id",
  "priority",
  "materialsReserved",
  "createdAt",
  "updatedAt",
  "startedTick",
  "completedTick",
  "__queue",
  "__inventoryMultiplier",
  "resources",
  "endStepId",
  "startStepId",
  "transportDelay",
  "minimumQuantity",
  "inventoryId",
  "processStepId",
  "usedSlots",
  "index",
  "transportSystemId",
  "sensorDelay",
  "value",
  "__productionMultiplier",
  "__ongoingProduction",
  "materialId",
  "sensorId",
  "filter",
  "outputs",
  "inputs",
  "errorRate",
  "recipeId",
  "duration",
  "recipeRate"
];
