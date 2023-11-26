import { InstructionType } from "./Parser";
import { MemoryType } from "./Tokenizer";

export class Program {
  constructor(public statements: Statement[]) {}
}

export class Statement {
  constructor(
    public lexeme: string,
    public instruction: string,
    public opcode: number,
    public type: InstructionType,
    public left: Expression | null,
    public right: Expression | null
  ) {}
}

export class Argument {
  constructor(
    public value: string,
    public addressType: MemoryType,
    public is8Bit: boolean,
    public isIndirect: boolean
  ) {}
}

type Expression = NullaryExpression | UnaryExpression | BinaryExpression;

// Two arguments and operator
export class BinaryExpression {
  constructor(
    public left: Argument,
    public right: Argument,
    public operator: "PLUS" | "MINUS"
  ) {}
}

// Argument and increment or decrement operator
export class UnaryExpression {
  constructor(
    public left: Argument,
    public operator: "PLUS" | "MINUS"
  ) {}
}

// Just argument i.e. register or address
export class NullaryExpression {
  constructor(public left: Argument) {}
}
