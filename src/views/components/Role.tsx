"use client";

import { useEffect, useState } from "react";

interface Role {
  id: string;
  name: string;
}

const RoleComponent = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/role");
        const data = await response.json();
        console.log(data);
        const rolesArray = data.map((item: { role: any }) => item.role);
        setRoles(rolesArray);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="relative flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {roles.map((role) => (
          <span
            key={role.id}
            className="text-gray-600 bg-white px-3 py-1 rounded-md border-2 border-[#9089fc]"
          >
            {role.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoleComponent;
