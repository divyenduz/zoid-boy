import { InstructionSet } from "./InstructionSet";
import { ArgumentType, Tokenizer } from "./Tokenizer";

export type InstructionType =
  | "misc"
  | "transfer"
  | "arthimetic"
  | "rotate-shift"
  | "bit-operations"
  | "control";

export const INSTRUCTION_TYPE: Record<string, InstructionType> = {
  LD: "transfer",
  LDH: "transfer",
  PUSH: "transfer",
  POP: "transfer",

  ADD: "arthimetic",
  ADC: "arthimetic",
  SUB: "arthimetic",
  SBC: "arthimetic",
  CP: "arthimetic",
  AND: "arthimetic",
  OR: "arthimetic",
  XOR: "arthimetic",
  INC: "arthimetic",
  DEC: "arthimetic",

  SWAP: "misc",
  DAA: "misc",
  CPL: "misc",
  CCF: "misc",
  SCF: "misc",
  NOP: "misc",
  HALT: "misc",
  STOP: "misc",
  DI: "misc",
  EI: "misc",

  RLCA: "rotate-shift",
  RLA: "rotate-shift",
  RRCA: "rotate-shift",
  RRA: "rotate-shift",
  RLC: "rotate-shift",
  RL: "rotate-shift",
  RRC: "rotate-shift",
  RR: "rotate-shift",
  SLA: "rotate-shift",
  SRA: "rotate-shift",
  SRL: "rotate-shift",

  BIT: "bit-operations",
  SET: "bit-operations",
  RES: "bit-operations",

  JP: "control",
  JR: "control",

  CALL: "control",
  RST: "control",
  RET: "control",
  RETI: "control",
};

type Argument = {
  type: "register" | "address";
  value: string;
  addressType: ArgumentType;
};

type Statement = {
  lexeme: string;
  instruction: string;
  opcode: number;
  instructionData: (typeof InstructionSet)[keyof typeof InstructionSet];
  type: InstructionType;

  left: Argument | null;
  right: Argument | null;
};

export class Parser {
  private tokenizer = new Tokenizer();
  constructor() {}

  parse(statement: string): Statement[] {
    const instructionData = Object.values(InstructionSet).find(
      (instruction) => instruction.mnemonic === statement
    );
    if (!instructionData) {
      throw new Error(`Instruction "${statement}" not found.`);
    }
    const tokens = this.tokenizer.tokenize(statement);
    const statements: Statement[] = [];
    for (const token of tokens) {
      if (token.type === "Instruction") {
        statements.push({
          lexeme: statement,
          instruction: token.lexeme,
          opcode: instructionData.opcode,
          instructionData,
          type: INSTRUCTION_TYPE[token.lexeme],
          left: null,
          right: null,
        });
      }
      if (token.type === "LeftArgument") {
        const addressType = token.addressType;
        if (!addressType) {
          throw new Error("Failed to find address type");
        }
        statements[statements.length - 1].left = {
          type: "register",
          value: token.lexeme,
          addressType,
        };
      }
      if (token.type === "RightArgument") {
        const addressType = token.addressType;
        if (!addressType) {
          throw new Error("Failed to find address type");
        }
        statements[statements.length - 1].right = {
          type: "register",
          value: token.lexeme,
          addressType,
        };
      }
    }
    return statements;
  }
}
