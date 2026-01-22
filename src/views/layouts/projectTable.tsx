"use client";

import PageLayout from "../components/pagelayout/PageLayout";
import ViewProject from "../components/project/viewProject";

export const ProjectTable = () => {
  return (
    <PageLayout cardTitle="Projects">
      <div>
        <ViewProject />
      </div>
    </PageLayout>
  );
};
