import React, { useEffect, useState } from "react";
import { Users, Building2, Activity, Share2 } from "lucide-react";
import MetricCard from "../components/common/MetricCard";
import UsersTable from "../components/admin/UsersTable";
import ActivityLog from "../components/admin/ActivityLog";
import { getAdminUsers, getAdminMetrics, getActivityLog, inviteUser } from "../services/adminService";

const ICONS = { Users, Building2, Activity, Share2 };

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    getAdminUsers().then(setUsers);
    getAdminMetrics().then(setMetrics);
    getActivityLog().then(setActivityLog);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3.5 mb-4.5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} icon={ICONS[metric.icon]} />
        ))}
      </div>
      <UsersTable users={users} onInvite={() => inviteUser("", "")} />
      <ActivityLog entries={activityLog} />
    </div>
  );
}
