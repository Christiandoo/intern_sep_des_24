"use client";

import { useEffect, useState } from "react";
interface AssignmentProps {
  projectId: string;
}
interface Assignment {
  id: string;
  title: string;
  userId: string;
  user: {
    username: string;
  };
  projectId: string;
}

export default function AssignmentList({ projectId }: AssignmentProps) {
  const [assignment, setassignment] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchassignment = async () => {
      try {
        const response = await fetch(
          `/api/project/assignment/project?id=${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignment");
        }

        const result = await response.json();
        console.log("API result:", result); // Debug log

        if (result.success && Array.isArray(result.data.assignments)) {
          setassignment(result.data.assignments);
        } else {
          throw new Error(
            result.message || "Invalid data format: expected an array."
          );
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchassignment();
  }, [projectId]);

  if (isLoading) {
    return <p>Loading assignment...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="assignment-card">
      {assignment.length === 0 ? (
        <p>No assignment found.</p>
      ) : (
        <ul className="space-y-4">
          {assignment.map((assignment) => (
            <li
              key={assignment.id}
              className="assignment-content items-center flex"
            >
              <div className="relative">
                
              <div className="left-list"> </div>
                <div className="ml-3">
                <div className="title">{assignment.title}</div>
                <div className="subtitle">
                  {assignment.user?.username || "Unassigned"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
