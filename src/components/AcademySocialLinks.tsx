import React from "react";
import { FiFacebook, FiInstagram } from "react-icons/fi";

export default function AcademySocialLinks() {
  return (
    <div className="flex gap-4 text-gray-50">
      <a
        href="https://www.facebook.com/wallsandgatesdigitalskillsagency/"
        aria-label="Facebook"
        className="bg-chambray-800 rounded-full p-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FiFacebook className="size-4" />
      </a>
      <a
        href="https://www.instagram.com/wallsandgatesacademy/"
        aria-label="Instagram"
        className="bg-chambray-800 rounded-full p-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FiInstagram className="size-4" />
      </a>
    </div>
  );
} 