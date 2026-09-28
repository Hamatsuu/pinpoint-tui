import React, { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { createTextAttributes } from "@opentui/core";
import type { Guess, Language } from "../game/types";
import { translations } from "../i18n/strings";
import { GuessInput } from "../components/GuessInput";

interface GameScreenProps {
  language: Language;
  clues: string[];
  clueNumber: number;
  guesses: Guess[];
  isBusy: boolean;
  busyMessage?: string;
  onSubmitGuess: (guess: string) => void;
  onBackToMenu: () => void;
  won: boolean;
  answer: string;
  gameOver: boolean;
}

export function GameScreen({
  language,
  clues,
  clueNumber,
  guesses,
  isBusy,
  busyMessage,
  onSubmitGuess,
  onBackToMenu,
  won,
  answer,
  gameOver,
}: GameScreenProps) {
  const [inputValue, setInputValue] = useState("");
  const t = translations[language];
  const hasLost = gameOver && !won;

  useKeyboard((key) => {
    if (key.name === "escape") {
      onBackToMenu();
    }
  });

  const handleSubmit = (val: string) => {
    const trimmed = (val || inputValue).trim();
    if (!trimmed || isBusy) return;
    setInputValue("");
    onSubmitGuess(trimmed);
  };

  return (
    <box
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        paddingTop: 1,
      }}
    >
      <box
        style={{
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
          paddingBottom: 1,
          gap: 1,
          width: 60,
        }}
      >
        <box
          style={{
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          {[...Array(gameOver ? 6 : 5)].map((_, index) => {
            if (gameOver && index === 5) {
              // 6th cell - the answer
              return (
                <box
                  key={5}
                  border={true}
                  borderStyle="rounded"
                  borderColor={won ? "#22c55e" : "#ef4444"}
                  style={{
                    width: 50,
                    paddingLeft: 1,
                    paddingRight: 1,
                    backgroundColor: "#0f172a",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <text fg={won ? "#22c55e" : "#fbbf24"}>
                    <b>{answer.toUpperCase()}</b>
                  </text>
                </box>
              );
            }
            const revealed = index < clueNumber && index < clues.length;
            const clueText = revealed ? clues[index].toUpperCase() : "• • • • •";
            const isLatest = index === clueNumber - 1 && revealed;
            
            let textColor = "#334155";
            if (revealed) {
              if (isLatest) {
                textColor = "#38bdf8";
              } else {
                textColor = "#e2e8f0";
              }
            }
            
            let borderColor = "#475569";
            if (revealed) {
              if (isLatest) {
                borderColor = "#38bdf8";
              } else {
                borderColor = "#64748b";
              }
            }
            
            const bgColor = revealed ? "#0f172a" : undefined;
            
            return (
              <box
                key={index}
                border={true}
                borderStyle="rounded"
                borderColor={borderColor}
                style={{
                  width: 50,
                  paddingLeft: 1,
                  paddingRight: 1,
                  backgroundColor: bgColor,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <text fg={textColor}>
                  {revealed ? <b>{clueText}</b> : clueText}
                </text>
              </box>
            );
          })}
        </box>

        <text fg="#1e3a8a">
          {"──────────────────────────────────────────────"}
        </text>

        {guesses.length > 0 && (
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
                {g.correct ? "✓ " : ""}{g.text}
              </text>
            ))}
          </box>
        )}

        <text fg="#1e3a8a">
          {"──────────────────────────────────────────────"}
        </text>

        {gameOver ? (
          <>
            <box
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: 1,
                marginTop: 1,
              }}
            >
              <text fg={won ? "#22c55e" : "#ef4444"}>
                <b>{won ? t.wonTitle : t.lostTitle}</b>
              </text>
              <text fg="#94a3b8">
                {won ? t.wonSubtitle(guesses.length) : t.lostSubtitle}
              </text>
            </box>
            <text fg="#475569">{t.gameNavHelp}</text>
          </>
        ) : (
          <>
            <GuessInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder={t.guessPlaceholder}
              counterText={`${clueNumber}/5`}
              disabled={isBusy}
              loadingMessage={busyMessage || t.checkingGuess}
            />
            <text fg="#475569">{t.gameNavHelp}</text>
          </>
        )}
      </box>
    </box>
  );
}
