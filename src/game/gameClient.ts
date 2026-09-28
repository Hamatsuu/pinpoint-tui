import type { Subprocess } from "bun";
import type {
  BackendEvent,
  ClientAction,
  GameFinishedEvent,
  GameStartedEvent,
  GuessResultEvent,
  Language,
} from "./types";
import { resolve } from "path";

type ResponseResolver = (event: BackendEvent) => void;

export class GameClient {
  private proc: Subprocess<"pipe", "pipe", "pipe"> | null = null;
  private pendingResolvers: ResponseResolver[] = [];
  private isReady = false;
  private readyPromise: Promise<void>;
  private resolveReady!: () => void;
  private lineBuffer = "";

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
  }

  public async start(): Promise<void> {
    if (this.proc) return;

    const pythonPath = process.env.PYTHON_PATH || "python3";
    const enginePath = resolve(
      import.meta.dir,
      "../../backend/game_engine.py"
    );

    this.proc = Bun.spawn([pythonPath, enginePath], {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    }) as Subprocess<"pipe", "pipe", "pipe">;

    this.readStdout();
    this.readStderr();

    // Register cleanup hooks
    const cleanup = () => this.close();
    process.on("exit", cleanup);
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    await this.readyPromise;
  }

  private async readStdout() {
    if (!this.proc || !this.proc.stdout) return;
    const reader = (this.proc.stdout as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        this.lineBuffer += decoder.decode(value, { stream: true });
        const lines = this.lineBuffer.split("\n");
        // Keep the last incomplete fragment in the buffer
        this.lineBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed) as BackendEvent;
            this.handleEvent(event);
          } catch (e) {
            console.error("Failed to parse backend JSON line:", trimmed, e);
          }
        }
      }
    } catch {
      // Stream closed
    }
  }

  private async readStderr() {
    if (!this.proc || !this.proc.stderr) return;
    const reader = (this.proc.stderr as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (process.env.DEBUG) {
          console.error("[Python stderr]:", text);
        }
      }
    } catch {
      // Stderr closed
    }
  }

  private handleEvent(event: BackendEvent) {
    if (event.type === "ready") {
      this.isReady = true;
      this.resolveReady();
      return;
    }

    const resolver = this.pendingResolvers.shift();
    if (resolver) {
      resolver(event);
    }
  }

  private send(action: ClientAction): Promise<BackendEvent> {
    if (!this.proc || !this.proc.stdin) {
      return Promise.reject(new Error("Game backend process is not running"));
    }

    return new Promise((resolve) => {
      this.pendingResolvers.push(resolve);
      const jsonLine = JSON.stringify(action) + "\n";
      const writer = this.proc!.stdin as any;
      writer.write(jsonLine);
      writer.flush();
    });
  }

  public async newGame(
    language: Language,
    difficulty: number
  ): Promise<GameStartedEvent> {
    await this.start();
    const res = await this.send({
      action: "new_game",
      language,
      difficulty,
    });
    if (res.type === "game_started") {
      return res;
    }
    throw new Error(
      res.type === "error" ? res.message : `Unexpected event: ${res.type}`
    );
  }

  public async submitGuess(
    value: string
  ): Promise<GuessResultEvent | GameFinishedEvent> {
    await this.start();
    const res = await this.send({
      action: "guess",
      value,
    });
    if (res.type === "guess_result" || res.type === "game_finished") {
      return res;
    }
    throw new Error(
      res.type === "error" ? res.message : `Unexpected event: ${res.type}`
    );
  }

  public close() {
    if (this.proc) {
      try {
        this.proc.kill();
      } catch {
        // already exited
      }
      this.proc = null;
    }
  }
}

export const gameClient = new GameClient();
