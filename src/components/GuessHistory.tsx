import React from "react";
import { createTextAttributes } from "@opentui/core";
import type { Guess } from "../game/types";

interface GuessHistoryProps {
  guesses: Guess[];
  title: string;
}

export function GuessHistory({ guesses, title }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <box
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        marginTop: 1,
      }}
    >
      {guesses.map((g, idx) => (
        <text
          key={idx}
          fg={g.correct ? "#38bdf8" : "#fca5a5"}
          attributes={createTextAttributes({ strikethrough: !g.correct })}
        >
          {g.correct ? "✓" : "✗"} {g.text}
        </text>
      ))}
    </box>
  );
}
