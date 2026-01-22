import {  IconList } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function TotalAssignments() {
  const [totalAssignments, setTotalAssignments] = useState(0);

  useEffect(() => {
    async function fetchAssignments() {
      const response = await fetch("/api/assignment/userId");
      const data = await response.json();

      if (!data.error) {
        setTotalAssignments(data.totalAssignments);
      }
    }

    fetchAssignments();
  }, []);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Number of Assignments</h3>
      <div className="flex items-center space-x-3 mt-4">
        <div className="p-3 rounded-full bg-white flex items-center justify-center outline outline-1 outline-gray-300">
          <IconList size={12} className="text-gray-700" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalAssignments}</p>
      </div>
    </div>
  );
}
