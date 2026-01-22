import { IconFolder } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function TotalProjects() {
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch("/api/project/userId");
      const data = await response.json();

      if (!data.error) {
        setTotalProjects(data.totalProjects);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Number of Projects</h3>
      <div className="flex items-center space-x-3 mt-4">
        <div className="p-3 rounded-full bg-white flex items-center justify-center outline outline-1 outline-gray-300">
          <IconFolder size={12} className="text-gray-700" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
      </div>
    </div>
  );
}
