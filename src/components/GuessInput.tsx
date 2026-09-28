import React from "react";

interface GuessInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  placeholder: string;
  counterText: string;
  disabled?: boolean;
  loadingMessage?: string;
}

export function GuessInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  counterText,
  disabled = false,
  loadingMessage,
}: GuessInputProps) {
  return (
    <box
      border={true}
      borderStyle="rounded"
      borderColor={disabled ? "#475569" : "#3b82f6"}
      style={{
        width: 54,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 1,
        paddingRight: 1,
        gap: 1,
      }}
    >
      <text fg="#38bdf8">
        <b>{">"}</b>
      </text>

      {disabled ? (
        <text fg="#60a5fa">
          <i>{loadingMessage || "..."}</i>
        </text>
      ) : (
        <input
          focused={true}
          value={value}
          onInput={(val: string) => onChange(val)}
          onChange={(val: string) => onChange(val)}
          onSubmit={() => onSubmit(value)}
          placeholder={placeholder}
          style={{
            flexGrow: 1,
          }}
        />
      )}

      <text fg="#94a3b8">
        <b>{`[ ${counterText} ]`}</b>
      </text>
    </box>
  );
}
