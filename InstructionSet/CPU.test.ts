import { vi, describe, test, expect } from "vitest";
import { CPU } from "./CPU.js";
import { MMU } from "../MMU/MMU.js";
import fs from "fs";
import { beforeEach } from "node:test";
//@ts-expect-error
import Uint1Array from "uint1array";

const bootrom = fs.readFileSync("./bootroms/gb_bios.bin");
const rom = fs.readFileSync("./roms/Tetris.gb");

describe("CPU", () => {
  beforeEach(() => {
    vi.mock("uint1array", async (importOriginal) => {
      return {
        default: Uint8Array,
      };
    });
  });
  test("BIT 7,H", () => {
    const mmu = new MMU(bootrom, rom);
    const cpu = new CPU(mmu);

    cpu.h[0] = 0b10000000;
    const { v } = cpu.executeCB(new Uint8Array([0x7c]));
    expect(v[0]).toBe(128); // 0b10000000
  });

  test("BIT 7,H", () => {
    const mmu = new MMU(bootrom, rom);
    const cpu = new CPU(mmu);

    cpu.h[0] = 0b00000000;
    const { v } = cpu.executeCB(new Uint8Array([0x7c]));
    expect(v[0]).toBe(0); // 0b00000000
  });
});
