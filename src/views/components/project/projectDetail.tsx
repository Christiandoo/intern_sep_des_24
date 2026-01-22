"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconCalendar,
  IconEye,
  IconPlus,
  IconX,
  IconEdit,
} from "@tabler/icons-react";
import AssignmentForm from "../assignment/assignmentForm";
import AssignmentList from "../assignment/assignmentList";
import "./style.css";
import DeleteButton from "./DeleteButton";



interface Project {
  id: string;
  name: string;
  status: string;
  description: string;
  start?: string;
  end?: string;
  workOrder?: string;
  userRole?: { user?: { username?: string } };
}

interface ProjectDetailProps {
  projectId: string;
  onSuccess: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ProjectDetail({ projectId, onSuccess }: ProjectDetailProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch project detail
  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/project?id=${projectId}`);
      const data = await res.json();
      if (res.ok) setSelectedProject(data.data);
      else console.error("Fetch project error:", data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleAssignmentOpen = () => setIsAccordionOpen((prev) => !prev);

  const handleViewWorkOrder = (fileUrl?: string) => {
    if (!fileUrl) return alert("Work order file not available");
    window.open(fileUrl, "_blank");
  };

  const handleMarkAsFinish = async () => {
    if (!selectedProject?.id) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/project/${selectedProject.id}/status`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "Finish" }),
});

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server did not return JSON");
      }

      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setSelectedProject((prev) => prev && { ...prev, status: "Finish" });
      onSuccess();
      alert("Project marked as Finish!");
    } catch (err: any) {
      console.error("Update failed:", err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const isPending = selectedProject?.status?.toLowerCase() === "pending";

  return (
    <div className="detail-container">
      {selectedProject ? (
        <div>
          <div className="text-status">{selectedProject.status}</div>
          <h2 className="detail-title">{selectedProject.name}</h2>

          <div className="pop-up-content">
            <div className="flex items-center gap-3 text-gray-700">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="subtext">Project Leader</span>
                <span className="block text-base">
                  {selectedProject.userRole?.user?.username || "Unknown User"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="icon-purple">
                <IconCalendar />
              </div>
              <div>
                <span className="subtext">Due Date</span>
                <span className="block text-base">
                  {selectedProject.end
                    ? formatDate(selectedProject.end)
                    : "No due date"}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{selectedProject.description}</p>
          </div>

          <div className="pop-up-content gap-2 mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleViewWorkOrder(selectedProject.workOrder)}
              disabled={!selectedProject.workOrder}
              className="submit-button"
            >
              <IconEye className="w-4 h-4 mr-1" />
              View Work Order
            </button>

            <button
              onClick={() =>
                router.push(`/editprojects/id?projectId=${projectId}`)
              }
              className="edit-button"
            >
              <IconEdit className="w-4 h-4 mr-1" />
              Edit Project
            </button>
            <div className="pop-up-content gap-2 mb-4 flex flex-wrap">

  <DeleteButton
    projectId={selectedProject.id}
    onSuccess={() => {
      onSuccess();          // refresh parent
      window.location.reload(); // aman untuk sekarang
    }}
  />
</div>
            

            {isPending && (
              <button
                onClick={handleMarkAsFinish}
                disabled={updatingStatus}
                className={`px-3 py-1 rounded text-white ${
                  updatingStatus
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {updatingStatus ? "Updating..." : "Mark as Finish"}
              </button>
            )}
          </div>

          <div>
            <div className="pop-up-content mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Assignment List
              </h2>

              <button
                onClick={handleAssignmentOpen}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isAccordionOpen
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {isAccordionOpen ? (
                  <IconX size={20} className="text-white" />
                ) : (
                  <IconPlus size={20} className="text-white" />
                )}
              </button>
            </div>
            

            {isAccordionOpen && (
              <AssignmentForm
                projectId={projectId}
                onSuccess={() => {
                  setIsAccordionOpen(false);
                  onSuccess();
                }}
              />
            )}

            <AssignmentList projectId={selectedProject.id} />
          </div>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}
