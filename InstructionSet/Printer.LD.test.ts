import { describe, test, expect } from "vitest";

import { Printer } from "./Printer.js";

describe("Printer - LD tests", () => {
  test("LD BC,d16", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD BC,d16", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD BC,d16
      .with(0x01, ()=>{
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.bc = v
        this.pc[0] += 2;
        return {
          v,
          cycles: 12
        }
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
        this.pc[0] += 1;
        return {
          v,
          cycles: 8
        }
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
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("LD (a16),SP", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (a16),SP", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (a16),SP
      .with(0x08, ()=>{
        const v = this.sp
        const addr /*a16*/ = this.mmu.readWord(this.pc)
        this.mmu.writeWord(addr, v)
        this.pc[0] += 2;
        return {
          v,
          cycles: 20
        }
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
        return {
          v,
          cycles: 8
        }
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
        return {
          v,
          cycles: 8
        }
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
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("LD (HL),d8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD (HL),d8", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD (HL),d8
      .with(0x36, ()=>{
        const v /*d8*/ = this.mmu.readByte(this.pc);
        const addr = this.mmu.readWord(this.hl)
        this.mmu.writeByte(addr, v)
        this.pc[0] += 1;
        return {
          v,
          cycles: 12
        }
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
        return {
          v,
          cycles: 4
        }
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
        const addr = new Uint16Array(0xFF00 + this.c[0])
        this.mmu.writeByte(addr, v)
        return {
          v,
          cycles: 8
        }
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
        this.pc[0] += 2;
        return {
          v,
          cycles: 16
        }
      })"`)
    );
  });

  test("LD A,(C)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(C)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(C)
      .with(0xf2, ()=>{
        const addr = new Uint16Array(0xFF00 + this.c[0])
        const v = this.mmu.readByte(addr)
        this.a = v
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("LD HL,SP+r8", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD HL,SP+r8", false);
    // TODO: H, C flag omitted for now
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD HL,SP+r8
      .with(0xf8, ()=>{
        const r8 = this.mmu.readByte(this.pc);
        const v = new Uint16Array(this.sp[0] + ((0x80 ^ r8[0]) - 0x80));
        this.hl = v
        this.pc[0] += 1;
        this.flag_z[0] = 0;
        this.flag_n[1] = 0;
        console.log('Implement H flag')
        console.log('Implement C flag')
        return {
          v,
          cycles: 12
        }
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
        return {
          v,
          cycles: 8
        }
      })"`)
    );
  });

  test("LD A,(a16)", () => {
    const printer = new Printer();
    const impl = printer.printInstruction("LD A,(a16)", false);
    expect(impl).toMatchInlineSnapshot(
      Printer.trimString(`"// LD A,(a16)
      .with(0xfa, ()=>{
        const v /*a16*/ = this.mmu.readByte(this.pc);
        this.a = v
        this.pc[0] += 2;
        return {
          v,
          cycles: 16
        }
      })"`)
    );
  });
});
