import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - LD tests", () => {
  test("LDH (a8),A", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LDH (a8),A", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LDH (a8),A
      .with(0xe0, ()=>{
        const v = this.a
        const addr = new Uint16Array(0xFF00 + this.pc[0])
        this.mmu.writeByte(addr, v)
        this.pc[0] += 1;
        return 12
      })"`)
    );
  });

  test("LDH A,(a8)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LDH A,(a8)", false);
    // TODO: this is technically incorrect, we need to write to FF00 + A,
    // but can move on for now as the above instruction (e0) is used in the boot rom
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LDH A,(a8)
      .with(0xf0, ()=>{
        const v /*a8*/ = this.mmu.readByte(this.pc);
        this.a = v
        this.pc[0] += 1;
        return 12
      })"`)
    );
  });
});
