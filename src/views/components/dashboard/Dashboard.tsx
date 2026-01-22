"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import "./style.css";
import Card from "../card/card";
import RoleComponent from "./Role";
import TotalProjects from "./Project";
import TotalAssignments from "./Assignment";
import TodoList from "./todo";


export default function DashboardLayout() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // useEffect(()=> {
  //     setTimeout(()=> {
  //       return <Loading />
  //     }, 3000);
  // })

  if (session) {
    return (
      <div className="dashboard-container font-extrabold">
        <div className="dashboard-wrapper flex flex-col flex-1 mr-2 mt-2">
          <div className="ml-2">
            <Sidebar />
          </div>
          <div className="sm:ml-40 md:ml-60 lg:ml-72 min-h-full">
            <div>
              <Header />
            </div>
            <div className="p-6 h-full">
              <div className="flex gap-6 mb-6 items-stretch">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 min-h-full">
                  <Card dashboard-title="Role">
                    <div>
                      <RoleComponent></RoleComponent>
                    </div>
                  </Card>
                  <Card dashboard-title="project">
                    <div>
                      <TotalProjects />
                    </div>
                  </Card>
                  <Card dashboard-title="project">
                    <div>
                      <TotalAssignments />
                    </div>
                  </Card>
                </div>
              </div>
              <div className="mt-6">
                <div className="max-w-screen-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
                    <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto md:h-full flex flex-col">
                      <Card dashboard-title="56 Course Completed">
                        <div className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-4 flex-grow">
                        <div>
                            <TodoList />
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="col-span-2 sm:col-span-1 md:col-span-2">
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                        <Card dashboard-title="Today's Activity">
                         a
                        </Card>
                        <Card dashboard-title="Recent Achievements">b</Card>
                      </div>
                    </div>
                  </div>
                </div>
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
}
