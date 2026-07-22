import React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import Badge from "../common/Badge";

export default function UsersTable({ users, onInvite }) {
  return (
    <div className="bg-card rounded-card border border-hairline overflow-hidden mb-4">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <span className="font-bold text-[14.5px] text-ink">Users & Permissions</span>
        <button
          onClick={onInvite}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-none bg-primary text-white text-xs font-bold cursor-pointer font-sans"
        >
          <Plus size={13} /> Invite user
        </button>
      </div>
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
            <tr key={user.name} className="border-t border-hairline">
              <td className="px-5 py-3.5 text-[13px] text-ink font-semibold">{user.name}</td>
              <td className="px-5 py-3.5 text-xs text-subtext">{user.role}</td>
              <td className="px-5 py-3.5 text-xs text-subtext">{user.plant}</td>
              <td className="px-5 py-3.5">
                <Badge tone={user.status === "Active" ? "success" : "warning"}>{user.status}</Badge>
              </td>
              <td className="px-5 py-3.5"><MoreHorizontal size={14} className="text-subtext" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
