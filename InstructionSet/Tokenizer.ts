import { match } from "ts-pattern";
import { TOKENS, Token } from "./Token";

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
        return new Token("(", "LPAREN");
      })
      .with(")", () => {
        return new Token(")", "RPAREN");
      })
      .with(",", () => {
        return new Token(",", "COMMA");
      })
      .with("+", () => {
        return new Token("+", "PLUS");
      })
      .with("-", () => {
        return new Token("-", "MINUS");
      })
      .otherwise(() => {
        if (this.isChar(char) || this.isDigit(char)) {
          const identifierOrKeyword = this.readIdentifierOrKeyword();
          return new Token(
            identifierOrKeyword.toLowerCase(),
            TOKENS[identifierOrKeyword] || "ARGUMENT"
          );
        }
        return new Token("", "EOF");
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
    tokens.push(token);

    return tokens;
  }
}
