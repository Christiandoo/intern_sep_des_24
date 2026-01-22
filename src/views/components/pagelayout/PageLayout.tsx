"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, ReactNode } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import "./style.css";
import Card from "../card/card";

interface PageLayoutProps {
  cardTitle: string;
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ cardTitle, children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper flex flex-col flex-1 mr-2 mt-2">
          <div className="ml-2">
            <Sidebar />
          </div>
          <div className="sm:ml-40 md:ml-60 lg:ml-72">
            <div>
              <Header />
            </div>
            <div className="content-area">
              <div className="col-span-3 h-full">
                <Card title={cardTitle}>{children}</Card>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="dashboard-top">
          <div className="dashboard-bg" />
        </div>
        <div aria-hidden="true" className="dashboard-bottom">
          <div className="dashboard-bottom-bg" />
        </div>
      </div>
    );
  }
  return null;
};

export default PageLayout;
