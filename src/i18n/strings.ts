import type { Language } from "../game/types";

export interface I18nStrings {
  title: string;
  subtitle: string;
  languageLabel: string;
  difficultyLabel: string;
  newGameBtn: string;
  quitBtn: string;
  menuNavHelp: string;

  guessPlaceholder: string;
  clueCounter: (curr: number, max: number) => string;
  generatingGame: string;
  checkingGuess: string;
  gameNavHelp: string;
  gameOverNavHelp: string;

  wonTitle: string;
  wonSubtitle: (clues: number) => string;
  lostTitle: string;
  lostSubtitle: string;
  answerLabel: string;
  newGameBtn2: string;
  mainMenuBtn: string;
}

export const translations: Record<Language, I18nStrings> = {
  es: {
    title: "P I N P O I N T",
    subtitle: "Adivina la categoría oculta a través de sus pistas",
    languageLabel: "Idioma",
    difficultyLabel: "Dificultad",
    newGameBtn: "NUEVA PARTIDA",
    quitBtn: "SALIR",
    menuNavHelp: "↑/↓ Navegar  •  ←/→ Cambiar  •  Enter Seleccionar  •  q Salir",

    guessPlaceholder: "Escribe tu respuesta aquí...",
    clueCounter: (curr, max) => `Pista ${curr}/${max}`,
    generatingGame: "Generando partida con WordNet...",
    checkingGuess: "Analizando respuesta...",
    gameNavHelp: "Enter: Enviar respuesta  •  Esc: Salir al Menú",
    gameOverNavHelp: "Enter: Jugar otra  •  Esc: Salir al Menú",

    wonTitle: "¡CORRECTO!",
    wonSubtitle: (clues) =>
      `¡Adivinaste la categoría en ${clues} pista${clues > 1 ? "s" : ""}!`,
    lostTitle: "FIN DEL JUEGO",
    lostSubtitle: "Se han agotado las 5 pistas.",
    answerLabel: "La categoría era:",
    newGameBtn2: "NUEVA PARTIDA",
    mainMenuBtn: "MENÚ PRINCIPAL",
  },
  en: {
    title: "P I N P O I N T",
    subtitle: "Deduce the hidden category from semantic clues",
    languageLabel: "Language",
    difficultyLabel: "Difficulty",
    newGameBtn: "NEW GAME",
    quitBtn: "QUIT",
    menuNavHelp: "↑/↓ Navigate  •  ←/→ Adjust  •  Enter Select  •  q Quit",

    guessPlaceholder: "Type your guess here...",
    clueCounter: (curr, max) => `Clue ${curr}/${max}`,
    generatingGame: "Generating game from WordNet...",
    checkingGuess: "Evaluating guess...",
    gameNavHelp: "Enter: Submit Guess  •  Esc: Return to Menu",
    gameOverNavHelp: "Enter: Play Again  •  Esc: Return to Menu",

    wonTitle: "CORRECT!",
    wonSubtitle: (clues) =>
      `Solved the category in ${clues} clue${clues > 1 ? "s" : ""}!`,
    lostTitle: "GAME OVER",
    lostSubtitle: "All 5 clues have been used.",
    answerLabel: "The category was:",
    newGameBtn2: "NEW GAME",
    mainMenuBtn: "MAIN MENU",
  },
};
