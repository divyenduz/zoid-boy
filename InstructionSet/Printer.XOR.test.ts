import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - XOR tests", () => {
  test("XOR C", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("XOR C", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// XOR C
      .with(0xa9, ()=>{
        const v = this.c
        this.a ^= v
      })"`)
    );
  });

  test("XOR (HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("XOR (HL)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// XOR (HL)
      .with(0xae, ()=>{
        const v = this.mmu.readByte(this.hl)
        this.a ^= v
      })"`)
    );
  });

  test("XOR d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("XOR d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// XOR d8
      .with(0xee, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.a ^= v
      })"`)
    );
  });
});
