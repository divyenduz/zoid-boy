import { match } from "ts-pattern";
import { InstructionSet } from "./InstructionSet";
import { MemoryType, Tokenizer } from "./Tokenizer";

type Argument = {
  value: string;
  addressType: MemoryType;
  is8Bit: boolean;
  isIndirect: boolean;
};

type Expression = {
  left: Argument;
  right: Argument;
  operator: "PLUS" | "MINUS";
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

  z: "Register", // Actually flag!
  nz: "Register", // Actually flag!
  // c: "Register", // Actually flag!
  nc: "Register", // Actually flag!

  // TODO: this instruction (POP AF, 0xF1) exists, but general docs never say that A, F can be combined
  af: "Register",

  d8: "Address", // Note: immediate 8-bit signed data
  d16: "Address", // Note: immediate 16-bit signed data
  a8: "Address", // Note: 8-bit unsigned data
  a16: "Address", // Note: 16-bit address
  r8: "Address", // Note: 8-bit signed data, which is added to PC

  // Static addresses, 0xyy
  "00h": "Address",
  "08h": "Address",
  "10h": "Address",
  "18h": "Address",
  "20h": "Address",
  "28h": "Address",
  "30h": "Address",
  "38h": "Address",

  "0": "Address", // More like, static address 0x0
  cb: "Address", // Note: actually special!!
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
    console.log({ tokens });
    const statements: Statement[] = [];
    let isSecondArgument = false;
    let isFirstArgumentIndirect = false;
    let isSecondArgumentIndirect = false;
    for (const token of tokens) {
      if (token.type === "INSTRUCTION") {
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

      if (token.type === "COMMA") {
        isSecondArgument = true;
      }

      if (token.type === "LPAREN") {
        if (isSecondArgument) {
          isSecondArgumentIndirect = true;
        } else {
          isFirstArgumentIndirect = true;
        }
      }

      if (token.type === "RPAREN") {
        // Skip
      }

      if (token.type === "ARGUMENT") {
        const leftOrRight = isSecondArgument ? "right" : "left";

        const addressType = MEMORY_TYPE_MAP[token.lexeme];
        if (!addressType) {
          throw new Error(
            `Address type not found for "${token.lexeme}" in "${statement}"`
          );
        }
        const is8Bit = match(addressType)
          .with("Register", () => {
            return token.lexeme.length === 1;
          })
          .with("Address", () => {
            return token.lexeme.length === 2;
          })
          .exhaustive();

        const isIndirect = isSecondArgument
          ? isSecondArgumentIndirect
          : isFirstArgumentIndirect;

        statements[statements.length - 1][leftOrRight] = {
          value: token.lexeme,
          addressType,
          is8Bit,
          isIndirect,
        };
      }
    }
    return statements;
  }
}

async function main() {
  const input = `
// LD BC,d16
// LD (BC),A
// LD (HL+),A
// LD A,(HL+)
// LD (HL-),A
LD HL,SP+r8
// PREFIX CB
  `
    .trim()
    .split("\n")
    .filter((line) => !line.startsWith("//"))
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const parser = new Parser();
  for (const line of input) {
    const statements = parser.parse(line);
    // @ts-expect-error
    delete statements[0].instructionData;
    console.log(line, statements);
  }
}
main();
