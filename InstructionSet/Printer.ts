import fs from "fs";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB.js";
import { InstructionData, InstructionSet } from "./InstructionSet.js";
import { Parser } from "./Parser.js";
import {
  BinaryExpression,
  Expression,
  NullaryExpression,
  Statement,
  UnaryExpression,
} from "./AST.js";
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

  private printReader(expression: Expression | null, is8Bit: boolean = true) {
    if (!expression) {
      return ``;
    }
    return match(expression)
      .with(P.instanceOf(BinaryExpression), (expression) => {
        // Note: only one case of binary expression is LD HL,SP+r8
        return `
        const r8 = this.mmu.readByte(this.pc);
        //@ts-expect-error todo, this needs to be fixed!
        const v = new Uint8Array(this.${expression.left.value}[0] + new Int8Array(${expression.right.value}));`;
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

            return match(argument.value)
              .with("r8", () => {
                return `const v /*${argument.value}*/ = new Int8Array(this.mmu.${readerFn}(this.pc))`.trim();
              })
              .otherwise(() => {
                return `const v /*${argument.value}*/ = this.mmu.${readerFn}(this.pc);`.trim();
              });
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
              const addr = new Uint16Array(1)
              const a8 = new Int8Array(this.mmu.readByte(${fromAddr}))
              addr.set([0xFF00 + a8[0]])
              this.mmu.${writerFn}(addr, v)
              `;
            } else {
              return `
                    const addr${label} = this.mmu.readWord(${fromAddr})
                    this.mmu.${writerFn}(addr, v)
                    `.trim();
            }
          } else {
            if (["sp", "pc"].includes(argument.value)) {
              return `
              this.${argument.value} = v
              `.trim();
            } else {
              return `
              this.${argument.value}.set(v)
              `.trim();
            }
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
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        `;
      })
      .with("1", () => {
        return `this.flag_z[7] = 1`;
      })
      .with("0", () => {
        return `this.flag_z[7] = 0;`;
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
        return `this.flag_n[6] = 1`;
      })
      .with("0", () => {
        return `this.flag_n[6] = 0;`;
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
        return `this.flag_h[5] = 1`;
      })
      .with("0", () => {
        return `this.flag_h[5] = 0;`;
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
        return `this.flag_c[4] = 1`;
      })
      .with("0", () => {
        return `this.flag_c[4] = 0;`;
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
    const parsedInstruction = this.parser.parse(instructionData.mnemonic)
      .statements[0];

    if (!parsedInstruction.left && !parsedInstruction.right) {
      return `return {
        v: 0x00,
        cycles: ${instructionData.cycles}
      }`;
    }
    return `return {
      v,
      cycles: ${instructionData.cycles}
    }`;
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

  private printCPInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    const res = this.a[0] - v[0]
    ${this.printInstructionCommon(instructionData, "res")}
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

  private printDECInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    v[0] -= 1
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

  private printSUBInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );

    const code = Printer.trimString(`
    ${this.printReader(parsedInstruction.left)}
    this.a[0] -= v[0]
    ${this.printInstructionCommon(instructionData, `this.a[0]`)}
    `);
    return code;
  }

  private printJRInstruction(parsedInstruction: Statement) {
    const instructionData = this.getInstructionData(
      parsedInstruction.opcode,
      false
    );
    if (parsedInstruction.left && parsedInstruction.right) {
      // JR with jump
      const flagMap: Record<string, string> = {
        z: "this.flag_z[7] === 0",
        nz: "this.flag_z[7] !== 0",
        c: "this.flag_c[4] === 0",
        nc: "this.flag_c[4] !== 0",
      };

      const code = Printer.trimString(`
        if (${flagMap[parsedInstruction.left.left.value]}) {
          ${this.printReader(parsedInstruction.right)}
          ${this.printPCIncrement(instructionData)}
          this.pc[0] += v[0]
          return {
            v,
            cycles: ${instructionData?.cycles_jump}
          }
        } else {
          ${this.printPCIncrement(instructionData)}
          return {
            v: 0x00,
            cycles: ${instructionData?.cycles}
          }
        }
        `);
      return code;
    } else {
      // JR with no jump
      const code = Printer.trimString(`
        ${this.printReader(parsedInstruction.left)}
        this.pc[0] += v[0]
        ${this.printInstructionCommon(instructionData)}
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
        z: "this.flag_z[7] === 0",
        nz: "this.flag_z[7] !== 0",
        c: "this.flag_c[4] === 0",
        nc: "this.flag_c[4] !== 0",
      };

      const code = Printer.trimString(`
        if (${flagMap[parsedInstruction.left.left.value]}) {
            this.sp = this.pc
            return {
              v: 0x00,
              cycles: ${instructionData?.cycles_jump}
            }
        } else {
            ${this.printPCIncrement(instructionData)}
            ${this.printFlagHandling(instructionData)}
            return {
              v: 0x00,
              cycles: ${instructionData?.cycles}
            }
        }
        `);
      return code;
    } else {
      // CALL with no jump
      const code = Printer.trimString(`
        this.sp = this.pc
        ${this.printPCIncrement(instructionData)}
        return {
          v: this.sp,
          cycles: ${instructionData?.cycles}
        }
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
    const res = (v[0] >> ${parsedInstruction.left.left.value}) & 1
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
    return {
      v: 0x00,
      cycles: ${instructionData.cycles}
    }
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
        return `
        ${this.printInstructionCommon(instructionData)}
        `;
      })
      .with("di", () => {
        return `
          this.is_master_interrupt_enabled = true
          ${this.printInstructionCommon(instructionData)}
        `;
      })
      .with("ei", () => {
        return `
          this.is_master_interrupt_enabled = false
          ${this.printInstructionCommon(instructionData)}
        `;
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
      .with("cp", () => {
        return this.printCPInstruction(parsedInstruction);
      })
      .with("xor", () => {
        return this.printXORInstruction(parsedInstruction);
      })
      .with("inc", () => {
        return this.printINCInstruction(parsedInstruction);
      })
      .with("dec", () => {
        return this.printDECInstruction(parsedInstruction);
      })
      .with("add", () => {
        return this.printADDInstruction(parsedInstruction);
      })
      .with("sub", () => {
        return this.printSUBInstruction(parsedInstruction);
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
