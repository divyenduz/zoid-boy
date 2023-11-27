import { describe, test, expect } from "vitest";

import { Printer } from "./Printer";

describe("Printer - LD tests", () => {
  test("LD BC,d16", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD BC,d16", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD BC,d16
      .with(0x01, ()=>{
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.bc = v
      })"`)
    );
  });

  test("LD B,d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD B,d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD B,d8
      .with(0x06, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.b = v
      })"`)
    );
  });

  test("LD (BC),A", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (BC),A", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (BC),A
      .with(0x02, ()=>{
        const v = this.a
        const addr = this.mmu.readWord(this.bc)
        this.mmu.writeByte(addr, v)
      })"`)
    );
  });

  test("LD (a16),SP", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (a16),SP", false);
    // TODO: this should be writeWord eventually
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (a16),SP
      .with(0x08, ()=>{
        const v = this.sp
        const addr /*a16*/ = this.mmu.readWord(this.pc)
        this.mmu.writeByte(addr, v)
      })"`)
    );
  });

  test("LD A,(DE)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(DE)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(DE)
      .with(0x1a, ()=>{
        const v = this.mmu.readByte(this.de)
        this.a = v
      })"`)
    );
  });

  test("LD (HL+),A", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (HL+),A", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (HL+),A
      .with(0x22, ()=>{
        const v = this.a
        const addr = this.mmu.readWord(this.hl)
        this.mmu.writeByte(addr, v)
        this.hl[0] += 1
      })"`)
    );
  });

  test("LD A,(HL+)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(HL+)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(HL+)
      .with(0x2a, ()=>{
        const v = this.mmu.readByte(this.hl)
        this.a = v
        this.hl[0] += 1
      })"`)
    );
  });

  test("LD B,H", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD B,H", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD B,H
      .with(0x44, ()=>{
        const v = this.h
        this.b = v
      })"`)
    );
  });

  test("LD (C),A", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (C),A", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (C),A
      .with(0xe2, ()=>{
        const v = this.a
        const addr = this.mmu.readWord(this.c)
        this.mmu.writeByte(addr, v)
      })"`)
    );
  });

  test("LD (a16),A", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (a16),A", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (a16),A
      .with(0xea, ()=>{
        const v = this.a
        const addr /*a16*/ = this.mmu.readWord(this.pc)
        this.mmu.writeByte(addr, v)
      })"`)
    );
  });

  test("LD A,(C)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(C)", false);
    // TODO: readByte needs c to be a 16 bit address i.e. 0xff00 + c
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(C)
      .with(0xf2, ()=>{
        const addr = new Uint16Array(0xFF00 + this.c[0])
        const v = this.mmu.readByte(addr)
        this.a = v
      })"`)
    );
  });

  test("LD HL,SP+r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD HL,SP+r8", false);
    // TODO: not 100% correct yet, don't think V can be written to HL, and SP[0] + part might be incorrect too
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD HL,SP+r8
      .with(0xf8, ()=>{
        const v = this.sp[0] + ((0x80 ^ r8) - 0x80)
        this.hl = v
      })"`)
    );
  });

  test("LD SP,HL", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD SP,HL", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD SP,HL
      .with(0xf9, ()=>{
        const v = this.hl
        this.sp = v
      })"`)
    );
  });

  test("LD A,(a16)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(a16)", false);
    // TODO: this should be readByte
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(a16)
      .with(0xfa, ()=>{
        const v /*a16*/ = this.mmu.readWord(this.pc);
        this.a = v
      })"`)
    );
  });
});
