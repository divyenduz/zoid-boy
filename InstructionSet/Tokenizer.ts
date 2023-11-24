import { match } from "ts-pattern";
import { INSTRUCTION_TYPE, InstructionType } from "./Parser";

type TokenType = "Instruction" | "LeftArgument" | "RightArgument";

type Token = InstructionToken | ArgumentToken;

type InstructionToken = {
  lexeme: string;
  type: "Instruction";
};

type ArgumentToken = {
  lexeme: string;
  type: "LeftArgument" | "RightArgument";
  is8Bit: boolean;
  addressType: MemoryType;
  isIndirect: boolean;
};

const MEMORY_TYPE_MAP: Record<string, MemoryType> = {
  a: "Register",
  f: "Register",
  b: "Register",
  c: "Register",
  d: "Register",
  e: "Register",
  h: "Register",
  l: "Register",

  bc: "Register",
  de: "Register",
  hl: "Register",

  sp: "Register",
  pc: "Register",

  // TODO: this instruction (POP AF, 0xF1) exists, but general docs never say that A, F can be combined
  af: "Register",

  d8: "Address", // Note: immediate 8-bit signed data
  d16: "Address", // Note: immediate 16-bit signed data
  a8: "Address", // Note: 8-bit unsigned data
  a16: "Address", // Note: 16-bit address
  r8: "Address", // Note: 8-bit signed data, which is added to PC

  "20h": "Address", // More like, static address 0x20
  "30h": "Address", // More like, static address 0x30

  "sp+r8": "Address", // TODO: not correct, needs to be broken down into expressions
  spr8: "Address", // TODO: not correct, needs to be broken down into expressions
};

export type MemoryType = "Register" | "Address";

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

  private extractIndirectRegisterOrAddress(arg: string) {
    let isIndirect = false;
    if (arg.startsWith("(") && arg.endsWith(")")) {
      isIndirect = true;
      arg = arg.slice(1, arg.length - 1);
    }

    // TODO: handle increment/decrement and + expressions
    arg = arg.replace("+", "").replace("-", "").toLowerCase();
    const memoryType = MEMORY_TYPE_MAP[arg];

    const is8Bit = match(memoryType)
      .with("Register", () => arg.length === 1)
      .with("Address", () => arg.length === 2)
      // TODO: handle 20h, etc
      .exhaustive();

    return {
      type: memoryType,
      isDirect: !isIndirect,
      isIndirect,
      is8Bit,
      is16Bit: !is8Bit,
      value: arg,
    };
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

        return this.extractIndirectRegisterOrAddress(arg);
      }
      arg += statement[i];
    }
    this.position = statement.length;
    arg = arg.trim();

    if (arg.length === 0) {
      return null;
    }

    return this.extractIndirectRegisterOrAddress(arg);
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
          isIndirect: leftArg.isIndirect,
          is8Bit: leftArg.is8Bit,
        });
      }

      const rightArg = this.extractArg(statement);
      if (rightArg) {
        tokens.push({
          lexeme: rightArg.value,
          type: "RightArgument",
          addressType: rightArg.type,
          isIndirect: rightArg.isIndirect,
          is8Bit: rightArg.is8Bit,
        });
      }
    }

    return tokens;
  }
}
