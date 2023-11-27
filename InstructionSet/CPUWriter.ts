import fs from "fs";

import { InstructionSet } from "./InstructionSet";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB";

import { format } from "prettier";
import { Parser } from "./Parser";
import { match, P } from "ts-pattern";
import { BinaryExpression, UnaryExpression } from "./AST";

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

  write() {
    const parser = new Parser();
    const executeFns = Object.values(InstructionSet).map((instruction) => {
      const { opcode, mnemonic, length, cycles, Z, N, H, C } = instruction;
      const opcodeHex = this.numberToHex(opcode);

      const program = parser.parse(mnemonic);
      const parsedInstruction = program.statements[0];
      const debugOpcode = parsedInstruction.opcode === 0x20;
      if (debugOpcode) {
        console.log(parsedInstruction);
      }

      let statements: string[] = [];

      const impl = match(parsedInstruction.instruction)
        // TODO: this should be parsed as a single instruction called "prefix cb"
        .with("nop", () => {
          return ``;
        })
        .with("prefix", () => {
          return `this.prefix_cb = true;`;
        })
        .with("jr", () => {
          const { left, right } = parsedInstruction;
          const s: string[] = [];
          if (!left) {
            throw new Error(
              "Failed to find left argument, JR must have at least one argument"
            );
          }
          if (right) {
            const flagMap: Record<string, string> = {
              z: "this.z_flag[0]",
              nz: "!this.z_flag[0]",
              c: "this.c_flag[3]",
              nc: "!this.c_flag[3]",
            };

            const firstArgument = left.left;
            const secondArgument = right.left;

            // this is a conditional jump
            s.push(`console.log({flag: ${flagMap[firstArgument.value]}})`);
            s.push(`if (${flagMap[firstArgument.value]}) {`);
            s.push(
              `const ${secondArgument.value} = this.mmu.readByte(this.pc);`
            );
            if (secondArgument.value === "r8") {
              s.push(`const d8 = (0x80 ^ r8[0]) - 0x80`);
            }
            s.push(`console.log("jumping by", d8);`);
            s.push(`this.pc[0] += d8;`);
            s.push(`} else {`);
            s.push(`this.pc[0] += 1;`);
            s.push(`}`);
          } else {
            s.push(`const r8 = this.mmu.readByte(this.pc);`);
            s.push(`this.pc[0] += r8[0];`);
          }
          return s.join("\n");
        })
        .with("xor", () => {
          const { left, right } = parsedInstruction;
          if (!left) {
            throw new Error(
              "Failed to find left argument, XOR must have one argument"
            );
          }
          if (right) {
            throw new Error(
              "Found right argument, XOR must have only one argument"
            );
          }

          const argument = left.left;

          let s: string[] = [];
          const body = match(argument)
            .with(
              {
                addressType: "Address",
              },
              (argument) => {
                s.push(`const d8 = this.mmu.readByte(this.pc);`);
                s.push(`this.a[0] ^= d8[0];`);
              }
            )
            .with(
              {
                addressType: "Register",
                isIndirect: true,
              },
              (argument) => {
                s.push(
                  `this.a[0] ^= this.mmu.readByte(this.${argument.value})[0];`
                );
              }
            )
            .with(
              {
                addressType: "Register",
              },
              (argument) => {
                s.push(`this.a[0] ^= this.${argument.value}[0];`);
              }
            )

            .exhaustive();
          return s.join("\n");
        })
        .with("ld", () => {
          const { left, right } = parsedInstruction;
          if (!left || !right) {
            throw new Error(
              "Failed to find left or right argument, LD must have both"
            );
          }

          const firstArgument = left.left;
          const secondArgument = right.left;

          let s: string[] = [];
          const body = match({ left: firstArgument, right: secondArgument })
            // Left address - 8 bit
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: true,
                },
                right: {
                  addressType: "Address",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeByte(${left.value}, this.mmu.readByte(${right.value}));`
                );
              }
            )
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: true,
                },
                right: {
                  addressType: "Address",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeByte(${left.value}, this.mmu.readByte(${right.value}));`
                );
              }
            )

            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: true,
                },
                right: {
                  addressType: "Register",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeByte(${left.value}, this.${right.value});`
                );
              }
            )
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: true,
                },
                right: {
                  addressType: "Register",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeByte(${left.value}, this.${right.value});`
                );
              }
            )

            // Left address - 16 bit
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: false,
                },
                right: {
                  addressType: "Address",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeWord(${left.value}, this.mmu.readWord(${right.value}));`
                );
              }
            )
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: false,
                },
                right: {
                  addressType: "Address",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeWord(${left.value}, this.mmu.readWord(${right.value}));`
                );
              }
            )

            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: false,
                },
                right: {
                  addressType: "Register",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(`const a16 = this.mmu.readWord(this.pc);`);
                s.push(
                  `this.mmu.writeByte(this.mmu.readWord(a16), this.${right.value});`
                );
              }
            )
            .with(
              {
                left: {
                  addressType: "Address",
                  is8Bit: false,
                },
                right: {
                  addressType: "Register",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(`const a16 = this.mmu.readWord(this.${right.value});`);
                s.push(
                  `this.mmu.writeWord(${left.value}, this.${right.value});`
                );
              }
            )

            // Left register - 8 bit

            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: true,
                },
                right: {
                  addressType: "Address",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(`const d8 = this.mmu.readByte(this.pc);`);
                s.push(`this.${left.value} = d8;`);
              }
            )
            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: true,
                },
                right: {
                  addressType: "Address",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(`const a16 = this.mmu.readWord(this.pc);`);
                s.push(`this.${left.value} = this.mmu.readByte(a16);`);
              }
            )

            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: true,
                },
                right: {
                  addressType: "Register",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(`this.${left.value} = this.${right.value};`);
              }
            )
            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: true,
                },
                right: {
                  addressType: "Register",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.${left.value} = this.mmu.readByte(this.${right.value});`
                );
              }
            )

            // Left register - 16 bit
            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: false,
                },
                right: {
                  addressType: "Address",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(`const d8 = this.mmu.readByte(this.pc);`);
                s.push(`this.mmu.writeByte(this.mmu.readWord(this.hl), d8)`);
              }
            )
            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: false,
                },
                right: {
                  addressType: "Address",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(`const d16 = this.mmu.readWord(this.pc);`);
                s.push(`this.${left.value} = d16`);
              }
            )

            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: false,
                },
                right: {
                  addressType: "Register",
                  is8Bit: true,
                },
              },
              ({ left, right }) => {
                s.push(
                  `this.mmu.writeByte(this.mmu.readWord(this.${left.value}), this.${right.value});`
                );
              }
            )
            .with(
              {
                left: {
                  addressType: "Register",
                  is8Bit: false,
                },
                right: {
                  addressType: "Register",
                  is8Bit: false,
                },
              },
              ({ left, right }) => {
                s.push(`this.${left.value} = this.${right.value};`);
              }
            )
            .exhaustive();

          return s.join("\n");
        })
        .otherwise(() => {
          return `throw new Error("Instruction '${mnemonic}', '${opcodeHex}' not implemented");`;
        });

      if (debugOpcode) {
        console.log(impl);
      }

      statements.push(`// ${mnemonic}`);
      statements.push(`.with(0x${opcodeHex}, () => {`);
      statements.push(impl);

      // Note: handle unary operations like INC and DEC
      match(parsedInstruction.left)
        .with(P.instanceOf(UnaryExpression), (expression) => {
          const operator = match(expression.operator)
            .with("PLUS", () => "+")
            .with("MINUS", () => "-")
            .otherwise(() => {
              throw new Error(`Unknown operator ${expression.operator}`);
            });

          statements.push(`this.${expression.left.value}[0] ${operator}= 1`);
        })
        .otherwise(() => {});

      // Note: length-1 because we bump pc as soon as we read the instruction
      statements.push(`this.pc[0] += ${length - 1};`);
      if (opcode !== 0xcb) {
        statements.push(`this.prefix_cb = false;`);
      }
      statements.push(`return ${cycles}`);
      statements.push(`})`);

      if (debugOpcode) {
        console.log(statements.join("\n"));
      }

      return statements.join("\n");
    });

    const code = [
      `match(instruction[0])`,
      ...executeFns,
      '.otherwise(() => { throw new Error( `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"` ); });',
    ];

    return this.template.replace(`// {{ADD_EXECUTE_MATCH}}`, code.join("\n"));
  }

  writeMnemonics() {
    const mnemonics = Object.values(InstructionSet).map((instruction) => {
      const { mnemonic } = instruction;

      return mnemonic;
    });
    return mnemonics.join("\n");
  }
}

async function main() {
  const writer = new CPUWriter();
  const generatedCPU = writer.write();
  const formattedGeneratedCPU = await format(generatedCPU, {
    parser: "typescript",
  });
  fs.writeFileSync("./InstructionSet/CPU.ts", formattedGeneratedCPU);
}

main();
