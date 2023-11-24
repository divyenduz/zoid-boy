import { InstructionSet } from "./InstructionSet";
import { MemoryType, Tokenizer } from "./Tokenizer";

export type InstructionType =
  | "misc"
  | "transfer"
  | "arthimetic"
  | "rotate-shift"
  | "bit-operations"
  | "control";

export const INSTRUCTION_TYPE: Record<string, InstructionType> = {
  ld: "transfer",
  ldh: "transfer",
  push: "transfer",
  pop: "transfer",

  add: "arthimetic",
  adc: "arthimetic",
  sub: "arthimetic",
  sbc: "arthimetic",
  cp: "arthimetic",
  and: "arthimetic",
  or: "arthimetic",
  xor: "arthimetic",
  inc: "arthimetic",
  dec: "arthimetic",

  swap: "misc",
  daa: "misc",
  cpl: "misc",
  ccf: "misc",
  scf: "misc",
  nop: "misc",
  halt: "misc",
  stop: "misc",
  di: "misc",
  ei: "misc",

  rlca: "rotate-shift",
  rla: "rotate-shift",
  rrca: "rotate-shift",
  rra: "rotate-shift",
  rlc: "rotate-shift",
  rl: "rotate-shift",
  rrc: "rotate-shift",
  rr: "rotate-shift",
  sla: "rotate-shift",
  sra: "rotate-shift",
  srl: "rotate-shift",

  bit: "bit-operations",
  set: "bit-operations",
  res: "bit-operations",

  jp: "control",
  jr: "control",

  call: "control",
  rst: "control",
  ret: "control",
  reti: "control",
};

type Argument = {
  value: string;
  addressType: MemoryType;
  is8Bit: boolean;
  isIndirect: boolean;
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
    statement = statement.toLowerCase().trim();
    const instructionData = Object.values(InstructionSet).find(
      (instruction) => instruction.mnemonic.toLowerCase() === statement
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
          console.debug({ token, statement });
          throw new Error("Failed to find address type");
        }
        statements[statements.length - 1].left = {
          value: token.lexeme,
          addressType,
          is8Bit: token.is8Bit,
          isIndirect: token.isIndirect,
        };
      }
      if (token.type === "RightArgument") {
        const addressType = token.addressType;
        if (!addressType) {
          console.debug({ token, statement });
          throw new Error("Failed to find address type");
        }
        statements[statements.length - 1].right = {
          value: token.lexeme,
          addressType,
          is8Bit: token.is8Bit,
          isIndirect: token.isIndirect,
        };
      }
    }
    return statements;
  }
}
