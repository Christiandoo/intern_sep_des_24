"use client";
import React from "react";
import "./styles.css";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="container-card">
      {title && (
        <h2 className="title">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
