import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import Input, { Label } from "../common/Input";
import RoleSelector from "./RoleSelector";
import { PLANTS } from "../../constants/plants";
import { cx } from "../../utils/classNames";

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState(null);
  const [plant, setPlant] = useState(PLANTS[0].id);
  const [name, setName] = useState("Arjun Mehta");

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center font-sans p-6">
      <div className="w-full max-w-[760px]">
        <div className="flex items-center gap-2.5 justify-center mb-7">
          <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-primary to-purple flex items-center justify-center">
            <Sparkles size={19} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">IndustrialIQ</span>
        </div>

        <div className="bg-navy-soft border border-navy-line rounded-[20px] p-8">
          <h1 className="text-[22px] font-extrabold text-white m-0 mb-1 tracking-tight">Sign in to your workspace</h1>
          <p className="text-[13.5px] text-slate-400 m-0 mb-6">Enterprise Knowledge Intelligence Platform</p>

          <Label dark>Full name</Label>
          <Input dark value={name} onChange={(e) => setName(e.target.value)} />

          <div className="mt-4">
            <Label dark>Plant</Label>
            <Input dark as="select" value={plant} onChange={(e) => setPlant(e.target.value)}>
              {PLANTS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Input>
          </div>

          <div className="mt-[18px]">
            <Label dark>Choose your role</Label>
            <RoleSelector selectedRole={role} onSelect={setRole} />
          </div>

          <button
            disabled={!role}
            onClick={() => onLogin({ name, plant, role })}
            className={cx(
              "mt-6 w-full py-3.5 rounded-xl border-none text-sm font-bold font-sans transition-colors",
              role ? "bg-primary text-white cursor-pointer" : "bg-navy-line text-slate-500 cursor-not-allowed"
            )}
          >
            Enter workspace
          </button>
        </div>
      </div>
    </div>
  );
}
