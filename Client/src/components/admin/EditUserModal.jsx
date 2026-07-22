import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input, { Label } from "../common/Input";
import { ROLES } from "../../constants/roles";
import { PLANTS } from "../../constants/plants";
import { updateUser } from "../../services/adminService";

export default function EditUserModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(user.roleId || ROLES[0].id);
  const [plant, setPlant] = useState(user.plantId || PLANTS[0].id);
  const [status, setStatus] = useState(user.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await updateUser(user.id, { role, plant, status });
      onSaved(result.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit ${user.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Role</Label>
          <Input as="select" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </Input>
        </div>

        <div>
          <Label>Plant</Label>
          <Input as="select" value={plant} onChange={(e) => setPlant(e.target.value)}>
            {PLANTS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </Input>
        </div>

        <div>
          <Label>Status</Label>
          <Input as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Invited">Invited</option>
          </Input>
        </div>

        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghostLight" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
