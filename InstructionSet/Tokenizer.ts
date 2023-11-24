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
  is16Bit: boolean;
  addressType: ArgumentType;
};

const ADDRESS_TYPE_MAP: Record<string, ArgumentType> = {
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

  d8: "DirectAddress", // Note: immediate 8-bit signed data
  d16: "DirectAddress", // Note: immediate 16-bit signed data
  a8: "DirectAddress", // Note: 8-bit unsigned data
  a16: "DirectAddress", // Note: 16-bit address
  r8: "DirectAddress", // Note: 8-bit signed data, which is added to PC

  "20h": "DirectAddress", // More like, static address 0x20
  "30h": "DirectAddress", // More like, static address 0x30

  "sp+r8": "DirectAddress", // TODO: not correct, needs to be broken down into expressions
  spr8: "DirectAddress", // TODO: not correct, needs to be broken down into expressions
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

  private extractIndirectRegisterOrAddress(arg: string) {
    let isIndirect = false;
    if (arg.startsWith("(") && arg.endsWith(")")) {
      isIndirect = true;
      arg = arg.slice(1, arg.length - 1);
    }

    // TODO: handle increment/decrement and + expressions
    arg = arg.replace("+", "").replace("-", "").toLowerCase();
    const addressTypePartial = ADDRESS_TYPE_MAP[arg];
    const addressType = match({ addressType: addressTypePartial, isIndirect })
      .with(
        {
          isIndirect: false,
        },
        () => {
          return addressTypePartial;
        }
      )
      .with(
        {
          addressType: "Register",
          isIndirect: true,
        },
        () => "RegisterAddress" as const
      )
      .with(
        {
          addressType: "DirectAddress",
          isIndirect: true,
        },
        () => "IndirectAddress" as const
      )
      .otherwise(() => {
        throw new Error(
          "After removing parenthesis, address type must be one of Register or DirectAddress"
        );
      });

    const is8Bit = match(addressType)
      .with("Register", () => arg.length === 1)
      .with("RegisterAddress", () => arg.length === 1)
      .with("DirectAddress", () => arg.length === 2)
      .with("IndirectAddress", () => arg.length === 2)
      // TODO: handle 20h, etc
      .exhaustive();

    return {
      type: addressType,
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
          is8Bit: leftArg.is8Bit,
          is16Bit: leftArg.is16Bit,
        });
      }

      const rightArg = this.extractArg(statement);
      if (rightArg) {
        tokens.push({
          lexeme: rightArg.value,
          type: "RightArgument",
          addressType: rightArg.type,
          is8Bit: rightArg.is8Bit,
          is16Bit: rightArg.is16Bit,
        });
      }
    }

    return tokens;
  }
}
