import { match } from "ts-pattern";

type TokenType =
  | "INSTRUCTION"
  | "PLUS"
  | "MINUS"
  | "COMMA"
  | "LPAREN"
  | "RPAREN"
  | "ARGUMENT"
  | "EOF";

type Token = {
  lexeme: string;
  type: TokenType;
};

const TOKENS: Record<string, TokenType> = {
  ld: "INSTRUCTION",
  ldh: "INSTRUCTION",
  push: "INSTRUCTION",
  pop: "INSTRUCTION",

  add: "INSTRUCTION",
  adc: "INSTRUCTION",
  sub: "INSTRUCTION",
  sbc: "INSTRUCTION",
  cp: "INSTRUCTION",
  and: "INSTRUCTION",
  or: "INSTRUCTION",
  xor: "INSTRUCTION",
  inc: "INSTRUCTION",
  dec: "INSTRUCTION",

  swap: "INSTRUCTION",
  daa: "INSTRUCTION",
  cpl: "INSTRUCTION",
  ccf: "INSTRUCTION",
  scf: "INSTRUCTION",
  nop: "INSTRUCTION",
  halt: "INSTRUCTION",
  stop: "INSTRUCTION",
  di: "INSTRUCTION",
  ei: "INSTRUCTION",
  rlca: "INSTRUCTION",
  rla: "INSTRUCTION",
  rrca: "INSTRUCTION",
  rra: "INSTRUCTION",
  rlc: "INSTRUCTION",
  rl: "INSTRUCTION",
  rrc: "INSTRUCTION",
  rr: "INSTRUCTION",
  sla: "INSTRUCTION",
  sra: "INSTRUCTION",
  srl: "INSTRUCTION",
  bit: "INSTRUCTION",
  set: "INSTRUCTION",
  res: "INSTRUCTION",
  jp: "INSTRUCTION",
  jr: "INSTRUCTION",
  call: "INSTRUCTION",
  rst: "INSTRUCTION",
  ret: "INSTRUCTION",
  reti: "INSTRUCTION",

  "+": "PLUS",
  "-": "MINUS",
  ",": "COMMA",
  "(": "LPAREN",
  ")": "RPAREN",
};

export type MemoryType = "Register" | "Address";

export class Tokenizer {
  private statement = "";
  private position: number = 0;
  constructor() {}

  private readIdentifierOrKeyword() {
    let identifier = this.statement[this.position - 1];
    while (
      this.isChar(this.statement[this.position]) ||
      this.isDigit(this.statement[this.position])
    ) {
      identifier += this.readChar();
    }
    return identifier;
  }

  private eatWhitespace(statement: string) {
    for (let i = this.position; i < statement.length; i++) {
      if (statement[i] !== " ") {
        this.position = i;
        return;
      }
    }
    this.position = statement.length;
  }

  private readChar() {
    const char = this.statement[this.position];
    this.position += 1;
    return char;
  }

  private isChar(char: string) {
    if (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    ) {
      return true;
    }
  }

  private isDigit(char: string) {
    if (char >= "0" && char <= "9") {
      return true;
    }
  }

  private nextToken() {
    this.eatWhitespace(this.statement);
    const char = this.readChar();
    const token = match(char)
      .with("(", () => {
        return {
          lexeme: "(",
          type: "LPAREN" as const,
        };
      })
      .with(")", () => {
        return {
          lexeme: ")",
          type: "RPAREN" as const,
        };
      })
      .with(",", () => {
        return {
          lexeme: ",",
          type: "COMMA" as const,
        };
      })
      .with("+", () => {
        return {
          lexeme: "+",
          type: "PLUS" as const,
        };
      })
      .with("-", () => {
        return {
          lexeme: "-",
          type: "MINUS" as const,
        };
      })
      .otherwise(() => {
        if (this.isChar(char) || this.isDigit(char)) {
          const identifierOrKeyword = this.readIdentifierOrKeyword();
          return {
            lexeme: identifierOrKeyword,
            type: TOKENS[identifierOrKeyword] || "ARGUMENT",
          };
        }
        return {
          lexeme: "",
          type: "EOF" as const,
        };
      });
    return token;
  }

  tokenize(statement: string): Token[] {
    this.statement = statement;
    this.position = 0;

    let tokens: Token[] = [];
    let token = this.nextToken();
    while (token.type !== "EOF") {
      tokens.push(token);
      token = this.nextToken();
    }

    return tokens;
  }
}
