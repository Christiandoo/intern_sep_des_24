"use client";

import {
  IconCategory,
  IconBrandTailwind,
  IconLogout,
  IconPencilCheck,
  IconFolderPlus,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import "./style.css";

export default function Sidebar() {
  return (
    <div className="sidebarContainer">
      <div className="sidebar-header">
        <div className="brandContainer">
          <IconBrandTailwind
            size={32}
            stroke={1.5}
            color="#9089fc"
            fill="#9089fc"
          />
          <a href="/" className="brandName">
            TaskApp
          </a>
        </div>
      </div>

      <nav className="nav">
        <div className="section">
          <h4 className="sectionTitle">HOME</h4>
          <a href="/dashboard" className="navLink">
            <IconCategory size={24} stroke={1.5} />
            <span>Dashboard</span>
          </a>
        </div>

        <div className="section">
          <h4 className="sectionTitle">ADMIN</h4>
          <a href="/projects" className="navLink">
            <IconFolderPlus size={24} stroke={1.5} />
            <span>Project</span>
          </a>
          <a href="/dashboard/admin" className="navLink">
            <IconPencilCheck size={24} stroke={1.5} />
            <span>Role</span>
          </a>
        </div>

        <div className="section">
          <h4 className="sectionTitle">AUTH</h4>
          <button
            onClick={() => signOut()}
            className="navLink w-full"
          >
            <IconLogout size={24} stroke={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
