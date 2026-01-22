import { useEffect, useState } from "react";
import "./style.css";
interface AssignmentFormProps {
  projectId: string;
  onSuccess: () => void;
}

interface User {
  id: string;
  username: string;
}

export default function AssignmentForm({
  projectId,
  onSuccess,
}: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/assignment/getUser");
        const result = await response.json();

        if (response.ok) {
          setUsers(result.data);
          setTitle("");
          setUserId("");
        } else {
          console.error("Error fetching users:", result.message);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchUsers();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !userId) {
      setAlert({ type: "error", message: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("userId", userId);
      formData.append("projectId", projectId);

      const response = await fetch("/api/assignment/create", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({ type: "success", message: result.message });
        onSuccess();
      } else {
        setAlert({ type: "error", message: result.message });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to assign project" });
      console.error("Assignment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert && (
        <div
          className={`alert ${
            alert.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {alert.message}
        </div>
      )}
      <div className="assignment-content">
        <div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Type Title"
            required
          />
        </div>

        <div className="sm:col-span-4">
          <select
            id="user"
            value={userId}
            onChange={(e) => {
              console.log("Selected User ID:", e.target.value); 
              setUserId(e.target.value);
            }}
            className="subtitle"
            required
          >
            <option value="">Select User</option>
            {users.map((user, index) => (
              <option key={index} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className={`submit-button ${isLoading ? "disable-button" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
