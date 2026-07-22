// UI-only lookup: maps a ComplianceItem's status string to a Badge tone.
// Not mock data - the statuses themselves always come from the backend.
export const COMPLIANCE_STATUS_COLOR = {
  Valid: "success",
  Expiring: "warning",
  Expired: "danger",
};

