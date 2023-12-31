import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - CALL tests", () => {
  test("CALL NZ,a16", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CALL NZ,a16", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CALL NZ,a16
      .with(0xc4, ()=>{
        if (this.flag_z[7] !== 0) {
          this.sp = this.pc
          return {
            v: 0x00,
            cycles: 24
          }
        } else {
          this.pc[0] += 2;
          return {
            v: 0x00,
            cycles: 12
          }
        }
      })"`)
    );
  });

  test("CALL a16", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CALL a16", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CALL a16
      .with(0xcd, ()=>{
        this.sp = this.pc
        this.pc[0] += 2;
        return {
          v: this.sp,
          cycles: 24
        }
      })"`)
    );
  });

  test("CALL C,a16", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("CALL C,a16", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// CALL C,a16
      .with(0xdc, ()=>{
        if (this.flag_c[4] === 0) {
        this.sp = this.pc
          return {
            v: 0x00,
            cycles: 24
          }
        } else {
          this.pc[0] += 2;
          console.log('Implement C flag')
          return {
            v: 0x00,
            cycles: 12
          }
        }
      })"`)
    );
  });
});
