import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - NOP, DI, EI tests", () => {
  test("NOP", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("NOP", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// NOP
      .with(0x00, ()=>{
      return {
        v: 0x00,
        cycles: 4
      }
      })"`)
    );
  });

  test("DI", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("DI", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// DI
      .with(0xf3, ()=>{
        this.is_master_interrupt_enabled = true
        return {
          v: 0x00,
          cycles: 4
        }
      })"`)
    );
  });

  test("EI", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("EI", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// EI
      .with(0xfb, ()=>{
        this.is_master_interrupt_enabled = false
        return {
          v: 0x00,
          cycles: 4
        }
      })"`)
    );
  });
});
