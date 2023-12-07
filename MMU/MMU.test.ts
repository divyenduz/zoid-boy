import { describe, expect, test } from "vitest";
import { MMU } from "./MMU.js";
import fs from "fs";
import "../helpers/TypedArrays.js";

const bootrom = fs.readFileSync("./bootroms/gb_bios.bin");
const rom = fs.readFileSync("./roms/Tetris.gb");

describe("MMU tests", () => {
  test("can read byte at 0x0001", () => {
    const addr = new Uint8Array([0x01, 0x00]); // 0x0001
    const byteToRead = new Uint8Array([0xfe]);
    const mmu = new MMU(bootrom, rom);
    const byte = mmu.readByte(addr);
    expect(byte).toStrictEqual(byteToRead);
  });

  test("can write byte at 0x0001", () => {
    const addr = new Uint8Array([0x01, 0x00]); // 0x0001
    const byteToWrite = new Uint8Array([0xff]);
    const mmu = new MMU(bootrom, rom);
    mmu.writeByte(addr, byteToWrite);
    const byte = mmu.readByte(addr);
    expect(byte).toStrictEqual(byteToWrite);
  });

  test("can read word at 0x0001", () => {
    const addr = new Uint8Array([0x01, 0x00]); // 0x0001
    // const wordToRead = new Uint8Array([0xfe, 0xff]);
    const wordToRead = new Uint16Array([0xfffe]); // Endian swapped
    const mmu = new MMU(bootrom, rom);
    const word = mmu.readWord(addr);
    expect(word).toStrictEqual(wordToRead);
  });

  test("can write word at 0x0001", () => {
    const addr = new Uint8Array([0x01, 0x00]); // 0x0001
    // const wordToWrite = new Uint8Array([0xff, 0xff]);
    const wordToWrite = new Uint16Array([0xffff]);
    const mmu = new MMU(bootrom, rom);
    mmu.writeWord(addr, wordToWrite);
    const word = mmu.readWord(addr);
    expect(word).toStrictEqual(wordToWrite);
  });

  test("can read byte at 0x0A01", () => {
    const addr = new Uint8Array([0x01, 0x0a]); // 0x0A01
    // hexdump -C roms/Tetris.gb | grep 0a00 | pbcopy
    // 00000a00  05 28 03 19 18 fa cd 98  0a af e0 cc 3e 55 e0 01  |.(..........>U..|
    const byteToRead = new Uint8Array([0x28]);
    const mmu = new MMU(bootrom, rom);
    const byte = mmu.readByte(addr);
    expect(byte).toStrictEqual(byteToRead);
  });

  test("can write byte at 0x0A01", () => {
    const addr = new Uint8Array([0x01, 0x0a]); // 0x0A01
    const byteToWrite = new Uint8Array([0xff]);
    const mmu = new MMU(bootrom, rom);
    mmu.writeByte(addr, byteToWrite);
    const byte = mmu.readByte(addr);
    expect(byte).toStrictEqual(byteToWrite);
  });

  test("can read word at 0x0A01", () => {
    const addr = new Uint8Array([0x01, 0x0a]); // 0x0A01
    // hexdump -C roms/Tetris.gb | grep 0a00 | pbcopy
    // 00000a00  05 28 03 19 18 fa cd 98  0a af e0 cc 3e 55 e0 01  |.(..........>U..|
    // const wordToRead = new Uint8Array([0x28, 0x03]);
    const wordToRead = new Uint16Array([0x0328]);
    const mmu = new MMU(bootrom, rom);
    console.log(`${addr}`);
    const word = mmu.readWord(addr);
    expect(word).toStrictEqual(wordToRead);
  });

  test("can write word at 0x0A01", () => {
    const addr = new Uint8Array([0x01, 0x0a]); // 0x0A01
    // const wordToWrite = new Uint8Array([0xff, 0xff]);
    const wordToWrite = new Uint16Array([0xffff]);
    const mmu = new MMU(bootrom, rom);
    mmu.writeWord(addr, wordToWrite);
    const word = mmu.readWord(addr);
    expect(word).toStrictEqual(wordToWrite);
  });
});
