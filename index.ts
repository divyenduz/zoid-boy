import { match } from "ts-pattern";
import "./helpers/TypedArrays";
import { CPU } from "./InstructionSet/CPU.js";
import { InstructionSet } from "./InstructionSet/InstructionSet.js";
import { InstructionSetPrefixCB } from "./InstructionSet/InstructionSetPrefixCB.js";
import { MMU } from "./MMU/MMU.js";
import fs from "fs";
import chalk from "chalk";

async function main() {
  const bootrom = await fs.readFileSync("./bootroms/gb_bios.bin");
  const rom = await fs.readFileSync("./roms/Tetris.gb");

  const mmu = new MMU(new Uint8Array(bootrom), rom);
  const cpu = new CPU(mmu);

  let cycles = 0;
  while (true) {
    cycles += 1;
    // if (cycles > 200000) {
    //   console.error("BOOTROM LOAD FAILURE");
    //   console.log({ cycles });
    //   console.log(logExpectedState(cpu));
    //   process.exit(1);
    // }
    if (cpu.pc[0] === 0x0030) {
      console.log("BREAK");
      console.log({ cycles });
      logExpectedState(cpu);
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
    const pcCopy = new Uint16Array(cpu.pc);
    cpu.pc[0] += 1;

    const r = match(cpu.prefix_cb)
      .with(true, () => {
        return cpu.executeCB(instruction);
      })
      .with(false, () => {
        return cpu.execute(instruction);
      })
      .exhaustive();

    if (cpu.hl[0] > 0x7fff && cpu.hl[0] < 0x9fff && cycles < 30000) {
    } else {
      logState(cpu);
      console.log(
        `${pcCopy}: ${instructionData.mnemonic} ${chalk.red(
          r?.v
        )} (${instruction}${cpu.prefix_cb ? "_CB" : ""})`
      );
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
      a: `${cpu.a}`,
      f: `${cpu.f}`,
      b: `${cpu.b}`,
      c: `${cpu.c}`,
      d: `${cpu.d}`,
      e: `${cpu.e}`,
      h: `${cpu.h}`,
      l: `${cpu.l}`,
      sp: `${cpu.sp}`,
      pc: `${cpu.pc}`,
    },
  ]);
}

function logExpectedState(cpu: CPU) {
  console.table([
    {
      register: "a",
      value: `${cpu.a}`,
      expected: "0x01",
      success: cpu.a[0] === 0x01,
    },
    {
      register: "f",
      value: `${cpu.f}`,
      expected: "0xb0",
      success: cpu.f[0] === 0xb0,
    },
    {
      register: "b",
      value: `${cpu.b}`,
      expected: "0x00",
      success: cpu.b[0] === 0x00,
    },
    {
      register: "c",
      value: `${cpu.c}`,
      expected: "0x13",
      success: cpu.c[0] === 0x13,
    },
    {
      register: "d",
      value: `${cpu.d}`,
      expected: "0x00",
      success: cpu.d[0] === 0x00,
    },
    {
      register: "e",
      value: `${cpu.e}`,
      expected: "0xd8",
      success: cpu.e[0] === 0xd8,
    },
    {
      register: "h",
      value: `${cpu.h}`,
      expected: "0x01",
      success: cpu.h[0] === 0x01,
    },
    {
      register: "l",
      value: `${cpu.l}`,
      expected: "0x4d",
      success: cpu.l[0] === 0x4d,
    },
    {
      register: "sp",
      value: `${cpu.sp}`,
      expected: "0xfffe",
      success: cpu.sp[0] === 0xfffe,
    },
    {
      register: "pc",
      value: `${cpu.pc}`,
      expected: "0x100",
      success: cpu.pc[0] === 0x100,
    },
  ]);
}

main();
