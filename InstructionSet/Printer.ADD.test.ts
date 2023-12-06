import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - ADD tests", () => {
  test("ADD HL,BC", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("ADD HL,BC", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// ADD HL,BC
      .with(0x09, ()=>{
        const v = this.bc
        this.hl[0] += v[0]
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("ADD A,B", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("ADD A,B", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// ADD A,B
      .with(0x80, ()=>{
        const v = this.b
        this.a[0] += v[0]
        if (this.a[0] === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 4
        }
      })"`)
    );
  });

  test("ADD A,(HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("ADD A,(HL)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// ADD A,(HL)
      .with(0x86, ()=>{
        const v = this.mmu.readByte(this.hl)
        this.a[0] += v[0]
        if (this.a[0] === 0) {
          this.flag_z[0] = 1
        }
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("ADD A,d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("ADD A,d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// ADD A,d8
      .with(0xc6, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.a[0] += v[0]
        this.pc[0] += 1;
        if (this.a[0] === 0) {
        this.flag_z[0] = 1
        }
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("ADD SP,r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("ADD SP,r8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// ADD SP,r8
      .with(0xe8, ()=>{
        const v /*r8*/ = this.mmu.readByte(this.pc);
        v[0] = ((0x80 ^ v[0]) - 0x80)
        this.sp[0] += v[0]
        this.pc[0] += 1;
        this.flag_z[0] = 0;
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 16
        }
      })"`)
    );
  });
});
