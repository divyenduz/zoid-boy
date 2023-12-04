import "./helpers/TypedArrays";
import { CPU } from "./InstructionSet/CPU";
import { InstructionSet } from "./InstructionSet/InstructionSet";
import { InstructionSetPrefixCB } from "./InstructionSet/InstructionSetPrefixCB";
import { MMU } from "./MMU/MMU";
import fs from "fs";

async function main() {
  const bootrom = await fs.readFileSync("./bootroms/gb_bios.bin");
  const rom = await fs.readFileSync("./roms/Tetris.gb");

  const mmu = new MMU(new Uint8Array(bootrom), rom);
  const cpu = new CPU(mmu);

  let cycles = 0;
  while (true) {
    cycles += 1;
    if (cycles > 100) {
      console.error("BOOTROM LOAD FAILURE");
      console.log({ cycles });
      console.log(logState(cpu));
      process.exit(1);
    }
    const instruction = mmu.readByte(cpu.pc);
    const instructionData = Object.values(
      cpu.prefix_cb ? InstructionSetPrefixCB : InstructionSet
    ).find(
      (instructionFromSet) => instructionFromSet.opcode === instruction[0]
    );
    if (!instructionData) {
      throw new Error(`Instruction "${instruction}" not found.`);
    }
    console.log(
      `${cpu.pc}: ${instructionData.mnemonic} (${instruction}${
        cpu.prefix_cb ? "_CB" : ""
      })`
    );
    cpu.pc[0] += 1;
    if (cpu.prefix_cb) {
      cpu.executeCB(instruction);
    } else {
      cpu.execute(instruction);
    }

    if (checkBootLoadSuccess(cpu)) {
      console.log("BOOTROM LOAD SUCCESS");
      process.exit(0);
    }
  }
}

function checkBootLoadSuccess(cpu: CPU) {
  // logState(cpu);
  return (
    cpu.a[0] === 0x01 &&
    cpu.f[0] === 0xb0 &&
    cpu.b[0] === 0x00 &&
    cpu.c[0] === 0x13 &&
    cpu.d[0] === 0x00 &&
    cpu.e[0] === 0xd8 &&
    cpu.h[0] === 0x01 &&
    cpu.l[0] === 0x4d &&
    cpu.sp[0] === 0xfffe &&
    cpu.pc[0] === 0x100
  );
}

function logState(cpu: CPU) {
  console.table([
    {
      register: "a",
      value: `${cpu.a}`,
      expected: "01",
      success: cpu.a[0] === 0x01,
    },
    {
      register: "f",
      value: `${cpu.f}`,
      expected: "b0",
      success: cpu.f[0] === 0xb0,
    },
    {
      register: "b",
      value: `${cpu.b}`,
      expected: "00",
      success: cpu.b[0] === 0x00,
    },
    {
      register: "c",
      value: `${cpu.c}`,
      expected: "13",
      success: cpu.c[0] === 0x13,
    },
    {
      register: "d",
      value: `${cpu.d}`,
      expected: "00",
      success: cpu.d[0] === 0x00,
    },
    {
      register: "e",
      value: `${cpu.e}`,
      expected: "d8",
      success: cpu.e[0] === 0xd8,
    },
    {
      register: "h",
      value: `${cpu.h}`,
      expected: "01",
      success: cpu.h[0] === 0x01,
    },
    {
      register: "l",
      value: `${cpu.l}`,
      expected: "4d",
      success: cpu.l[0] === 0x4d,
    },
    {
      register: "sp",
      value: `${cpu.sp}`,
      expected: "fffe",
      success: cpu.sp[0] === 0xfffe,
    },
    {
      register: "pc",
      value: `${cpu.pc}`,
      expected: "100",
      success: cpu.pc[0] === 0x100,
    },
  ]);
}

main();
