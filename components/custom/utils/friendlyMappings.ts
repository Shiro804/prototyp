// app/kpis/utils/friendlyMappings.ts

// A dictionary of technical field names -> user-friendly labels
export const FRIENDLY_FIELD_LABELS: Record<string, string> = {
  // Already existing
  createdAt: "Created At",
  updatedAt: "Updated At",
  name: "Name",
  active: "Active",
  inputSpeed: "Input Speed",
  outputSpeed: "Output Speed",
  inventoryId: "Inventory ID",
  minQuantity: "Minimum Quantity",
  transportDelay: "Transport Delay",
  startStepId: "Start Step ID",
  endStepId: "End Step ID",
  startTSid: "Start Transport System ID",
  endTSid: "End Transport System ID",
  processStepId: "Process Step ID",
  locationId: "Location ID",
  mandatory: "Mandatory",
  productionResource: "Production Resource",
  inventoryResource: "Inventory Resource",
  faulty: "Faulty",
  faultyRate: "Faulty Rate",
  orderId: "Order ID",
  arrivedTick: "Arrived Tick",
  id: "ID",
  status: "Status",
  priority: "Priority",
  dueDate: "Due Date",
  description: "Description",
  quantity: "Quantity",
  startedAt: "Started At",
  startedTick: "Started Tick",
  completedTick: "Completed Tick",
  completedAt: "Completed At",
  canceledAt: "Canceled At",
  materialsReserved: "Materials Reserved",
  logEntries: "Logged Entries",
  scanner: "Scanner",
  materialName: "Material Name",
  inputType: "Input Type",
  type: "Type",
  inventory: "Inventory",
  orders: "Orders",
  sensors: "Sensors",
  resources: "Resources",
  recipe: "Recipe",
  __queue: "Queue",
  __inventoryMultiplier: "Inventory Multiplier",
};

// A dictionary of technical status codes -> user-friendly statuses
export const FRIENDLY_STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  completed: "Completed",
  pending: "Pending",
  // add more if needed
};

// The locale you want for date formatting (e.g. "de-DE" or "en-US")
const LOCALE = "de-DE";

// The list of fields we want to treat as dates
const DATE_FIELDS = [
  "createdAt",
  "updatedAt",
  "startedAt",
  "completedAt",
  "canceledAt",
  // add any others you use
];

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

/**
 * Convert a raw timestamp or ISO string to a consistent format.
 */
function formatMyDate(date: Date) {
  return date.toLocaleString(LOCALE, DATE_OPTIONS);
}

// Returns a user-friendly label for a given field (fallback = original)
export function getFriendlyLabel(field: string): string {
  return FRIENDLY_FIELD_LABELS[field] ?? field;
}

// Returns a user-friendly label for a known status (fallback = original)
export function getFriendlyStatusLabel(status: string): string {
  return FRIENDLY_STATUS_LABELS[status] ?? status;
}

/**
 * Helper to check if a string is parseable as a date
 */
function isParseableDateString(val: any) {
  if (typeof val !== "string") return false;
  const parsed = Date.parse(val);
  return !isNaN(parsed);
}

/**
 * Returns a user-friendly string for a given field/value pair.
 */
export function getFriendlyValue(key: string, value: any): string {
  // 1) If it's the status field, return the friendly status label
  if (key === "status" && typeof value === "string") {
    return getFriendlyStatusLabel(value);
  }

  // 2) If this field is in our known date fields, handle numeric or string
  if (DATE_FIELDS.includes(key)) {
    // numeric -> new Date(value) or parse the ISO string
    const dateObj =
      typeof value === "number"
        ? new Date(value)
        : new Date(isParseableDateString(value) ? Date.parse(value) : value);

    return formatMyDate(dateObj);
  }

  // 3) If it's a generic object/array, we can JSON-stringify it
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  // 4) Fallback for everything else
  return String(value);
}
