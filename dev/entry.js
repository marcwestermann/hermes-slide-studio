import React from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "../desktop/plugin.js";
const api = async (path, options = {}) => {
  const response = await fetch("/api" + path, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const value = await response.json();
  if (!response.ok) throw Error(value.detail || "Request failed");
  return value;
};
createRoot(document.getElementById("root")).render(
  React.createElement(Studio, { api }),
);
