"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string | null;
  roles: string[];
};

type RoleManagementPageProps = {
  onRoleChange?: () => void;
};

const ROLES = ["admin", "manager", "specialist"];

export default function RoleManagementPage({
  onRoleChange,
}: RoleManagementPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);

      const initRoles: Record<string, string> = {};
      data.forEach((u: User) => {
        initRoles[u.id] = u.roles[0] || ROLES[0];
      });
      setSelectedRoles(initRoles);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const submitRole = async (userId: string) => {
    const role = selectedRoles[userId];

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      fetchUsers();
      onRoleChange?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  const deleteUser = async (userId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Username</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.username || "-"}</td>
              <td className="border p-2">
                <select
                  value={selectedRoles[u.id]}
                  onChange={(e) =>
                    setSelectedRoles((prev) => ({
                      ...prev,
                      [u.id]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => submitRole(u.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Submit
                </button>

                <button
                  onClick={() => deleteUser(u.id)}
                  disabled={deletingUserId === u.id}
                  className={`px-3 py-1 rounded text-white ${
                    deletingUserId === u.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deletingUserId === u.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
