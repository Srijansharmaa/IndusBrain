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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 flex items-center justify-center font-sans p-6">
      <div className="w-full max-w-[760px]">
        <div className="flex items-center gap-2.5 justify-center mb-7">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles size={19} className="text-white" />
          </div>
         <div className="flex flex-col">
  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
    IndustrialIQ
  </span>

  <span className="text-xs font-medium text-slate-500">
    Enterprise Intelligence Platform
  </span>
</div>
        </div>

        <div className="relative rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl p-10 shadow-xl">
          <h1 className="text-[22px] font-extrabold text-slate-900 m-0 mb-1 tracking-tight">Sign in to your workspace</h1>
          <p className="text-[13.5px] text-slate-500 m-0 mb-6">Enterprise Knowledge Intelligence Platform</p>

          <Label >Full name</Label>
          <Input className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="mt-4">
            <Label >Plant</Label>

<Input
  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"
  as="select"
  value={plant}
  onChange={(e) => setPlant(e.target.value)}
>
              {PLANTS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Input>
          </div>

          <div className="mt-[18px]">
            <Label >Choose your role</Label>
            <RoleSelector selectedRole={role} onSelect={setRole} />
          </div>

          <button
            disabled={!role}
            onClick={() => onLogin({ name, plant, role })}
            className={cx(
              "mt-6 w-full py-3.5 rounded-xl border-none text-sm font-bold font-sans transition-all duration-200",
              role ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Enter workspace
          </button>
        </div>
      </div>
    </div>
  );
}
