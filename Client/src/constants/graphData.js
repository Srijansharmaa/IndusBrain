export const GRAPH_NODES = [
  { id: "p101", type: "equipment", label: "Pump P101", x: 360, y: 70 },
  { id: "b204", type: "equipment", label: "Bearing B-204", x: 220, y: 150 },
  { id: "m12", type: "equipment", label: "Motor M-12", x: 500, y: 150 },
  { id: "inc2291", type: "incident", label: "Incident INC-2291", x: 360, y: 230 },
  { id: "mr0091", type: "document", label: "Maint. Report MR-0091", x: 220, y: 310 },
  { id: "rec114", type: "recommendation", label: "Recommendation REC-114", x: 500, y: 310 },
  { id: "sk_verma", type: "person", label: "S. Verma \u2013 Eng.", x: 70, y: 230 },
  { id: "compA02", type: "equipment", label: "Compressor A-02", x: 650, y: 70 },
  { id: "tnk11", type: "equipment", label: "Tank T-11", x: 640, y: 230 },
  { id: "sop0044", type: "document", label: "SOP-0044", x: 500, y: 60 },
  { id: "insp_q3", type: "document", label: "Inspection Q3-2026", x: 100, y: 70 },
  { id: "r_iyer", type: "person", label: "R. Iyer \u2013 Safety", x: 640, y: 320 },
  { id: "inc1188", type: "incident", label: "Incident INC-1188", x: 780, y: 150 },
];

export const GRAPH_EDGES = [
  ["p101", "b204"], ["p101", "m12"], ["b204", "inc2291"], ["m12", "inc2291"],
  ["inc2291", "mr0091"], ["inc2291", "rec114"], ["mr0091", "sk_verma"],
  ["p101", "sop0044"], ["compA02", "m12"], ["m12", "tnk11"], ["tnk11", "inc1188"],
  ["inc1188", "r_iyer"], ["insp_q3", "b204"],
];

export const HERO_PATH = ["p101", "b204", "m12", "inc2291", "mr0091", "rec114"];

export const findNodeById = (id) => GRAPH_NODES.find((node) => node.id === id);

export const findRelatedNodeIds = (nodeId) =>
  GRAPH_EDGES
    .filter(([a, b]) => a === nodeId || b === nodeId)
    .map(([a, b]) => (a === nodeId ? b : a));
