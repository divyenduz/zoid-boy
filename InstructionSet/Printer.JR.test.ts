import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - JR tests", () => {
  test("JR r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("JR r8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// JR r8
      .with(0x18, ()=>{
        const v /*r8*/ = this.mmu.readByte(this.pc);
        v[0] = ((0x80 ^ v[0]) - 0x80)
        this.pc[0] += v[0]
        this.pc[0] += 1;
        return 12
      })"`)
    );
  });

  test("JR NZ,r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("JR NZ,r8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// JR NZ,r8
      .with(0x20, ()=>{
        if (!(this.flag_z[0])) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = ((0x80 ^ v[0]) - 0x80)
          this.pc[0] += v[0]
          return 12
        } else {
          this.pc[0] += 1;
          return 8
        }
      })"`)
    );
  });

  test("JR C,r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("JR C,r8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// JR C,r8
      .with(0x38, ()=>{
        if (this.flag_c[3]) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = ((0x80 ^ v[0]) - 0x80)
          this.pc[0] += v[0]
          return 12
        } else {
          this.pc[0] += 1;
          return 8
        }
      })"`)
    );
  });
});
