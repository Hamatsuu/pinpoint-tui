import React from "react";

interface DifficultySliderProps {
  value: number;
  focused?: boolean;
}

export function DifficultySlider({
  value,
  focused = false,
}: DifficultySliderProps) {
  const steps = [1, 2, 3, 4, 5];

  const renderTrack = () => {
    return steps.map((s, idx) => {
      const isCurrent = s === value;
      const markerColor = isCurrent ? (focused ? "#38bdf8" : "#60a5fa") : "#475569";
      return (
        <span key={s} fg={markerColor}>
          {isCurrent ? <b>●</b> : "─"}
          {idx < steps.length - 1 ? "──" : ""}
        </span>
      );
    });
  };

  return (
    <box
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <box
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <text fg={value === 1 ? "#38bdf8" : "#64748b"}>
          {value === 1 ? <b>1</b> : "1"}
        </text>
        <text fg="#475569"> </text>
        <text>{renderTrack()}</text>
        <text fg="#475569"> </text>
        <text fg={value === 5 ? "#38bdf8" : "#64748b"}>
          {value === 5 ? <b>5</b> : "5"}
        </text>
        <text fg={focused ? "#38bdf8" : "#94a3b8"}>
          <b>{` [ ${value} ]`}</b>
        </text>
      </box>
      <box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 50,
          marginTop: 0,
        }}
      >
        <text fg="#64748b" style={{ width: 25, textAlign: "center" }}>
          <i>Difícil</i>
        </text>
        <text fg="#64748b" style={{ width: 25, textAlign: "center" }}>
          <i>Fácil</i>
        </text>
      </box>
    </box>
  );
}
