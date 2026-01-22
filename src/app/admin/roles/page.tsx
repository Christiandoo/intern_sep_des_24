"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string | null;
  roles: string[];
};

const ROLES = ["admin", "manager", "specialist"];

export default function RoleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // set role awal
        const initialRoles: Record<string, string> = {};
        data.forEach((u: User) => {
          initialRoles[u.id] = u.roles[0];
        });
        setPendingRoles(initialRoles);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = (userId: string, role: string) => {
    setPendingRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(pendingRoles).map(([userId, role]) =>
          fetch(`/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          })
        )
      );

      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          roles: [pendingRoles[u.id]],
        }))
      );

      alert("Roles updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update roles");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const hasChanges = users.some(
    (u) => u.roles[0] !== pendingRoles[u.id]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>

      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">
                <select
                  value={pendingRoles[user.id]}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        disabled={!hasChanges || saving}
        className={`px-4 py-2 rounded text-white ${
          hasChanges
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}