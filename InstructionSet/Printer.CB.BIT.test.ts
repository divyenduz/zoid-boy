import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer CB - BIT tests", () => {
  test("BIT 0,(HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("BIT 0,(HL)", true);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// BIT 0,(HL)
      .with(0x46, ()=>{
        const v = this.mmu.readByte(this.hl)
        const res = v[0] & (1 << 0)
        this.prefix_cb = false;
        this.pc[0] -= 1; // Compensate for CB call
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 0;
        this.flag_h[2] = 1
        return {
          v,
          cycles: 16
        }
      })"`)
    );
  });

  test("BIT 7,H", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("BIT 7,H", true);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// BIT 7,H
      .with(0x7c, ()=>{
        const v = this.h
        const res = v[0] & (1 << 7)
        this.prefix_cb = false;
        this.pc[0] -= 1; // Compensate for CB call
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 0;
        this.flag_h[2] = 1
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });
});
