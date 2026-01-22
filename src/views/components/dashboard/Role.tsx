"use client";

import { useSession } from "next-auth/react";

const RoleComponent = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  const roles = session.roles || [];

  return (
    <div className="text-xs text-black" >
      <h1>Welcome, {session.user?.email}</h1>
      <h2>Your Roles:</h2>
      <ul>
        {roles.map((role, index) => (
          <li key={index}>{role}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoleComponent;
