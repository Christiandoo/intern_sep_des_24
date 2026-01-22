"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Popup from "./PopUp";
import ProjectDetail from "./projectDetail";
import { IconFlag } from "@tabler/icons-react";

interface Project {
  id: string;
  name: string;
  end?: string;
  description: string;
}

type ViewProjectProps = {
  roleUpdated?: boolean;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(date);
}

export default function ViewProject({ roleUpdated }: ViewProjectProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

 const fetchProjects = async () => {
  try {
    const res = await fetch("/api/project");
    const result = await res.json();

    if (res.ok) {
      setProjects(result.data);
    } else {
      console.error(result.message);
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchProjects();
  }, [roleUpdated]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-gray-500">List of all projects</p>
        </div>
        <Link href="/addprojects" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedProject(project)}
          >
            <h3 className="font-semibold mb-2">{project.name}</h3>
            <p className="text-sm mb-2 line-clamp-2">{project.description}</p>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <IconFlag size={16} />
              <span>{project.end ? formatDate(project.end) : "No date available"}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <Popup
          title={selectedProject.name}
          content={<ProjectDetail projectId={selectedProject.id} onSuccess={() => fetchProjects()} />}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
