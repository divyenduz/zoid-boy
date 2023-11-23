import { INSTRUCTION_TYPE, InstructionType } from "./Parser";

type TokenType = "Instruction" | "LeftArgument" | "RightArgument";

type Token = {
  lexeme: string;
  type: TokenType;
  addressType?: ArgumentType;
};

const ARGUMENT_TYPE_MAP: Record<string, ArgumentType> = {
  A: "Register",
  F: "Register",
  B: "Register",
  C: "Register",
  D: "Register",
  E: "Register",
  H: "Register",
  L: "Register",

  BC: "Register",
  DE: "Register",
  HL: "Register",

  SP: "Register",
  PC: "Register",

  d8: "DirectAddress",
  d16: "DirectAddress",
};
export type ArgumentType =
  | "Register"
  | "RegisterAddress"
  | "DirectAddress"
  | "IndirectAddress";

export class Tokenizer {
  private position: number = 0;
  constructor() {}

  private extractOp(statement: string) {
    for (let i = 0; i < statement.length; i++) {
      if (statement[i] === " ") {
        this.position = i + 1;
        return statement.slice(0, i).trim();
      }
    }
    this.position = statement.length;
    return statement.slice(0, statement.length).trim();
  }

  private extractArg(statement: string) {
    let arg = "";
    for (let i = this.position; i < statement.length; i++) {
      if (statement[i] === ",") {
        this.position = i + 1;
        arg = arg.trim();

        if (arg.length === 0) {
          return null;
        }

        if (arg.startsWith("(") && arg.endsWith(")")) {
          arg = arg.slice(1, arg.length - 1);
          return {
            type:
              ARGUMENT_TYPE_MAP[arg] === "Register"
                ? "RegisterAddress"
                : ("IndirectAddress" as ArgumentType),
            value: arg,
          };
        }

        return {
          type: ARGUMENT_TYPE_MAP[arg],
          value: arg,
        };
      }
      arg += statement[i];
    }
    this.position = statement.length;
    arg = arg.trim();

    if (arg.length === 0) {
      return null;
    }

    if (arg.startsWith("(") && arg.endsWith(")")) {
      return {
        type: (ARGUMENT_TYPE_MAP[arg] === "Register"
          ? "RegisterAddress"
          : ("IndirectAddress" as ArgumentType)) as ArgumentType,
        value: arg.slice(1, arg.length - 1),
      };
    }

    return {
      type: ARGUMENT_TYPE_MAP[arg],
      value: arg,
    };
  }

  tokenize(statement: string): Token[] {
    this.position = 0;

    let tokens: Token[] = [];

    const op = this.extractOp(statement);
    const operationType = INSTRUCTION_TYPE[op];

    tokens.push({
      lexeme: op.trim(),
      type: "Instruction",
    });

    if (
      (["transfer", "arthimetic"] as InstructionType[]).includes(operationType)
    ) {
      const leftArg = this.extractArg(statement);
      if (leftArg) {
        tokens.push({
          lexeme: leftArg.value,
          type: "LeftArgument",
          addressType: leftArg.type,
        });
      }

      const rightArg = this.extractArg(statement);
      if (rightArg) {
        tokens.push({
          lexeme: rightArg.value,
          type: "RightArgument",
          addressType: rightArg.type,
        });
      }
    }

    return tokens;
  }
}
