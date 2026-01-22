"use client";

import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";

interface DeleteButtonProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function DeleteButton({
  projectId,
  onSuccess,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      alert("Project deleted successfully");
      onSuccess?.();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
    >
      <IconTrash size={18} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
