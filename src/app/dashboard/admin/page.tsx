"use client";

import { useSession } from "next-auth/react";
import RoleManagementPage from "@/views/components/admin/RoleManagementPage";
import ViewProject from "@/views/components/project/viewProject";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session || !session.roles?.includes("admin")) {
    return <p className="p-6 text-red-500">Access denied</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* 🧑‍💼 ROLE MANAGEMENT */}
      <section>
        <h2 className="text-xl font-semibold mb-3">User Role Management</h2>
        <RoleManagementPage />
      </section>

      {/* 📁 PROJECT LIST */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Project List</h2>
        <ViewProject />
      </section>
    </div>
  );
}
