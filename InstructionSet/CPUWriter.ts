import fs from "fs";

import { InstructionSet } from "./InstructionSet.js";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB.js";

import { format } from "prettier";
import { Parser } from "./Parser.js";
import { match, P } from "ts-pattern";
import { Expression, UnaryExpression } from "./AST.js";
import { Printer } from "./Printer.js";

export class CPUWriter {
  private readonly template: string;
  constructor() {
    this.template = fs.readFileSync(
      "./InstructionSet/CPU.template.ts",
      "utf-8"
    );
  }

  write() {
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
      .replace(`// {{ADD_EXECUTE_MATCH}}`, "return " + code.join("\n"))
      .replace(`// {{ADD_EXECUTE_CB_MATCH}}`, "return " + codeCB.join("\n"));
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
