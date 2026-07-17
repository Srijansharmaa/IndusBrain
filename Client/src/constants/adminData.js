export const ADMIN_USERS = [
  { name: "Arjun Mehta", role: "Plant Manager", plant: "Jamnagar", status: "Active" },
  { name: "S. Verma", role: "Maintenance Engineer", plant: "Jamnagar", status: "Active" },
  { name: "R. Iyer", role: "Safety Officer", plant: "Panipat", status: "Active" },
  { name: "P. Nair", role: "Compliance Officer", plant: "Mundra", status: "Invited" },
  { name: "K. Rao", role: "Quality Engineer", plant: "Vindhyachal", status: "Active" },
];

export const ADMIN_METRICS = [
  { label: "Total Users", value: "342", delta: "+12", up: true, icon: "Users", color: "primary" },
  { label: "Plants", value: "6", icon: "Building2", color: "purple" },
  { label: "System Health", value: "99.98%", delta: "+0.02%", up: true, icon: "Activity", color: "success" },
  { label: "Graph Nodes", value: "18,204", delta: "+2.1%", up: true, icon: "Share2", color: "warning" },
];

export const ACTIVITY_LOG = [
  "Admin updated permissions for Compliance Officer role",
  "New plant added: Adani \u2013 Mundra Power",
  "System backup completed successfully",
];
