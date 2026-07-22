import React from "react";
import { UserCog, Bell, Share2 } from "lucide-react";
import Card from "../components/common/Card";
import SectionTitle from "../components/common/SectionTitle";
import { getRoleById } from "../constants/roles";

const NOTIFICATION_PREFS = [
  "Critical equipment alerts",
  "Compliance expiry reminders",
  "Weekly AI knowledge digest",
];

export default function SettingsPage({ user }) {
  const role = getRoleById(user.role);

  return (
    <div className="max-w-[640px]">
      <Card className="mb-4">
        <SectionTitle icon={UserCog} title="Profile" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11.5px] font-semibold text-subtext mb-1.5 uppercase">Name</label>
            <input
              defaultValue={user.name}
              className="w-full px-3 py-2.5 rounded-[10px] border border-hairline bg-surface text-ink text-[13.5px] font-sans outline-none box-border"
            />
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-subtext mb-1.5 uppercase">Role</label>
            <input
              defaultValue={role?.label}
              disabled
              className="w-full px-3 py-2.5 rounded-[10px] border border-hairline bg-surface text-subtext text-[13.5px] font-sans outline-none box-border"
            />
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <SectionTitle icon={Bell} title="Notifications" />
        {NOTIFICATION_PREFS.map((pref) => (
          <div key={pref} className="flex items-center justify-between py-2.5 border-b border-hairline last:border-0">
            <span className="text-[13px] text-ink">{pref}</span>
            <div className="w-[38px] h-[22px] rounded-full bg-primary relative">
              <div className="w-4 h-4 rounded-full bg-white absolute top-[3px] right-[3px]" />
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle icon={Share2} title="Knowledge Graph Preferences" />
        <p className="text-xs text-subtext leading-relaxed m-0">
          Control how the live knowledge graph panel behaves across the workspace \u2014 auto-expand depth, default
          filters and animation speed.
        </p>
      </Card>
    </div>
  );
}
