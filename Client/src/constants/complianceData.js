export const COMPLIANCE_ITEMS = [
  { name: "Boiler Unit 2 \u2013 Statutory Inspection", status: "Valid", exp: "May 2027", risk: "Low" },
  { name: "Environmental Clearance \u2013 Zone 3", status: "Valid", exp: "Jan 2027", risk: "Low" },
  { name: "Pressure Vessel Certificate \u2013 Tank T-11", status: "Expiring", exp: "02 Aug 2026", risk: "High" },
  { name: "Fire Safety Audit \u2013 Plant Wide", status: "Expiring", exp: "18 Aug 2026", risk: "Medium" },
  { name: "Electrical Safety Certificate \u2013 Sub-station 4", status: "Expired", exp: "30 Jun 2026", risk: "High" },
];

export const COMPLIANCE_STATUS_COLOR = {
  Valid: "success",
  Expiring: "warning",
  Expired: "danger",
};

export const COMPLIANCE_METRICS = [
  { label: "Compliance Score", value: "92%", delta: "+1.8%", up: true, icon: "ShieldCheck", color: "success" },
  { label: "Valid Certificates", value: "34", icon: "FileCheck2", color: "primary" },
  { label: "Expiring Soon", value: "5", icon: "Clock", color: "warning" },
  { label: "Expired", value: "2", icon: "AlertTriangle", color: "danger" },
];
