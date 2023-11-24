import { MMU } from "../MMU/MMU";
import { match } from "ts-pattern";
//@ts-expect-error
import Uint1Array from "uint1array";

/**
 * The Z80 is an 8-bit chip, so all the internal workings operate on one byte at a time;
 *
 */
export class CPU {
  _REGISTER_MEMORY: ArrayBuffer = new ArrayBuffer(8);

  a: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 0, 1);
  // Skip 1 byte
  d: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 2, 1);
  b: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 3, 1);
  c: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 4, 1);
  e: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 5, 1);
  l: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 6, 1);
  h: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 7, 1);
  bc: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 2, 1);
  de: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 4, 1);
  hl: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 6, 1);

  /**
   * Zero (0x80): Set if the last operation produced a result of 0;
   * Operation (0x40): Set if the last operation was a subtraction;
   * Half-carry (0x20): Set if, in the result of the last operation, the lower half of the byte overflowed past 15;
   * Carry (0x10): Set if the last operation produced a result over 255 (for additions) or under 0 (for subtractions);
   */
  f: Uint8Array = new Uint1Array(8);

  pc: Uint16Array = new Uint16Array(1);
  sp: Uint16Array = new Uint16Array(1);
  m: Uint8Array = new Uint8Array(1);
  t: Uint8Array = new Uint8Array(1);
  clock_m: Uint8Array = new Uint8Array(1);
  clock_t: Uint8Array = new Uint8Array(1);

  previousInstruction: Uint8Array = new Uint8Array(1);

  constructor(private mmu: MMU) {}

  execute(instruction: Uint8Array) {
    match(instruction[0])
      .with(0x0, () => {
        throw new Error("Instruction not implemented");
      })

      // LD BC,d16
      .with(0x1, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.bc = d16;

        this.pc[0] += 3;
        return 12;
      })
      // LD (BC),A
      .with(0x2, () => {
        this.mmu.writeByte(this.mmu.readWord(this.bc), this.a);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x5, () => {
        throw new Error("Instruction not implemented");
      })

      // LD B,d8
      .with(0x6, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.b = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x7, () => {
        throw new Error("Instruction not implemented");
      })

      // LD (a16),SP
      .with(0x8, () => {
        const a16 = this.mmu.readWord(this.sp);
        this.mmu.writeWord(a16, this.sp);

        this.pc[0] += 3;
        return 20;
      })

      .with(0x9, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,(BC)
      .with(0xa, () => {
        this.a = this.mmu.readByte(this.bc);

        this.pc[0] += 1;
        return 8;
      })

      .with(0xb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd, () => {
        throw new Error("Instruction not implemented");
      })

      // LD C,d8
      .with(0xe, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.c = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0xf, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x10, () => {
        throw new Error("Instruction not implemented");
      })

      // LD DE,d16
      .with(0x11, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.de = d16;

        this.pc[0] += 3;
        return 12;
      })
      // LD (DE),A
      .with(0x12, () => {
        this.mmu.writeByte(this.mmu.readWord(this.de), this.a);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x13, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x14, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x15, () => {
        throw new Error("Instruction not implemented");
      })

      // LD D,d8
      .with(0x16, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.d = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x17, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x18, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x19, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,(DE)
      .with(0x1a, () => {
        this.a = this.mmu.readByte(this.de);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x1b, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x1c, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x1d, () => {
        throw new Error("Instruction not implemented");
      })

      // LD E,d8
      .with(0x1e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.e = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x1f, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x20, () => {
        throw new Error("Instruction not implemented");
      })

      // LD HL,d16
      .with(0x21, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.hl = d16;

        this.pc[0] += 3;
        return 12;
      })
      // LD (HL+),A
      .with(0x22, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x23, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x24, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x25, () => {
        throw new Error("Instruction not implemented");
      })

      // LD H,d8
      .with(0x26, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.h = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x27, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x28, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x29, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,(HL+)
      .with(0x2a, () => {
        this.a = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x2b, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x2c, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x2d, () => {
        throw new Error("Instruction not implemented");
      })

      // LD L,d8
      .with(0x2e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.l = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x2f, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x30, () => {
        throw new Error("Instruction not implemented");
      })

      // LD SP,d16
      .with(0x31, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.sp = d16;

        this.pc[0] += 3;
        return 12;
      })
      // LD (HL-),A
      .with(0x32, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x33, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x34, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x35, () => {
        throw new Error("Instruction not implemented");
      })

      // LD (HL),d8
      .with(0x36, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.mmu.writeByte(this.mmu.readWord(this.hl), d8);

        this.pc[0] += 2;
        return 12;
      })

      .with(0x37, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x38, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x39, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,(HL-)
      .with(0x3a, () => {
        this.a = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x3b, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x3c, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x3d, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,d8
      .with(0x3e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.a = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x3f, () => {
        throw new Error("Instruction not implemented");
      })

      // LD B,B
      .with(0x40, () => {
        this.b = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,C
      .with(0x41, () => {
        this.b = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,D
      .with(0x42, () => {
        this.b = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,E
      .with(0x43, () => {
        this.b = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,H
      .with(0x44, () => {
        this.b = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,L
      .with(0x45, () => {
        this.b = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD B,(HL)
      .with(0x46, () => {
        this.b = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD B,A
      .with(0x47, () => {
        this.b = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,B
      .with(0x48, () => {
        this.c = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,C
      .with(0x49, () => {
        this.c = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,D
      .with(0x4a, () => {
        this.c = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,E
      .with(0x4b, () => {
        this.c = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,H
      .with(0x4c, () => {
        this.c = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,L
      .with(0x4d, () => {
        this.c = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD C,(HL)
      .with(0x4e, () => {
        this.c = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD C,A
      .with(0x4f, () => {
        this.c = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,B
      .with(0x50, () => {
        this.d = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,C
      .with(0x51, () => {
        this.d = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,D
      .with(0x52, () => {
        this.d = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,E
      .with(0x53, () => {
        this.d = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,H
      .with(0x54, () => {
        this.d = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,L
      .with(0x55, () => {
        this.d = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD D,(HL)
      .with(0x56, () => {
        this.d = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD D,A
      .with(0x57, () => {
        this.d = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,B
      .with(0x58, () => {
        this.e = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,C
      .with(0x59, () => {
        this.e = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,D
      .with(0x5a, () => {
        this.e = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,E
      .with(0x5b, () => {
        this.e = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,H
      .with(0x5c, () => {
        this.e = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,L
      .with(0x5d, () => {
        this.e = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD E,(HL)
      .with(0x5e, () => {
        this.e = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD E,A
      .with(0x5f, () => {
        this.e = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,B
      .with(0x60, () => {
        this.h = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,C
      .with(0x61, () => {
        this.h = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,D
      .with(0x62, () => {
        this.h = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,E
      .with(0x63, () => {
        this.h = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,H
      .with(0x64, () => {
        this.h = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,L
      .with(0x65, () => {
        this.h = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD H,(HL)
      .with(0x66, () => {
        this.h = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD H,A
      .with(0x67, () => {
        this.h = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,B
      .with(0x68, () => {
        this.l = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,C
      .with(0x69, () => {
        this.l = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,D
      .with(0x6a, () => {
        this.l = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,E
      .with(0x6b, () => {
        this.l = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,H
      .with(0x6c, () => {
        this.l = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,L
      .with(0x6d, () => {
        this.l = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD L,(HL)
      .with(0x6e, () => {
        this.l = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD L,A
      .with(0x6f, () => {
        this.l = this.a;

        this.pc[0] += 1;
        return 4;
      })
      // LD (HL),B
      .with(0x70, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.b);

        this.pc[0] += 1;
        return 8;
      })
      // LD (HL),C
      .with(0x71, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.c);

        this.pc[0] += 1;
        return 8;
      })
      // LD (HL),D
      .with(0x72, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.d);

        this.pc[0] += 1;
        return 8;
      })
      // LD (HL),E
      .with(0x73, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.e);

        this.pc[0] += 1;
        return 8;
      })
      // LD (HL),H
      .with(0x74, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.h);

        this.pc[0] += 1;
        return 8;
      })
      // LD (HL),L
      .with(0x75, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.l);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x76, () => {
        throw new Error("Instruction not implemented");
      })

      // LD (HL),A
      .with(0x77, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);

        this.pc[0] += 1;
        return 8;
      })
      // LD A,B
      .with(0x78, () => {
        this.a = this.b;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,C
      .with(0x79, () => {
        this.a = this.c;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,D
      .with(0x7a, () => {
        this.a = this.d;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,E
      .with(0x7b, () => {
        this.a = this.e;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,H
      .with(0x7c, () => {
        this.a = this.h;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,L
      .with(0x7d, () => {
        this.a = this.l;

        this.pc[0] += 1;
        return 4;
      })
      // LD A,(HL)
      .with(0x7e, () => {
        this.a = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })
      // LD A,A
      .with(0x7f, () => {
        this.a = this.a;

        this.pc[0] += 1;
        return 4;
      })

      .with(0x80, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x81, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x82, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x83, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x84, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x85, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x86, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x87, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x88, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x89, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8a, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8b, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8c, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8d, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8e, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x8f, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x90, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x91, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x92, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x93, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x94, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x95, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x96, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x97, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x98, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x99, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9a, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9b, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9c, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9d, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9e, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0x9f, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa1, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa2, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa7, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa8, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xa9, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xaa, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xab, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xac, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xad, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xae, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xaf, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb1, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb2, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb7, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb8, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xb9, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xba, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xbb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xbc, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xbd, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xbe, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xbf, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc1, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc2, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc7, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc8, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xc9, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xca, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xcb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xcc, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xcd, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xce, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xcf, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd1, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd2, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd7, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd8, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xd9, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xda, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xdb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xdc, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xdd, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xde, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xdf, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe1, () => {
        throw new Error("Instruction not implemented");
      })

      // LD (C),A
      .with(0xe2, () => {
        this.c = this.a;

        this.pc[0] += 1;
        return 8;
      })

      .with(0xe3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe7, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe8, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xe9, () => {
        throw new Error("Instruction not implemented");
      })

      // LD (a16),A
      .with(0xea, () => {
        const a16 = this.mmu.readWord(this.pc);
        this.mmu.writeByte(this.mmu.readWord(a16), this.a);

        this.pc[0] += 3;
        return 16;
      })

      .with(0xeb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xec, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xed, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xee, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xef, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf0, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf1, () => {
        throw new Error("Instruction not implemented");
      })

      // LD A,(C)
      .with(0xf2, () => {
        this.a = this.c;

        this.pc[0] += 1;
        return 8;
      })

      .with(0xf3, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf4, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf5, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf6, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xf7, () => {
        throw new Error("Instruction not implemented");
      })

      // LD HL,SP+r8
      .with(0xf8, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.hl = d16;

        this.pc[0] += 2;
        return 12;
      })
      // LD SP,HL
      .with(0xf9, () => {
        this.sp = this.hl;

        this.pc[0] += 1;
        return 8;
      })
      // LD A,(a16)
      .with(0xfa, () => {
        const a16 = this.mmu.readWord(this.pc);
        this.a = this.mmu.readByte(a16);

        this.pc[0] += 3;
        return 16;
      })

      .with(0xfb, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xfc, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xfd, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xfe, () => {
        throw new Error("Instruction not implemented");
      })

      .with(0xff, () => {
        throw new Error("Instruction not implemented");
      })

      .otherwise(() => {
        throw new Error(
          `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"`,
        );
      });

    this.previousInstruction[0] = instruction[0];
  }
}
