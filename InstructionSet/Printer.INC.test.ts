import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - INC tests", () => {
  test("INC BC", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("INC BC", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// INC BC
      .with(0x03, ()=>{
        const v = this.bc
        v[0] += 1
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("INC B", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("INC B", false);
    // TODO: implement H flag
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// INC B
      .with(0x04, ()=>{
        const v = this.b
        v[0] += 1
        if (v[0] === 0) {
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        this.flag_n[6] = 0;
        console.log('Implement H flag')
        return {
          v,
          cycles: 4
        }
      })"`)
    );
  });

  test("INC (HL)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("INC (HL)", false);
    // TODO: implement H flag
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// INC (HL)
      .with(0x34, ()=>{
        const v = this.mmu.readByte(this.hl)
        v[0] += 1
        if (v[0] === 0) {
          this.flag_z[7] = 0
        } else {
          this.flag_z[7] = 1
        }
        this.flag_n[6] = 0;
        console.log('Implement H flag')
        return {
          v,
          cycles: 12
        }
      })"`)
    );
  });
});
