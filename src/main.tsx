import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import React from "react";
import { App } from "./App";

async function main() {
  const renderer = await createCliRenderer();
  const root = createRoot(renderer);

  const cleanup = () => {
    try {
      root.unmount();
      renderer.destroy();
    } catch {
      // Ignore errors on destroy
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });

  root.render(<App />);
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
