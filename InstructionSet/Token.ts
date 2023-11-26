type TokenType =
  | "INSTRUCTION"
  | "PLUS"
  | "MINUS"
  | "COMMA"
  | "LPAREN"
  | "RPAREN"
  | "ARGUMENT"
  | "EOF";

export const TOKENS: Record<string, TokenType> = {
  prefix: "INSTRUCTION",

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

  invalid: "INSTRUCTION", // TODO: doesn't really exist, but to encode missing ops

  "+": "PLUS",
  "-": "MINUS",
  ",": "COMMA",
  "(": "LPAREN",
  ")": "RPAREN",
};

export class Token {
  constructor(
    public lexeme: string,
    public type: TokenType
  ) {}
}
