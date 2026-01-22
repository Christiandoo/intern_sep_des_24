"use client";

import { useSearchParams } from "next/navigation";
import PageLayout from "../components/pagelayout/PageLayout";
import UpdateForm from "../components/project/editProject";

export const ProjectEdit = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("projectId") ?? "";

  return (
    <PageLayout cardTitle="Edit Project">
      <div>
        <UpdateForm projectId={projectId} />
      </div>
    </PageLayout>
  );
};
