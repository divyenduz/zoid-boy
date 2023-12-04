import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - C tests", () => {
  test("CP L", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CP L", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CP L
      .with(0xbd, ()=>{
        const v = this.l
        const res = this.a[0] - v[0]
        if (res === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        console.log('Implement C flag')
        return 4
      })"`)
    );
  });

  test("CP (HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CP (HL)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CP (HL)
      .with(0xbe, ()=>{
        const v = this.mmu.readByte(this.hl)
        const res = this.a[0] - v[0]
        if (res === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 1
        console.log('Implement H flag')
        console.log('Implement C flag')
        return 8
      })"`)
    );
  });

  test("CP d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CP d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CP d8
      .with(0xfe, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        const res = this.a[0] - v[0]
        this.pc[0] += 1;
        if (res === 0) {
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
