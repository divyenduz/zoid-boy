import "./helpers/TypedArrays";
import { CPU } from "./CPU/CPU";
import { MMU } from "./MMU/MMU";
import fs from "fs";

async function main() {
  const bootrom = await fs.readFileSync("./bootroms/gb_bios.bin");
  const rom = await fs.readFileSync("./roms/Tetris.gb");

  const mmu = new MMU(new Uint8Array(bootrom), rom);
  const cpu = new CPU(mmu);

  while (true) {
    const instruction = mmu.readByte(cpu.PC);
    // console.log({ PC: `${cpu.PC}` }, { instruction: `${instruction}` });
    cpu.PC[0] += 1;
    cpu.execute(instruction);

    if (checkBootLoadSuccess(cpu)) {
      console.log("BOOTROM LOAD SUCCESS");
    }
  }
}

function checkBootLoadSuccess(cpu: CPU) {
  return (
    cpu.A[0] === 0x01 &&
    cpu.F[0] === 0xb0 &&
    cpu.B[0] === 0x00 &&
    cpu.C[0] === 0x13 &&
    cpu.D[0] === 0x00 &&
    cpu.E[0] === 0xd8 &&
    cpu.H[0] === 0x01 &&
    cpu.L[0] === 0x4d &&
    cpu.SP[0] === 0xfffe &&
    cpu.PC[0] === 0x100
  );
}

main();
