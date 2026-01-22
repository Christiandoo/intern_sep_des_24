"use client";

import PageLayout from "../components/pagelayout/PageLayout";
import UploadForm from "../components/project/addProject";

export const Project = () => {
  return (
    <PageLayout cardTitle="Add Project">
      <div>
        <UploadForm />
      </div>
    </PageLayout>
  );
};
