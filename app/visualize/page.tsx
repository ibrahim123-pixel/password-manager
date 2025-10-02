"use client";
import { useEffect } from "react";

export default function VisualizePage() {
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const rootVars = Array.from(styles)
      .filter((v) => v.startsWith("--"))
      .map((v) => ({
        name: v,
        value: styles.getPropertyValue(v),
      }));

    const grid = document.getElementById("colors");
    if (grid) {
      rootVars.forEach((v) => {
        const div = document.createElement("div");
        div.className = "color";
        div.style.background = `var(${v.name})`;
        div.innerHTML = `<div class="color-name">${v.name}</div>
                         <div class="color-value">${v.value}</div>`;
        grid.appendChild(div);
      });
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <button
        className="light-toggle"
        onClick={() => document.body.classList.toggle("dark")}
      >
        Toggle Dark Mode
      </button>
      <div className="grid" id="colors"></div>
    </div>
  );
}
