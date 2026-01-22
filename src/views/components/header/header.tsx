"use client";
import { IconBell } from "@tabler/icons-react";
import "./style.css";
export default function Header() {
  return (
    <header className="header">
      <div className="flex items-center space-x-3">
        {" "}
        <button className="header-logo">
          <IconBell size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="header-icon"></div>
      </div>
    </header>
  );
}
