import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input, { Label } from "../common/Input";
import { ROLES } from "../../constants/roles";

export default function InviteUserModal({ onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onInvite(email.trim(), role);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invite. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Invite user" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoFocus
          />
        </div>

        <div>
          <Label>Role</Label>
          <Input as="select" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </Input>
        </div>

        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghostLight" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
