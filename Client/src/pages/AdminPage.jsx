import React, { useEffect, useState } from "react";
import { Users, Building2, Activity, Share2 } from "lucide-react";
import MetricCard from "../components/common/MetricCard";
import UsersTable from "../components/admin/UsersTable";
import ActivityLog from "../components/admin/ActivityLog";
import KnowledgeMonitor from "../components/admin/KnowledgeMonitor";
import { getAdminUsers, getAdminMetrics, getActivityLog, inviteUser } from "../services/adminService";

const ICONS = { Users, Building2, Activity, Share2 };
const TABS = [
  { id: "users", label: "Users & Permissions" },
  { id: "knowledge", label: "Knowledge Monitor" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", role: "", status: "", page: 1 });
  const [metrics, setMetrics] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    getAdminMetrics().then(setMetrics);
    getActivityLog().then(setActivityLog);
  }, []);

  useEffect(() => {
    setUsersLoading(true);
    getAdminUsers({ ...filters, limit: 10 })
      .then((res) => {
        setUsers(res.users);
        setPagination(res.pagination);
      })
      .finally(() => setUsersLoading(false));
  }, [filters]);

  const handleInvite = async (email, role) => {
    await inviteUser(email, role);
    const res = await getAdminUsers({ ...filters, limit: 10 });
    setUsers(res.users);
    setPagination(res.pagination);
  };

  const handleUserChanged = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
  };

  const handleUserDeleted = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4.5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} icon={ICONS[metric.icon]} />
        ))}
      </div>

      <div className="flex gap-1.5 mb-4 border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-subtext hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <>
          <UsersTable
            users={users}
            pagination={pagination}
            loading={usersLoading}
            filters={filters}
            onFiltersChange={setFilters}
            onInvite={handleInvite}
            onUserChanged={handleUserChanged}
            onUserDeleted={handleUserDeleted}
          />
          <ActivityLog entries={activityLog} />
        </>
      ) : (
        <KnowledgeMonitor />
      )}
    </div>
  );
}
