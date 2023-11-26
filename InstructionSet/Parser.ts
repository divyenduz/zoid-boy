import { match } from "ts-pattern";
import { InstructionSet } from "./InstructionSet";
import { MemoryType, Tokenizer } from "./Tokenizer";
import { Token } from "./Token";
import {
  Argument,
  NullaryExpression,
  Statement,
  Program,
  BinaryExpression,
  UnaryExpression,
} from "./AST";
import { parse } from "path";

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
  private tokens: Token[] = [];
  private position = 0;
  private statement: string = "";
  constructor() {}

  private currentToken() {
    return this.tokens[this.position];
  }

  private peekToken() {
    return this.tokens[this.position + 1];
  }

  private parseArgument() {
    let isIndirect = false;
    if (this.currentToken().type === "LPAREN") {
      isIndirect = true;
      this.position += 1;
    }
    const argumentToken = this.currentToken();
    const memoryType = MEMORY_TYPE_MAP[argumentToken.lexeme] || "Address";
    const is8Bit = match(memoryType)
      .with("Register", () => {
        return argumentToken.lexeme.length === 1;
      })
      .with("Address", () => {
        return argumentToken.lexeme.length === 2;
      })
      .exhaustive();
    const argument = new Argument(
      argumentToken.lexeme,
      MEMORY_TYPE_MAP[argumentToken.lexeme],
      is8Bit,
      isIndirect
    );
    return argument;
  }

  private parseExpression() {
    this.position += 1;
    const firstArgument = this.parseArgument();
    if (this.peekToken().type === "PLUS" || this.peekToken().type === "MINUS") {
      const op = this.peekToken().type;
      this.position += 1;
      if (this.peekToken().type === "ARGUMENT") {
        this.position += 1;
        const secondArgument = this.parseArgument();
        return new BinaryExpression(
          firstArgument,
          secondArgument,
          op as "PLUS" | "MINUS"
        );
      } else if (this.peekToken().type === "RPAREN") {
        this.position += 1;
        return new UnaryExpression(firstArgument, op as "PLUS" | "MINUS");
      } else {
        throw new Error("Expected argument or RPAREN after PLUS");
      }
    }

    console.log(this.currentToken());
    console.log(this.peekToken());

    if (this.peekToken().type === "RPAREN") {
      this.position += 1;
    }

    if (this.peekToken().type === "EOF" || this.peekToken().type === "COMMA") {
      return new NullaryExpression(firstArgument);
    }

    throw new Error("Expected EOF or COMMA after argument");
  }

  private parseStatement() {
    const instructionData = Object.values(InstructionSet).find(
      (instruction) => instruction.mnemonic.toLowerCase() === this.statement
    );
    if (!instructionData) {
      throw new Error(`Instruction "${this.statement}" not found.`);
    }

    const statement = new Statement(
      this.statement,
      this.currentToken().lexeme,
      instructionData.opcode,
      INSTRUCTION_TYPE[this.currentToken().lexeme],
      null,
      null
    );

    const peekToken = this.peekToken();
    if (peekToken.type === "EOF") {
      return statement;
    }
    const firstExpression = this.parseExpression();
    statement.left = firstExpression;

    if (this.peekToken().type === "COMMA") {
      this.position += 1;
      const secondArgument = this.parseExpression();
      statement.right = secondArgument;
    }

    return statement;
  }

  private reset() {
    this.position = 0;
    this.statement = "";
    this.tokens = [];
  }

  parse(statementStr: string): Program {
    this.reset();
    this.statement = statementStr.toLowerCase().trim();
    console.log({ statementStr: this.statement });

    this.tokens = this.tokenizer.tokenize(statementStr);
    console.log({ tokens: this.tokens });
    const statements: Statement[] = [];
    const statement = this.parseStatement();
    statements.push(statement);
    return new Program(statements);
  }
}

// const parser = new Parser();
// const program = parser.parse("XOR (HL)");
// console.log(program.statements[0]);
