import fs from "fs";

import { InstructionSet } from "./InstructionSet";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB";

import { format } from "prettier";
import { Parser } from "./Parser";
import { match, P } from "ts-pattern";
import { Expression, UnaryExpression } from "./AST";
import { Printer } from "./Printer";

export class CPUWriter {
  private readonly template: string;
  constructor() {
    this.template = fs.readFileSync(
      "./InstructionSet/CPU.template.ts",
      "utf-8"
    );
  }

  private numberToHex(n: number) {
    return n.toString(16).padStart(2, "0");
  }

  private renderUnaryExpression(expression: Expression | null) {
    if (!(expression instanceof UnaryExpression)) {
      return ``;
    }
    // Note: handle unary operations like INC and DEC
    const operator = match(expression.operator)
      .with("PLUS", () => "+")
      .with("MINUS", () => "-")
      .otherwise(() => {
        throw new Error(`Unknown operator ${expression.operator}`);
      });

    return `this.${expression.left.value}[0] ${operator}= 1`;
  }

  write() {
    const parser = new Parser();
    const executeFns = Object.values(InstructionSet).map((instruction) => {
      const { mnemonic } = instruction;
      const printer = new Printer();
      return printer.printInstruction(mnemonic, false);
    });

    const code = [
      `match(instruction[0])`,
      ...executeFns,
      '.otherwise(() => { throw new Error( `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"` ); });',
    ];

    const executeCBFns = Object.values(InstructionSetPrefixCB).map(
      (instruction) => {
        const { mnemonic } = instruction;
        const printer = new Printer();
        return printer.printInstruction(mnemonic, true);
      }
    );

    const codeCB = [
      `match(instruction[0])`,
      ...executeCBFns,
      '.otherwise(() => { throw new Error( `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"` ); });',
    ];

    return this.template
      .replace(`// {{ADD_EXECUTE_MATCH}}`, code.join("\n"))
      .replace(`// {{ADD_EXECUTE_CB_MATCH}}`, codeCB.join("\n"));
  }

  writeMnemonics() {
    const mnemonics = Object.values(InstructionSet).map((instruction) => {
      const { mnemonic } = instruction;

      return mnemonic;
    });
    const text = mnemonics.join("\n");
    fs.writeFileSync("./InstructionSet/mnemonics.txt", text);
  }

  writeCBMnemonics() {
    const mnemonics = Object.values(InstructionSetPrefixCB).map(
      (instruction) => {
        const { mnemonic } = instruction;

        return mnemonic;
      }
    );
    const text = mnemonics.join("\n");
    fs.writeFileSync("./InstructionSet/cb_mnemonics.txt", text);
  }
}

async function main() {
  const writer = new CPUWriter();
  const generatedCPU = writer.write();
  const formattedGeneratedCPU = await format(generatedCPU, {
    parser: "typescript",
  });
  console.log("successful write");
  fs.writeFileSync("./InstructionSet/CPU.ts", formattedGeneratedCPU);
}

main();
