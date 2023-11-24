import fs from "fs";

import { InstructionSet } from "./InstructionSet";
import { InstructionSetPrefixCB } from "./InstructionSetPrefixCB";

import { format } from "prettier";
import { Parser } from "./Parser";
import { match } from "ts-pattern";
import { MemoryType } from "./Tokenizer";

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

      const parsedInstruction = parser.parse(mnemonic);
      const debugOpcode = parsedInstruction[0].opcode === 0xcb;
      if (debugOpcode) {
        console.log(parsedInstruction);
      }

      let statements: string[] = [];

      const impl = match(parsedInstruction[0].instruction)
        // TODO: this should be parsed as a single instruction called "prefix cb"
        .with("prefix", () => {
          return `this.prefix_cb = true;`;
        })
        .with("ld", () => {
          const { left, right } = parsedInstruction[0];
          if (!left || !right) {
            throw new Error(
              "Failed to find left or right argument, LD must have both"
            );
          }

          let s: string[] = [];
          const body = match({ left, right })
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
