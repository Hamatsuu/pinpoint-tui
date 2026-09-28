import React, { useState } from "react";
import type { Guess, Language, Screen } from "./game/types";
import { gameClient } from "./game/gameClient";
import { translations } from "./i18n/strings";
import { MainMenu } from "./screens/MainMenu";
import { GameScreen } from "./screens/GameScreen";

export function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [language, setLanguage] = useState<Language>("es");
  const [difficulty, setDifficulty] = useState<number>(4);

  // Game state
  const [clues, setClues] = useState<string[]>([]);
  const [clueNumber, setClueNumber] = useState<number>(1);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [busyMessage, setBusyMessage] = useState<string>("");

  // Result state
  const [won, setWon] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const t = translations[language];

  const handleStartGame = async () => {
    setClues([]);
    setGuesses([]);
    setClueNumber(1);
    setIsBusy(true);
    setBusyMessage(t.generatingGame);
    setWon(false);
    setAnswer("");
    setGameOver(false);
    setScreen("game");

    try {
      const res = await gameClient.newGame(language, difficulty);
      setClues(res.clues);
      setIsBusy(false);
    } catch (err) {
      console.error("Failed to start game:", err);
      setIsBusy(false);
      setScreen("menu");
    }
  };

  const handleSubmitGuess = async (guessText: string) => {
    if (isBusy) return;
    setIsBusy(true);
    setBusyMessage(t.checkingGuess);

    try {
      const res = await gameClient.submitGuess(guessText);

      if (res.type === "guess_result") {
        setGuesses((prev) => [...prev, { text: guessText, correct: false }]);
        setClueNumber((prev) => prev + 1);
        setIsBusy(false);
      } else if (res.type === "game_finished") {
        setGuesses((prev) => [...prev, { text: guessText, correct: res.result === "won" }]);
        setWon(res.result === "won");
        setAnswer(res.answer);
        setGameOver(true);
        // Reveal all clues on win
        if (res.result === "won") {
          setClueNumber(5);
        }
        setIsBusy(false);
      }
    } catch (err) {
      console.error("Failed to submit guess:", err);
      setIsBusy(false);
    }
  };

  const handleQuit = () => {
    gameClient.close();
    process.exit(0);
  };

  if (screen === "menu") {
    return (
      <MainMenu
        language={language}
        onLanguageChange={setLanguage}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onStartGame={handleStartGame}
        onQuit={handleQuit}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        language={language}
        clues={clues}
        clueNumber={clueNumber}
        guesses={guesses}
        isBusy={isBusy}
        busyMessage={busyMessage}
        onSubmitGuess={handleSubmitGuess}
        onBackToMenu={() => setScreen("menu")}
        onPlayAgain={handleStartGame}
        won={won}
        answer={answer}
        gameOver={gameOver}
      />
    );
  }

  return (
    <box>
      <text fg="#64748b">Loading...</text>
    </box>
  );
}
