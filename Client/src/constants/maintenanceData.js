export const EQUIPMENT_HEALTH = [
  { name: "Pump P101", health: 62, risk: "High", failure: 34, temp: [61, 63, 66, 68, 71, 74, 77] },
  { name: "Motor M-12", health: 71, risk: "Medium", failure: 21, temp: [58, 59, 60, 62, 63, 64, 66] },
  { name: "Compressor A-02", health: 88, risk: "Low", failure: 6, temp: [50, 51, 50, 52, 51, 53, 52] },
  { name: "Tank T-11", health: 55, risk: "High", failure: 41, temp: [40, 42, 45, 48, 52, 55, 58] },
  { name: "Boiler Unit 2", health: 93, risk: "Low", failure: 4, temp: [80, 81, 80, 82, 81, 80, 81] },
];

export const RECOMMENDED_ACTIONS = [
  { t: "Replace bearing on Pump P101 within 7 days", p: "Critical", c: "danger" },
  { t: "Recalibrate pressure sensors on Tank T-11", p: "High", c: "warning" },
  { t: "Schedule routine service for Compressor A-02", p: "Normal", c: "success" },
];

export const RECENT_INCIDENTS = [
  { t: "INC-2291 \u2013 Pump P101 bearing failure", d: "12 Jul 2026" },
  { t: "INC-1188 \u2013 Tank T-11 overpressure event", d: "28 Jun 2026" },
];
