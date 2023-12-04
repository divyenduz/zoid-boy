import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - DEC tests", () => {
  test("DEC BC", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("DEC BC", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// DEC BC
      .with(0x0b, ()=>{
        const v = this.bc
        v[0] -= 1
        return 8
      })"`)
    );
  });

  test("DEC B", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("DEC B", false);
    // TODO: implement H flag
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// DEC B
      .with(0x05, ()=>{
        const v = this.b
        v[0] -= 1
        if (v[0] === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        return 4
      })"`)
    );
  });

  test("DEC (HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("DEC (HL)", false);
    // TODO: implement H flag
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// DEC (HL)
      .with(0x35, ()=>{
        const v = this.mmu.readByte(this.hl)
        v[0] -= 1
        if (v[0] === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        return 12
      })"`)
    );
  });
});
