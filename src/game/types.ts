export type Language = "es" | "en";

export type Screen = "menu" | "game";

export interface Guess {
  text: string;
  correct: boolean;
}

export interface NewGameAction {
  action: "new_game";
  language: Language;
  difficulty: number;
}

export interface GuessAction {
  action: "guess";
  value: string;
}

export type ClientAction = NewGameAction | GuessAction;

export interface ReadyEvent {
  type: "ready";
}

export interface GameStartedEvent {
  type: "game_started";
  clues: string[];
}

export interface GuessResultEvent {
  type: "guess_result";
  correct: false;
}

export interface GameFinishedEvent {
  type: "game_finished";
  result: "won" | "lost";
  answer: string;
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export type BackendEvent =
  | ReadyEvent
  | GameStartedEvent
  | GuessResultEvent
  | GameFinishedEvent
  | ErrorEvent;
