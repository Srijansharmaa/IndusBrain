import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, Power, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "../common/Badge";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import InviteUserModal from "./InviteUserModal";
import EditUserModal from "./EditUserModal";
import { ROLES } from "../../constants/roles";
import { deleteUser, updateUser } from "../../services/adminService";
import { useToast } from "../common/Toast";

export default function UsersTable({
  users,
  pagination,
  loading,
  filters,
  onFiltersChange,
  onInvite,
  onUserChanged,
  onUserDeleted,
}) {
  const [inviting, setInviting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const toast = useToast();

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";
    try {
      const result = await updateUser(user.id, { status: nextStatus });
      onUserChanged(result.user);
      toast({ type: "success", message: `${user.name} is now ${nextStatus.toLowerCase()}.` });
    } catch (err) {
      toast({ type: "error", message: err.response?.data?.message || "Failed to update status." });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Remove ${user.name}? This can't be undone.`)) return;
    try {
      await deleteUser(user.id);
      onUserDeleted(user.id);
      toast({ type: "success", message: `${user.name} removed.` });
    } catch (err) {
      toast({ type: "error", message: err.response?.data?.message || "Failed to remove user." });
    }
  };

  return (
    <div className="bg-card rounded-card border border-hairline overflow-hidden mb-4">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between flex-wrap gap-3">
        <span className="font-bold text-[14.5px] text-ink">Users & Permissions</span>
        <button
          onClick={() => setInviting(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-none bg-primary text-white text-xs font-bold cursor-pointer font-sans"
        >
          <Plus size={13} /> Invite user
        </button>
      </div>

      <div className="px-5 py-3 border-b border-hairline flex items-center gap-2.5 flex-wrap bg-surface">
        <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 border border-hairline flex-1 min-w-[200px]">
          <Search size={14} className="text-subtext" />
          <input
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
            placeholder="Search by name or email..."
            className="border-none outline-none bg-transparent text-[13px] w-full font-sans text-ink"
          />
        </div>
        <select
          value={filters.role}
          onChange={(e) => onFiltersChange({ ...filters, role: e.target.value, page: 1 })}
          className="rounded-lg border border-hairline bg-card px-2.5 py-2 text-xs text-ink"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value, page: 1 })}
          className="rounded-lg border border-hairline bg-card px-2.5 py-2 text-xs text-ink"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Invited">Invited</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search or filter." />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface">
              {["Name", "Role", "Plant", "Status", ""].map((heading) => (
                <th key={heading} className="text-left px-5 py-2.5 text-[11px] text-subtext font-bold uppercase">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-hairline">
                <td className="px-5 py-3.5 text-[13px] text-ink font-semibold">
                  {user.name}
                  <p className="m-0 text-[11px] font-normal text-subtext">{user.email}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-subtext">{user.role}</td>
                <td className="px-5 py-3.5 text-xs text-subtext">{user.plant}</td>
                <td className="px-5 py-3.5">
                  <Badge tone={user.status === "Active" ? "success" : "warning"}>{user.status}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      title={user.status === "Active" ? "Suspend" : "Activate"}
                      className="rounded-lg p-1.5 hover:bg-surface text-subtext"
                    >
                      <Power size={14} />
                    </button>
                    <button
                      onClick={() => setEditingUser(user)}
                      title="Edit"
                      className="rounded-lg p-1.5 hover:bg-surface text-subtext"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      title="Remove"
                      className="rounded-lg p-1.5 hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination?.pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-hairline text-xs text-subtext">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} users)</span>
          <div className="flex gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onFiltersChange({ ...filters, page: filters.page - 1 })}
              className="rounded-lg p-1.5 border border-hairline disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => onFiltersChange({ ...filters, page: filters.page + 1 })}
              className="rounded-lg p-1.5 border border-hairline disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {inviting && (
        <InviteUserModal
          onClose={() => setInviting(false)}
          onInvite={(email, role) => onInvite(email, role)}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={onUserChanged}
        />
      )}
    </div>
  );
}
