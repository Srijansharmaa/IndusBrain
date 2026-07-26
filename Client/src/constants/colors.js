export const NODE_TYPE_STYLES = {
  equipment: { colorClass: "text-primary", bgClass: "bg-primary-soft", dot: "bg-primary", label: "Equipment" },
  material: { colorClass: "text-danger", bgClass: "bg-danger-soft", dot: "bg-danger", label: "Material" },
  document: { colorClass: "text-warning", bgClass: "bg-warning-soft", dot: "bg-warning", label: "Document" },
  person: { colorClass: "text-purple", bgClass: "bg-purple-soft", dot: "bg-purple", label: "Person / Org" },
  process: { colorClass: "text-success", bgClass: "bg-success-soft", dot: "bg-success", label: "Process" },
  unknown: { colorClass: "text-subtext", bgClass: "bg-surface", dot: "bg-slate-400", label: "Other" },
};

export const NODE_TYPE_HEX = {
  equipment: "#2563EB",
  material: "#EF4444",
  document: "#F59E0B",
  person: "#7C3AED",
  process: "#22C55E",
  unknown: "#94A3B8",
};

/**
 * Maps the AI Engine's real entity-extraction types (see
 * ai_engine/knowledge_graph/knowledge_extractor.py's ENTITY TYPES list)
 * onto the small set of visual buckets above. Anything not listed here
 * falls back to "unknown" instead of crashing the UI, so the graph stays
 * renderable even if the extractor's type list changes in the future.
 */
export const ENTITY_TYPE_BUCKET = {
  Equipment: "equipment",
  Component: "equipment",
  System: "equipment",
  Sensor: "equipment",
  Instrument: "equipment",
  Valve: "equipment",
  Pump: "equipment",
  Motor: "equipment",
  Pipeline: "equipment",
  Material: "material",
  Chemical: "material",
  Location: "person",
  Department: "person",
  Person: "person",
  Organization: "person",
  Document: "document",
  Process: "process",
  Software: "process",
  Parameter: "process",
  Unknown: "unknown",
};

export const getNodeTypeBucket = (type) => ENTITY_TYPE_BUCKET[type] || "unknown";
export const getNodeTypeStyle = (type) => NODE_TYPE_STYLES[getNodeTypeBucket(type)];
export const getNodeTypeHex = (type) => NODE_TYPE_HEX[getNodeTypeBucket(type)];

export const PIE_CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#7C3AED", "#EF4444"];
