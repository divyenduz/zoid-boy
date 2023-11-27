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
      const { opcode, mnemonic, length, cycles, Z, N, H, C } = instruction;
      const opcodeHex = this.numberToHex(opcode);

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
        const { opcode, mnemonic, length, cycles, Z, N, H, C } = instruction;
        const opcodeHex = this.numberToHex(opcode);

        const program = parser.parse(mnemonic);
        const parsedInstruction = program.statements[0];
        const debugOpcode = parsedInstruction.opcode === 0x20;

        let statements: string[] = [];

        const impl = match(parsedInstruction.instruction)
          // TODO: this should be parsed as a single instruction called "prefix cb"
          .otherwise(() => {
            return `throw new Error("Prefix CB Instruction '${mnemonic}', '${opcodeHex}' not implemented");`;
          });

        statements.push(`// ${mnemonic}`);
        statements.push(`.with(0x${opcodeHex}, () => {`);
        statements.push(impl);
        statements.push(`this.prefix_cb = false;`);

        // Note: length-1 because we bump pc as soon as we read the instruction
        statements.push(`this.pc[0] += ${length - 1};`);
        statements.push(`return ${cycles}`);
        statements.push(`})`);

        return statements.join("\n");
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
