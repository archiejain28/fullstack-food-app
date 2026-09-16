"use client";

import { useEffect, useState } from "react";
import { REGISTER_ROLES } from "@/lib/roles";

export type RegisterFormValues = {
  name: string;
  email: string;
  address: string;
  phone_no: string;
  role: string;
};

type RegisterFormProps = {
  initialName?: string;
  initialEmail?: string;
  initialAddress?: string;
  initialPhone?: string;
  initialRole?: string;
  emailReadOnly?: boolean;
  submitLabel: string;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
};

export default function RegisterForm({
  initialName = "",
  initialEmail = "",
  initialAddress = "",
  initialPhone = "",
  initialRole = REGISTER_ROLES[0],
  emailReadOnly = false,
  submitLabel,
  onSubmit,
}: RegisterFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [role, setRole] = useState<string>(initialRole);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
    setAddress(initialAddress);
    setPhone(initialPhone);
    setRole(initialRole);
  }, [initialName, initialEmail, initialAddress, initialPhone, initialRole]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        phone_no: phone.trim(),
        role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form register-form">
      <label>
        Full Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          readOnly={emailReadOnly}
          required
        />
      </label>

      <label>
        Address
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Delivery address"
          required
          minLength={5}
        />
      </label>

      <label>
        Phone Number
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
          placeholder="10-digit phone number"
          required
          maxLength={10}
          minLength={10}
        />
      </label>

      <label>
        Role
        <select
          className="admin-select register-select"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          {REGISTER_ROLES.map((option) => (
            <option key={option} value={option}>
              {option === "CUSTOMER" ? "Customer" : "Delivery Agent"}
            </option>
          ))}
        </select>
      </label>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
        {saving ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}
