import fs from "fs";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB";
import { InstructionData, InstructionSet } from "./InstructionSet";
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
    const instructionData = Object.values(
      prefixCB ? InstructionSetPrefixCB : InstructionSet
    ).find((instructionFromSet) => instructionFromSet.opcode === opcode);
    if (!instructionData) {
      throw new Error(
        `Instruction "${opcode}" not found in ${
          prefixCB ? "InstructionSetPrefixCB" : "InstructionSet"
        }.`
      );
    }
    return instructionData;
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

  private printFlagHandling(
    instructionData: InstructionData,
    result: string | null = null
  ) {
    const zFlagCode = match(instructionData.Z)
      .with("Z", () => {
        if (!result) {
          return ``;
        }
        return `
        if (${result} === 0) {
            this.flag_z[0] = 1
        }
        `;
      })
      .with("1", () => {
        return `this.flag_z[0] = 1`;
      })
      .with("0", () => {
        return `this.flag_z[0] = 0;`;
      })
      .with("-", () => {
        return ``;
      })
      .exhaustive();

    const nFlagCode = match(instructionData.N)
      .with("N", () => {
        return `console.log('Implement N flag')`;
      })
      .with("1", () => {
        return `this.flag_n[1] = 1`;
      })
      .with("0", () => {
        return `this.flag_n[1] = 0;`;
      })
      .with("-", () => {
        return ``;
      })
      .exhaustive();

    const hFlagCode = match(instructionData.H)
      .with("H", () => {
        return `console.log('Implement H flag')`;
      })
      .with("1", () => {
        return `this.flag_h[2] = 1`;
      })
      .with("0", () => {
        return `this.flag_h[2] = 0;`;
      })
      .with("-", () => {
        return ``;
      })
      .exhaustive();

    const cFlagCode = match(instructionData.C)
      .with("C", () => {
        return `console.log('Implement C flag')`;
      })
      .with("1", () => {
        return `this.flag_c[3] = `;
      })
      .with("0", () => {
        return `this.flag_c[3] = 0;`;
      })
      .with("-", () => {
        return ``;
      })
      .exhaustive();

    return Printer.trimString(
      [zFlagCode, nFlagCode, hFlagCode, cFlagCode].join("\n")
    );
  }

  private printPCIncrement(instructionData: InstructionData) {
    return instructionData.length > 1
      ? `this.pc[0] += ${instructionData.length - 1};`
      : ``;
  }

  // Note: don't use for JR instruction where cycles are different depending on jump
  private printReturnCycles(instructionData: InstructionData) {
    return `return ${instructionData.cycles}`;
  }

  private printInstructionCommon(
    instructionData: InstructionData,
    result: string | null = null
  ) {
    return Printer.trimString(`
    ${this.printPCIncrement(instructionData)}
    ${this.printFlagHandling(instructionData, result)}
    ${this.printReturnCycles(instructionData)}`);
  }

  private printLDInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );
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
    ${this.printInstructionCommon(instructionData)}
    `);
    return code;
  }

  private printXORInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    this.a[0] ^= v[0]
    ${this.printInstructionCommon(instructionData, "this.a[0]")}
    `);
    return code;
  }

  private printINCInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    v[0] += 1
    ${this.printInstructionCommon(instructionData, "v[0]")}
    `);
    return code;
  }

  private printADDInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.right)}
    this.${parsedInstruction.left?.left.value}[0] += v[0]
    ${this.printInstructionCommon(
      instructionData,
      `this.${parsedInstruction.left?.left.value}[0]`
    )}
    `);
    return code;
  }

  private printJRInstruction(parsedInstruction: Statement) {
    if (parsedInstruction.left && parsedInstruction.right) {
      // JR with jump

      const instructionData = this.getInstructionData(
        parsedInstruction.opcode,
        false
      );

      const flagMap: Record<string, string> = {
        z: "this.flag_z[0]",
        nz: "!(this.flag_z[0])",
        c: "this.flag_c[3]",
        nc: "!(this.flag_c[3])",
      };

      const code = Printer.trimString(`
        if (${flagMap[parsedInstruction.left.left.value]}) {
            ${this.printReader(parsedInstruction.right)}
            this.pc[0] += v[0]
            return ${instructionData?.cycles_jump}
        } else {
            ${this.printInstructionCommon(instructionData)}
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

  private printCALLInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    if (parsedInstruction.left && parsedInstruction.right) {
      // CALL with jump

      const flagMap: Record<string, string> = {
        z: "this.flag_z[0]",
        nz: "!(this.flag_z[0])",
        c: "this.flag_c[3]",
        nc: "!(this.flag_c[3])",
      };

      const code = Printer.trimString(`
        if (${flagMap[parsedInstruction.left.left.value]}) {
            this.sp = this.pc
            return ${instructionData?.cycles_jump}
        } else {
            ${this.printInstructionCommon(instructionData)}
        }
        `);
      return code;
    } else {
      // JR with no jump
      const code = Printer.trimString(`
        this.sp = this.pc
        ${this.printInstructionCommon(instructionData)}
        `);
      return code;
    }
  }

  private printCBBitInstruction(parsedInstruction: Statement) {
    if (!parsedInstruction.left || !parsedInstruction.right) {
      throw new Error("Invalid BIT instruction");
    }
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      true
    );
    return `
    ${this.printReader(parsedInstruction.right)}
    const res = v[0] & (1 << ${parsedInstruction.left.left.value})
    this.prefix_cb = false;
    this.pc[0] -= 1; // Compensate for CB call
    ${this.printInstructionCommon(instructionData, "res")}
    `;
  }

  private printPrefixCBInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      true
    );
    return `
    this.prefix_cb = true;
    ${this.printReturnCycles(instructionData)}
    `;
  }

  printInstruction(instruction: string, prefixCB: boolean) {
    const program = this.parser.parse(instruction);
    const parsedInstruction = program.statements[0];
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      prefixCB
    );
    const opcodeHex = this.numberToHex(instructionData.opcode);
    const instructionCode = match(parsedInstruction.instruction)
      .with("invalid", () => {
        return `throw new Error("Invalid instruction, should never be called");`;
      })
      .with("nop", () => {
        return ``;
      })
      .with("prefix", () => {
        return this.printPrefixCBInstruction(parsedInstruction);
      })
      .with("ld", () => {
        return this.printLDInstruction(parsedInstruction);
      })
      .with("ldh", () => {
        return this.printLDInstruction(parsedInstruction);
      })
      .with("xor", () => {
        return this.printXORInstruction(parsedInstruction);
      })
      .with("inc", () => {
        return this.printINCInstruction(parsedInstruction);
      })
      .with("add", () => {
        return this.printADDInstruction(parsedInstruction);
      })
      .with("jr", () => {
        return this.printJRInstruction(parsedInstruction);
      })
      .with("call", () => {
        return this.printCALLInstruction(parsedInstruction);
      })
      // CB instructions
      .with("bit", () => {
        return this.printCBBitInstruction(parsedInstruction);
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
