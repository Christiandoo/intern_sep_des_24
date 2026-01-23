'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

interface UserRole {
  user: { id: string; username: string };
  role: { id: string; name: string };
}

export default function AddProject() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [dateEnded, setDateEnded] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/project/get");
        const result = await response.json();
        if (response.ok && Array.isArray(result.data)) {
          const validRoles: UserRole[] = result.data
            .filter((r: any) => r.user && r.role)
            .map((r: any) => ({
              user: { id: r.user.id, username: r.user.username },
              role: { id: r.role.id, name: r.role.name },
            }));
          setRoles(validRoles);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !name || !description || !dateStarted || !dateEnded || !selectedRole) {
      setAlert({ type: "error", message: "Please fill all fields" });
      return;
    }

    setIsLoading(true);
    const [userId, roleId] = selectedRole.split("|");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("dateStarted", dateStarted);
    formData.append("dateEnded", dateEnded);
    formData.append("userId", userId);
    formData.append("roleId", roleId);

    try {
      const response = await fetch("/api/project/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        setAlert({ type: "success", message: `Success: ${data.message}` });
        setFile(null);
        setName("");
        setDescription("");
        setDateStarted("");
        setDateEnded("");
        setSelectedRole("");
        router.push("/projects");
      } else {
        setAlert({ type: "error", message: `Error: ${data.message}` });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error uploading file" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {alert && (
          <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
            {alert.message}
          </div>
        )}

        <div className="content">
          <div className="grid-form">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="label">Project Title</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="description" className="label">Project Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="textarea-field" rows={4} required />
            </div>

            <div className="sm:col-span-1 sm:col-start-1">
              <label htmlFor="dateStarted" className="label">Start Date</label>
              <input type="date" id="dateStarted" value={dateStarted} onChange={e => setDateStarted(e.target.value)} className="date-field" required />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="dateEnded" className="label">End Date</label>
              <input type="date" id="dateEnded" value={dateEnded} onChange={e => setDateEnded(e.target.value)} className="date-field" required />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="userRole" className="label">Project Leader</label>
              <select id="userRole" value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="select-field" required>
                <option value="">Unassigned</option>
                {roles.map((role, index) => (
                  <option key={index} value={`${role.user?.id}|${role.role?.id}`}>
                    {role.user?.username} | {role.role?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="file-upload" className="block text-sm">Upload File</label>
              <input type="file" onChange={handleFileChange} className="file-field" required />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="submit" className={`submit-button ${isLoading ? "opacity-50" : ""}`} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </form>
  );
}
