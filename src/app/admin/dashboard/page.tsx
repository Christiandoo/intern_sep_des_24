"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import DashboardLayout from "@/views/components/dashboard/Dashboard";
import RoleManagementPage from "@/views/components/admin/RoleManagementPage";
import ViewProject from "@/views/components/project/viewProject";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [roleUpdated, setRoleUpdated] = useState(false);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || !session.roles?.includes("admin"))
    return <p className="p-6 text-red-500">Access denied</p>;

  const handleRoleChange = () => setRoleUpdated((prev) => !prev);

  return (
    <div className="p-6 flex space-x-6">
      <DashboardLayout />

      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Role Management */}
        <section>
          <h2 className="text-xl font-semibold mb-3">User Role Management</h2>
          <RoleManagementPage onRoleChange={handleRoleChange} />
        </section>

        {/* Project List */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Project List</h2>
          <ViewProject roleUpdated={roleUpdated} />
        </section>
      </div>
    </div>
  );
}
