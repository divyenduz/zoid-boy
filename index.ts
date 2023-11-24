import "./helpers/TypedArrays";
import { CPU } from "./InstructionSet/CPU";
import { MMU } from "./MMU/MMU";
import fs from "fs";

async function main() {
  const bootrom = await fs.readFileSync("./bootroms/gb_bios.bin");
  const rom = await fs.readFileSync("./roms/Tetris.gb");

  const mmu = new MMU(new Uint8Array(bootrom), rom);
  const cpu = new CPU(mmu);

  while (true) {
    const instruction = mmu.readByte(cpu.pc);
    cpu.pc[0] += 1;
    cpu.execute(instruction);

    if (checkBootLoadSuccess(cpu)) {
      console.log("BOOTROM LOAD SUCCESS");
      process.exit(0);
    }
  }
}

function checkBootLoadSuccess(cpu: CPU) {
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

main();
