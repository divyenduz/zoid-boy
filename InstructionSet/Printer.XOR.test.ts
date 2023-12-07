import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - XOR tests", () => {
  test("XOR C", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("XOR C", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// XOR C
      .with(0xa9, ()=>{
        const v = this.c
        this.a[0] ^= v[0]
        if (this.a[0] === 0) {
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        this.flag_n[6] = 0;
        this.flag_h[5] = 0;
        this.flag_c[4] = 0;
        return {
          v,
          cycles: 4
        }
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
        this.a[0] ^= v[0]
        if (this.a[0] === 0) {
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        this.flag_n[6] = 0;
        this.flag_h[5] = 0;
        this.flag_c[4] = 0;
        return {
          v,
          cycles: 8
        }
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
        this.a[0] ^= v[0]
        this.pc[0] += 1;
        if (this.a[0] === 0) {
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        this.flag_n[6] = 0;
        this.flag_h[5] = 0;
        this.flag_c[4] = 0;
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });
});
