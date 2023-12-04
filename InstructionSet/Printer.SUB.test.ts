import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - SUB tests", () => {
  test("SUB B", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("SUB B", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// SUB B
      .with(0x90, ()=>{
        const v = this.b
        this.a[0] -= v[0]
        if (this.a[0] === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        console.log('Implement C flag')
        return 4
      })"`)
    );
  });

  test("SUB (HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("SUB (HL)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// SUB (HL)
      .with(0x96, ()=>{
        const v = this.mmu.readByte(this.hl)
        this.a[0] -= v[0]
        if (this.a[0] === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        console.log('Implement C flag')
        return 8
      })"`)
    );
  });

  test("SUB d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("SUB d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// SUB d8
      .with(0xd6, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.a[0] -= v[0]
        this.pc[0] += 1;
        if (this.a[0] === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        console.log('Implement C flag')
        return 8
      })"`)
    );
  });
});
