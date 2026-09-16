"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/roles";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleDrafts, setRoleDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .getUsers()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
        setRoleDrafts(
          Object.fromEntries(
            list.map((user) => [user.user_id, user.role?.toUpperCase() ?? "CUSTOMER"]),
          ),
        );
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: number) => {
    const newRole = roleDrafts[userId];
    if (!newRole) return;

    setSavingId(userId);
    setError("");
    setMessage("");

    try {
      await api.updateUserRole(userId, newRole);
      setUsers((current) =>
        current.map((user) =>
          user.user_id === userId ? { ...user, role: newRole } : user,
        ),
      );
      setMessage(`Role updated for user #${userId}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className="hero">
        <h1>Manage Users</h1>
        <p className="muted">View all users and update their roles.</p>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {users.length === 0 ? (
        <div className="empty-state card">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_no || "—"}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={roleDrafts[user.user_id] ?? user.role}
                      onChange={(event) =>
                        setRoleDrafts((current) => ({
                          ...current,
                          [user.user_id]: event.target.value,
                        }))
                      }
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleRoleChange(user.user_id)}
                      disabled={
                        savingId === user.user_id ||
                        roleDrafts[user.user_id] === user.role?.toUpperCase()
                      }
                    >
                      {savingId === user.user_id ? "Saving..." : "Update"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
