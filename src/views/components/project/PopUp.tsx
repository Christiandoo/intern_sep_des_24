import React from "react";
import "./style.css";

interface PopupProps {
  title: string;
  content: string | React.ReactNode;
  onClose: () => void;
}
const Popup: React.FC<PopupProps> = ({ title, content, onClose }) => {
  return (
    <div className="pop-up">
      <div className="pop-up-container">
        <div className="pop-up-content">
          <h2 className="title">{title}</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
        <div className="content-text">
          {content}
        </div>
      </div>
    </div>
  );
};


export default Popup;
