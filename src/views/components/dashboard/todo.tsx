"use client";

import { useEffect, useState } from "react";
import Loading from "../loading";

export default function TodoList() {
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/project/range");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch projects");
        }

        setProjects(
          result.data.map((project: { name: string }) => project.name)
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    // Simulate a delay of 3 seconds (3000ms)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">TO DO</h1>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects found</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {projects.map((name, index) => (
            <li key={index} className="text-gray-800">
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
