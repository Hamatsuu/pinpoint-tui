import React, { useState } from "react";
import { useKeyboard } from "@opentui/react";
import type { Language } from "../game/types";
import { translations } from "../i18n/strings";
import { DifficultySlider } from "../components/DifficultySlider";

interface MainMenuProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  difficulty: number;
  onDifficultyChange: (diff: number) => void;
  onStartGame: () => void;
  onQuit: () => void;
}

export function MainMenu({
  language,
  onLanguageChange,
  difficulty,
  onDifficultyChange,
  onStartGame,
  onQuit,
}: MainMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // Default on New Game
  const t = translations[language];

  useKeyboard((key) => {
    if (key.name === "up") {
      setSelectedIndex((prev) => (prev - 1 + 4) % 4);
    } else if (key.name === "down") {
      setSelectedIndex((prev) => (prev + 1) % 4);
    } else if (key.name === "left") {
      if (selectedIndex === 0) {
        onLanguageChange(language === "es" ? "en" : "es");
      } else if (selectedIndex === 1) {
        onDifficultyChange(Math.max(1, difficulty - 1));
      }
    } else if (key.name === "right") {
      if (selectedIndex === 0) {
        onLanguageChange(language === "es" ? "en" : "es");
      } else if (selectedIndex === 1) {
        onDifficultyChange(Math.min(5, difficulty + 1));
      }
    } else if (key.name === "return" || key.name === "enter") {
      if (selectedIndex === 0) {
        onLanguageChange(language === "es" ? "en" : "es");
      } else if (selectedIndex === 2) {
        onStartGame();
      } else if (selectedIndex === 3) {
        onQuit();
      }
    } else if (key.name === "escape" || key.name === "esc") {
      onQuit();
    } else if (key.name === "q" || (key.ctrl && key.name === "c")) {
      onQuit();
    }
  });

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
      {/* Outer Card */}
      <box
        border={true}
        borderStyle="rounded"
        borderColor="#2563eb"
        style={{
          width: 58,
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
          paddingBottom: 1,
          gap: 1,
        }}
      >
        {/* Title & Subtitle */}
        <box style={{ flexDirection: "column", alignItems: "center" }}>
          <text fg="#38bdf8">
            <b>{`◆  ${t.title}  ◆`}</b>
          </text>
          <text fg="#64748b">
            <i>{t.subtitle}</i>
          </text>
        </box>

        {/* Separator */}
        <text fg="#1e3a8a">
          {"──────────────────────────────────────────────"}
        </text>

        {/* Option 0: Language */}
        <box
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 46,
            paddingLeft: 1,
            paddingRight: 1,
            backgroundColor: selectedIndex === 0 ? "#1e293b" : undefined,
          }}
        >
          <text fg={selectedIndex === 0 ? "#38bdf8" : "#94a3b8"}>
            {selectedIndex === 0 ? <b>► {t.languageLabel}:</b> : `  ${t.languageLabel}:`}
          </text>
          <text fg={selectedIndex === 0 ? "#38bdf8" : "#cbd5e1"}>
            <b>{language === "es" ? "[ ES ]  EN  " : "  ES  [ EN ]"}</b>
          </text>
        </box>

        {/* Option 1: Difficulty */}
        <box
          style={{
            flexDirection: "column",
            alignItems: "center",
            width: 46,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: selectedIndex === 1 ? "#1e293b" : undefined,
          }}
        >
          <box
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <text fg={selectedIndex === 1 ? "#38bdf8" : "#94a3b8"}>
              {selectedIndex === 1 ? <b>► {t.difficultyLabel}:</b> : `  ${t.difficultyLabel}:`}
            </text>
            <DifficultySlider
              value={difficulty}
              focused={selectedIndex === 1}
            />
          </box>
        </box>

        {/* Separator */}
        <text fg="#1e3a8a">
          {"──────────────────────────────────────────────"}
        </text>

        {/* Option 2: New Game */}
        <box
          border={true}
          borderStyle={selectedIndex === 2 ? "rounded" : "single"}
          borderColor={selectedIndex === 2 ? "#38bdf8" : "#334155"}
          style={{
            width: 32,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selectedIndex === 2 ? "#1d4ed8" : "#0f172a",
          }}
        >
          <text fg={selectedIndex === 2 ? "#ffffff" : "#94a3b8"}>
            <b>{selectedIndex === 2 ? `►  ${t.newGameBtn}  ◄` : t.newGameBtn}</b>
          </text>
        </box>

        {/* Option 3: Quit */}
        <box
          border={true}
          borderStyle={selectedIndex === 3 ? "rounded" : "single"}
          borderColor={selectedIndex === 3 ? "#ef4444" : "#334155"}
          style={{
            width: 32,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selectedIndex === 3 ? "#7f1d1d" : "#0f172a",
          }}
        >
          <text fg={selectedIndex === 3 ? "#ffffff" : "#64748b"}>
            <b>{selectedIndex === 3 ? `►  ${t.quitBtn}  ◄` : t.quitBtn}</b>
          </text>
        </box>

        {/* Navigation Help */}
        <text fg="#475569">
          {t.menuNavHelp}
        </text>
      </box>
    </box>
  );
}
