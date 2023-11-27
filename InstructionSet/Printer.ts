import fs from "fs";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB";
import { InstructionSet } from "./InstructionSet";
import { Parser } from "./Parser";
import {
  BinaryExpression,
  Expression,
  NullaryExpression,
  Statement,
  UnaryExpression,
} from "./AST";
import { match, P } from "ts-pattern";
export class Printer {
  private readonly template: string;
  private readonly parser: Parser = new Parser();
  constructor() {
    this.template = fs.readFileSync(
      "./InstructionSet/CPU.template.ts",
      "utf-8"
    );
  }

  static trimString(str: string) {
    return str
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .trim();
  }

  private getInstructionData(opcode: number, prefixCB: boolean) {
    return Object.values(
      prefixCB ? InstructionSetPrefixCB : InstructionSet
    ).find((instructionFromSet) => instructionFromSet.opcode === opcode);
  }

  private numberToHex(n: number) {
    return n.toString(16).padStart(2, "0");
  }

  private inlineUnsigned(addr: string) {
    return `((0x80 ^ ${addr}) - 0x80)`;
  }

  private printReader(expression: Expression | null, is8Bit: boolean = true) {
    if (!expression) {
      return ``;
    }
    return match(expression)
      .with(P.instanceOf(BinaryExpression), (expression) => {
        // Note: only one case of binary expression is LD HL,SP+r8
        return `
        const r8 = this.mmu.readByte(this.pc);
        const v = new Uint16Array(this.${
          expression.left.value
        }[0] + ${this.inlineUnsigned(expression.right.value + "[0]")});`;
      })
      .with(
        P.instanceOf(NullaryExpression),
        P.instanceOf(UnaryExpression),
        (expression) => {
          const argument = expression.left;

          if (argument.addressType === "Register") {
            if (argument.isIndirect) {
              if (argument.is8Bit) {
                return `
                const addr = new Uint16Array(0xFF00 + this.${argument.value}[0])
                const v = this.mmu.readByte(addr)
                `;
              } else {
                return `const v = this.mmu.readByte(this.${argument.value})`;
              }
            } else {
              return `const v = this.${argument.value}`;
            }
          } else {
            const readerFn =
              is8Bit || argument.value === "d8" ? "readByte" : "readWord";
            return `
            const v /*${argument.value}*/ = this.mmu.${readerFn}(this.pc);
            ${
              argument.value === "r8"
                ? `v[0] = ${this.inlineUnsigned("v[0]")}`
                : ""
            }
            `.trim();
          }
        }
      )
      .exhaustive();
  }

  private printWriter(expression: Expression | null, is8Bit: boolean = true) {
    if (!expression) {
      return ``;
    }
    return match(expression)
      .with(P.instanceOf(BinaryExpression), (expression) => {
        throw new Error("BinaryExpression not implemented in printWriter");
      })
      .with(
        P.instanceOf(NullaryExpression),
        P.instanceOf(UnaryExpression),
        (expression) => {
          const argument = expression.left;

          if (argument.isIndirect) {
            const fromAddr =
              argument.addressType === "Register"
                ? `this.${argument.value}`
                : "this.pc";

            const label =
              argument.addressType === "Address"
                ? ` /*${argument.value}*/`
                : "";

            const writerFn = is8Bit ? "writeByte" : "writeWord";
            if (argument.is8Bit) {
              return `
              const addr = new Uint16Array(0xFF00 + ${fromAddr}[0])
              this.mmu.${writerFn}(addr, v)
              `;
            } else {
              return `
                    const addr${label} = this.mmu.readWord(${fromAddr})
                    this.mmu.${writerFn}(addr, v)
                    `.trim();
            }
          } else {
            return `
            this.${argument.value} = v
            `.trim();
          }
        }
      )
      .exhaustive();
  }

  private printUnary(expression: Expression | null) {
    if (expression && expression instanceof UnaryExpression) {
      const operator = match(expression.operator)
        .with("PLUS", () => "+")
        .with("MINUS", () => "-")
        .otherwise(() => {
          throw new Error(`Unknown operator ${expression.operator}`);
        });
      return `this.${expression.left.value}[0] ${operator}= 1`;
    } else {
      return ``;
    }
  }

  printLDInstruction(parsedInstruction: Statement) {
    const code = Printer.trimString(`
    ${this.printReader(
      parsedInstruction.right,
      parsedInstruction.left?.left.is8Bit
    )}
    ${this.printWriter(
      parsedInstruction.left,
      parsedInstruction.right?.left.is8Bit
    )}
    ${this.printUnary(parsedInstruction.left)}
    ${this.printUnary(parsedInstruction.right)}
    `);
    return code;
  }

  printXORInstruction(parsedInstruction: Statement) {
    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    this.a[0] ^= v[0]
    `);
    return code;
  }

  printJRInstruction(parsedInstruction: Statement) {
    if (parsedInstruction.left && parsedInstruction.right) {
      // JR with jump

      const instructionData = this.getInstructionData(
        parsedInstruction.opcode,
        false
      );
      if (!instructionData) {
        throw new Error(
          `Instruction "${parsedInstruction.instruction}" not found.`
        );
      }

      const flagMap: Record<string, string> = {
        z: "this.flag_z[0]",
        nz: "!(this.flag_z[0])",
        c: "this.flag_c[3]",
        nc: "!(this.flag_c[3])",
      };

      const code = Printer.trimString(`
        let cycles = 0
        if (${flagMap[parsedInstruction.left.left.value]}) {
            ${this.printReader(parsedInstruction.right)}
            this.pc[0] += v[0]
            cycles = ${instructionData?.cycles_jump}
        } else {
            cycles = ${instructionData?.cycles}
        }
        `);
      return code;
    } else {
      // JR with no jump
      const code = Printer.trimString(`
        ${this.printReader(parsedInstruction.left)}
        this.pc[0] += v[0]
        `);
      return code;
    }
  }

  printInstruction(instruction: string, prefixCB: boolean) {
    const program = this.parser.parse(instruction);
    const parsedInstruction = program.statements[0];
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      prefixCB
    );
    if (!instructionData) {
      throw new Error(`Instruction "${instruction}" not found.`);
    }
    const opcodeHex = this.numberToHex(instructionData.opcode);
    const instructionCode = match(parsedInstruction.instruction)
      .with("invalid", () => {
        return `throw new Error("Invalid instruction, should never be called");`;
      })
      .with("nop", () => {
        return ``;
      })
      .with("prefix", () => {
        return `this.prefix_cb = true;`;
      })
      .with("ld", () => {
        return this.printLDInstruction(parsedInstruction);
      })
      .with("xor", () => {
        return this.printXORInstruction(parsedInstruction);
      })
      .with("jr", () => {
        return this.printJRInstruction(parsedInstruction);
      })
      .otherwise(() => {
        return `throw new Error("Instruction '${instruction}', '${opcodeHex}' not implemented");`;
      });

    const code = Printer.trimString(`
    // ${instructionData.mnemonic}
    .with(0x${opcodeHex}, ()=>{
        ${instructionCode}
    })`);
    return code;
  }
}
