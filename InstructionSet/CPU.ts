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

  f: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 0, 1);
  a: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 1, 1);
  // Skip 1 byte
  d: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 2, 1);
  b: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 3, 1);
  c: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 4, 1);
  e: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 5, 1);
  l: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 6, 1);
  h: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 7, 1);
  af: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 0, 1);
  bc: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 2, 1);
  de: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 4, 1);
  hl: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 6, 1);

  /**
   * Zero (0x80): Set if the last operation produced a result of 0;
   * Operation (0x40): Set if the last operation was a subtraction;
   * Half-carry (0x20): Set if, in the result of the last operation, the lower half of the byte overflowed past 15;
   * Carry (0x10): Set if the last operation produced a result over 255 (for additions) or under 0 (for subtractions);
   */
  flag_z: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 8th bit, [0] reversed because endian-ness
  flag_n: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 7th bit, [1] reversed because endian-ness
  flag_h: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 6th bit, [2] reversed because endian-ness
  flag_c: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 5th bit, [3] reversed because endian-ness

  pc: Uint16Array = new Uint16Array(1);
  sp: Uint16Array = new Uint16Array(1);

  prefix_cb: boolean = false;

  previousInstruction: Uint8Array = new Uint8Array(1);

  constructor(private mmu: MMU) {}

  execute(instruction: Uint8Array) {
    if (this.prefix_cb) {
      throw new Error(
        "Normal instruction should not be called with prefix_cb set",
      );
    }
    match(instruction[0])
      // NOP
      .with(0x00, () => {})
      // LD BC,d16
      .with(0x01, () => {
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.bc = v;
        this.pc[0] += 2;
        return 12;
      })
      // LD (BC),A
      .with(0x02, () => {
        const v = this.a;
        const addr = this.mmu.readWord(this.bc);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // INC BC
      .with(0x03, () => {
        throw new Error("Instruction 'INC BC', '03' not implemented");
      })
      // INC B
      .with(0x04, () => {
        throw new Error("Instruction 'INC B', '04' not implemented");
      })
      // DEC B
      .with(0x05, () => {
        throw new Error("Instruction 'DEC B', '05' not implemented");
      })
      // LD B,d8
      .with(0x06, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.b = v;
        this.pc[0] += 1;
        return 8;
      })
      // RLCA
      .with(0x07, () => {
        throw new Error("Instruction 'RLCA', '07' not implemented");
      })
      // LD (a16),SP
      .with(0x08, () => {
        const v = this.sp;
        const addr /*a16*/ = this.mmu.readWord(this.pc);
        this.mmu.writeWord(addr, v);
        this.pc[0] += 2;
        return 20;
      })
      // ADD HL,BC
      .with(0x09, () => {
        throw new Error("Instruction 'ADD HL,BC', '09' not implemented");
      })
      // LD A,(BC)
      .with(0x0a, () => {
        const v = this.mmu.readByte(this.bc);
        this.a = v;
        return 8;
      })
      // DEC BC
      .with(0x0b, () => {
        throw new Error("Instruction 'DEC BC', '0b' not implemented");
      })
      // INC C
      .with(0x0c, () => {
        throw new Error("Instruction 'INC C', '0c' not implemented");
      })
      // DEC C
      .with(0x0d, () => {
        throw new Error("Instruction 'DEC C', '0d' not implemented");
      })
      // LD C,d8
      .with(0x0e, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.c = v;
        this.pc[0] += 1;
        return 8;
      })
      // RRCA
      .with(0x0f, () => {
        throw new Error("Instruction 'RRCA', '0f' not implemented");
      })
      // STOP 0
      .with(0x10, () => {
        throw new Error("Instruction 'STOP 0', '10' not implemented");
      })
      // LD DE,d16
      .with(0x11, () => {
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.de = v;
        this.pc[0] += 2;
        return 12;
      })
      // LD (DE),A
      .with(0x12, () => {
        const v = this.a;
        const addr = this.mmu.readWord(this.de);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // INC DE
      .with(0x13, () => {
        throw new Error("Instruction 'INC DE', '13' not implemented");
      })
      // INC D
      .with(0x14, () => {
        throw new Error("Instruction 'INC D', '14' not implemented");
      })
      // DEC D
      .with(0x15, () => {
        throw new Error("Instruction 'DEC D', '15' not implemented");
      })
      // LD D,d8
      .with(0x16, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.d = v;
        this.pc[0] += 1;
        return 8;
      })
      // RLA
      .with(0x17, () => {
        throw new Error("Instruction 'RLA', '17' not implemented");
      })
      // JR r8
      .with(0x18, () => {
        const v /*r8*/ = this.mmu.readByte(this.pc);
        v[0] = (0x80 ^ v[0]) - 0x80;
        this.pc[0] += v[0];
      })
      // ADD HL,DE
      .with(0x19, () => {
        throw new Error("Instruction 'ADD HL,DE', '19' not implemented");
      })
      // LD A,(DE)
      .with(0x1a, () => {
        const v = this.mmu.readByte(this.de);
        this.a = v;
        return 8;
      })
      // DEC DE
      .with(0x1b, () => {
        throw new Error("Instruction 'DEC DE', '1b' not implemented");
      })
      // INC E
      .with(0x1c, () => {
        throw new Error("Instruction 'INC E', '1c' not implemented");
      })
      // DEC E
      .with(0x1d, () => {
        throw new Error("Instruction 'DEC E', '1d' not implemented");
      })
      // LD E,d8
      .with(0x1e, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.e = v;
        this.pc[0] += 1;
        return 8;
      })
      // RRA
      .with(0x1f, () => {
        throw new Error("Instruction 'RRA', '1f' not implemented");
      })
      // JR NZ,r8
      .with(0x20, () => {
        if (!this.flag_z[0]) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = (0x80 ^ v[0]) - 0x80;
          this.pc[0] += v[0];
          return 12;
        } else {
          this.pc[0] += 1;
          return 8;
        }
      })
      // LD HL,d16
      .with(0x21, () => {
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.hl = v;
        this.pc[0] += 2;
        return 12;
      })
      // LD (HL+),A
      .with(0x22, () => {
        const v = this.a;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        this.hl[0] += 1;
        return 8;
      })
      // INC HL
      .with(0x23, () => {
        throw new Error("Instruction 'INC HL', '23' not implemented");
      })
      // INC H
      .with(0x24, () => {
        throw new Error("Instruction 'INC H', '24' not implemented");
      })
      // DEC H
      .with(0x25, () => {
        throw new Error("Instruction 'DEC H', '25' not implemented");
      })
      // LD H,d8
      .with(0x26, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.h = v;
        this.pc[0] += 1;
        return 8;
      })
      // DAA
      .with(0x27, () => {
        throw new Error("Instruction 'DAA', '27' not implemented");
      })
      // JR Z,r8
      .with(0x28, () => {
        if (this.flag_z[0]) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = (0x80 ^ v[0]) - 0x80;
          this.pc[0] += v[0];
          return 12;
        } else {
          this.pc[0] += 1;
          return 8;
        }
      })
      // ADD HL,HL
      .with(0x29, () => {
        throw new Error("Instruction 'ADD HL,HL', '29' not implemented");
      })
      // LD A,(HL+)
      .with(0x2a, () => {
        const v = this.mmu.readByte(this.hl);
        this.a = v;
        this.hl[0] += 1;
        return 8;
      })
      // DEC HL
      .with(0x2b, () => {
        throw new Error("Instruction 'DEC HL', '2b' not implemented");
      })
      // INC L
      .with(0x2c, () => {
        throw new Error("Instruction 'INC L', '2c' not implemented");
      })
      // DEC L
      .with(0x2d, () => {
        throw new Error("Instruction 'DEC L', '2d' not implemented");
      })
      // LD L,d8
      .with(0x2e, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.l = v;
        this.pc[0] += 1;
        return 8;
      })
      // CPL
      .with(0x2f, () => {
        throw new Error("Instruction 'CPL', '2f' not implemented");
      })
      // JR NC,r8
      .with(0x30, () => {
        if (!this.flag_c[3]) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = (0x80 ^ v[0]) - 0x80;
          this.pc[0] += v[0];
          return 12;
        } else {
          this.pc[0] += 1;
          return 8;
        }
      })
      // LD SP,d16
      .with(0x31, () => {
        const v /*d16*/ = this.mmu.readWord(this.pc);
        this.sp = v;
        this.pc[0] += 2;
        return 12;
      })
      // LD (HL-),A
      .with(0x32, () => {
        const v = this.a;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        this.hl[0] -= 1;
        return 8;
      })
      // INC SP
      .with(0x33, () => {
        throw new Error("Instruction 'INC SP', '33' not implemented");
      })
      // INC (HL)
      .with(0x34, () => {
        throw new Error("Instruction 'INC (HL)', '34' not implemented");
      })
      // DEC (HL)
      .with(0x35, () => {
        throw new Error("Instruction 'DEC (HL)', '35' not implemented");
      })
      // LD (HL),d8
      .with(0x36, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        this.pc[0] += 1;
        return 12;
      })
      // SCF
      .with(0x37, () => {
        throw new Error("Instruction 'SCF', '37' not implemented");
      })
      // JR C,r8
      .with(0x38, () => {
        if (this.flag_c[3]) {
          const v /*r8*/ = this.mmu.readByte(this.pc);
          v[0] = (0x80 ^ v[0]) - 0x80;
          this.pc[0] += v[0];
          return 12;
        } else {
          this.pc[0] += 1;
          return 8;
        }
      })
      // ADD HL,SP
      .with(0x39, () => {
        throw new Error("Instruction 'ADD HL,SP', '39' not implemented");
      })
      // LD A,(HL-)
      .with(0x3a, () => {
        const v = this.mmu.readByte(this.hl);
        this.a = v;
        this.hl[0] -= 1;
        return 8;
      })
      // DEC SP
      .with(0x3b, () => {
        throw new Error("Instruction 'DEC SP', '3b' not implemented");
      })
      // INC A
      .with(0x3c, () => {
        throw new Error("Instruction 'INC A', '3c' not implemented");
      })
      // DEC A
      .with(0x3d, () => {
        throw new Error("Instruction 'DEC A', '3d' not implemented");
      })
      // LD A,d8
      .with(0x3e, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.a = v;
        this.pc[0] += 1;
        return 8;
      })
      // CCF
      .with(0x3f, () => {
        throw new Error("Instruction 'CCF', '3f' not implemented");
      })
      // LD B,B
      .with(0x40, () => {
        const v = this.b;
        this.b = v;
        return 4;
      })
      // LD B,C
      .with(0x41, () => {
        const v = this.c;
        this.b = v;
        return 4;
      })
      // LD B,D
      .with(0x42, () => {
        const v = this.d;
        this.b = v;
        return 4;
      })
      // LD B,E
      .with(0x43, () => {
        const v = this.e;
        this.b = v;
        return 4;
      })
      // LD B,H
      .with(0x44, () => {
        const v = this.h;
        this.b = v;
        return 4;
      })
      // LD B,L
      .with(0x45, () => {
        const v = this.l;
        this.b = v;
        return 4;
      })
      // LD B,(HL)
      .with(0x46, () => {
        const v = this.mmu.readByte(this.hl);
        this.b = v;
        return 8;
      })
      // LD B,A
      .with(0x47, () => {
        const v = this.a;
        this.b = v;
        return 4;
      })
      // LD C,B
      .with(0x48, () => {
        const v = this.b;
        this.c = v;
        return 4;
      })
      // LD C,C
      .with(0x49, () => {
        const v = this.c;
        this.c = v;
        return 4;
      })
      // LD C,D
      .with(0x4a, () => {
        const v = this.d;
        this.c = v;
        return 4;
      })
      // LD C,E
      .with(0x4b, () => {
        const v = this.e;
        this.c = v;
        return 4;
      })
      // LD C,H
      .with(0x4c, () => {
        const v = this.h;
        this.c = v;
        return 4;
      })
      // LD C,L
      .with(0x4d, () => {
        const v = this.l;
        this.c = v;
        return 4;
      })
      // LD C,(HL)
      .with(0x4e, () => {
        const v = this.mmu.readByte(this.hl);
        this.c = v;
        return 8;
      })
      // LD C,A
      .with(0x4f, () => {
        const v = this.a;
        this.c = v;
        return 4;
      })
      // LD D,B
      .with(0x50, () => {
        const v = this.b;
        this.d = v;
        return 4;
      })
      // LD D,C
      .with(0x51, () => {
        const v = this.c;
        this.d = v;
        return 4;
      })
      // LD D,D
      .with(0x52, () => {
        const v = this.d;
        this.d = v;
        return 4;
      })
      // LD D,E
      .with(0x53, () => {
        const v = this.e;
        this.d = v;
        return 4;
      })
      // LD D,H
      .with(0x54, () => {
        const v = this.h;
        this.d = v;
        return 4;
      })
      // LD D,L
      .with(0x55, () => {
        const v = this.l;
        this.d = v;
        return 4;
      })
      // LD D,(HL)
      .with(0x56, () => {
        const v = this.mmu.readByte(this.hl);
        this.d = v;
        return 8;
      })
      // LD D,A
      .with(0x57, () => {
        const v = this.a;
        this.d = v;
        return 4;
      })
      // LD E,B
      .with(0x58, () => {
        const v = this.b;
        this.e = v;
        return 4;
      })
      // LD E,C
      .with(0x59, () => {
        const v = this.c;
        this.e = v;
        return 4;
      })
      // LD E,D
      .with(0x5a, () => {
        const v = this.d;
        this.e = v;
        return 4;
      })
      // LD E,E
      .with(0x5b, () => {
        const v = this.e;
        this.e = v;
        return 4;
      })
      // LD E,H
      .with(0x5c, () => {
        const v = this.h;
        this.e = v;
        return 4;
      })
      // LD E,L
      .with(0x5d, () => {
        const v = this.l;
        this.e = v;
        return 4;
      })
      // LD E,(HL)
      .with(0x5e, () => {
        const v = this.mmu.readByte(this.hl);
        this.e = v;
        return 8;
      })
      // LD E,A
      .with(0x5f, () => {
        const v = this.a;
        this.e = v;
        return 4;
      })
      // LD H,B
      .with(0x60, () => {
        const v = this.b;
        this.h = v;
        return 4;
      })
      // LD H,C
      .with(0x61, () => {
        const v = this.c;
        this.h = v;
        return 4;
      })
      // LD H,D
      .with(0x62, () => {
        const v = this.d;
        this.h = v;
        return 4;
      })
      // LD H,E
      .with(0x63, () => {
        const v = this.e;
        this.h = v;
        return 4;
      })
      // LD H,H
      .with(0x64, () => {
        const v = this.h;
        this.h = v;
        return 4;
      })
      // LD H,L
      .with(0x65, () => {
        const v = this.l;
        this.h = v;
        return 4;
      })
      // LD H,(HL)
      .with(0x66, () => {
        const v = this.mmu.readByte(this.hl);
        this.h = v;
        return 8;
      })
      // LD H,A
      .with(0x67, () => {
        const v = this.a;
        this.h = v;
        return 4;
      })
      // LD L,B
      .with(0x68, () => {
        const v = this.b;
        this.l = v;
        return 4;
      })
      // LD L,C
      .with(0x69, () => {
        const v = this.c;
        this.l = v;
        return 4;
      })
      // LD L,D
      .with(0x6a, () => {
        const v = this.d;
        this.l = v;
        return 4;
      })
      // LD L,E
      .with(0x6b, () => {
        const v = this.e;
        this.l = v;
        return 4;
      })
      // LD L,H
      .with(0x6c, () => {
        const v = this.h;
        this.l = v;
        return 4;
      })
      // LD L,L
      .with(0x6d, () => {
        const v = this.l;
        this.l = v;
        return 4;
      })
      // LD L,(HL)
      .with(0x6e, () => {
        const v = this.mmu.readByte(this.hl);
        this.l = v;
        return 8;
      })
      // LD L,A
      .with(0x6f, () => {
        const v = this.a;
        this.l = v;
        return 4;
      })
      // LD (HL),B
      .with(0x70, () => {
        const v = this.b;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD (HL),C
      .with(0x71, () => {
        const v = this.c;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD (HL),D
      .with(0x72, () => {
        const v = this.d;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD (HL),E
      .with(0x73, () => {
        const v = this.e;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD (HL),H
      .with(0x74, () => {
        const v = this.h;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD (HL),L
      .with(0x75, () => {
        const v = this.l;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // HALT
      .with(0x76, () => {
        throw new Error("Instruction 'HALT', '76' not implemented");
      })
      // LD (HL),A
      .with(0x77, () => {
        const v = this.a;
        const addr = this.mmu.readWord(this.hl);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // LD A,B
      .with(0x78, () => {
        const v = this.b;
        this.a = v;
        return 4;
      })
      // LD A,C
      .with(0x79, () => {
        const v = this.c;
        this.a = v;
        return 4;
      })
      // LD A,D
      .with(0x7a, () => {
        const v = this.d;
        this.a = v;
        return 4;
      })
      // LD A,E
      .with(0x7b, () => {
        const v = this.e;
        this.a = v;
        return 4;
      })
      // LD A,H
      .with(0x7c, () => {
        const v = this.h;
        this.a = v;
        return 4;
      })
      // LD A,L
      .with(0x7d, () => {
        const v = this.l;
        this.a = v;
        return 4;
      })
      // LD A,(HL)
      .with(0x7e, () => {
        const v = this.mmu.readByte(this.hl);
        this.a = v;
        return 8;
      })
      // LD A,A
      .with(0x7f, () => {
        const v = this.a;
        this.a = v;
        return 4;
      })
      // ADD A,B
      .with(0x80, () => {
        throw new Error("Instruction 'ADD A,B', '80' not implemented");
      })
      // ADD A,C
      .with(0x81, () => {
        throw new Error("Instruction 'ADD A,C', '81' not implemented");
      })
      // ADD A,D
      .with(0x82, () => {
        throw new Error("Instruction 'ADD A,D', '82' not implemented");
      })
      // ADD A,E
      .with(0x83, () => {
        throw new Error("Instruction 'ADD A,E', '83' not implemented");
      })
      // ADD A,H
      .with(0x84, () => {
        throw new Error("Instruction 'ADD A,H', '84' not implemented");
      })
      // ADD A,L
      .with(0x85, () => {
        throw new Error("Instruction 'ADD A,L', '85' not implemented");
      })
      // ADD A,(HL)
      .with(0x86, () => {
        throw new Error("Instruction 'ADD A,(HL)', '86' not implemented");
      })
      // ADD A,A
      .with(0x87, () => {
        throw new Error("Instruction 'ADD A,A', '87' not implemented");
      })
      // ADC A,B
      .with(0x88, () => {
        throw new Error("Instruction 'ADC A,B', '88' not implemented");
      })
      // ADC A,C
      .with(0x89, () => {
        throw new Error("Instruction 'ADC A,C', '89' not implemented");
      })
      // ADC A,D
      .with(0x8a, () => {
        throw new Error("Instruction 'ADC A,D', '8a' not implemented");
      })
      // ADC A,E
      .with(0x8b, () => {
        throw new Error("Instruction 'ADC A,E', '8b' not implemented");
      })
      // ADC A,H
      .with(0x8c, () => {
        throw new Error("Instruction 'ADC A,H', '8c' not implemented");
      })
      // ADC A,L
      .with(0x8d, () => {
        throw new Error("Instruction 'ADC A,L', '8d' not implemented");
      })
      // ADC A,(HL)
      .with(0x8e, () => {
        throw new Error("Instruction 'ADC A,(HL)', '8e' not implemented");
      })
      // ADC A,A
      .with(0x8f, () => {
        throw new Error("Instruction 'ADC A,A', '8f' not implemented");
      })
      // SUB B
      .with(0x90, () => {
        throw new Error("Instruction 'SUB B', '90' not implemented");
      })
      // SUB C
      .with(0x91, () => {
        throw new Error("Instruction 'SUB C', '91' not implemented");
      })
      // SUB D
      .with(0x92, () => {
        throw new Error("Instruction 'SUB D', '92' not implemented");
      })
      // SUB E
      .with(0x93, () => {
        throw new Error("Instruction 'SUB E', '93' not implemented");
      })
      // SUB H
      .with(0x94, () => {
        throw new Error("Instruction 'SUB H', '94' not implemented");
      })
      // SUB L
      .with(0x95, () => {
        throw new Error("Instruction 'SUB L', '95' not implemented");
      })
      // SUB (HL)
      .with(0x96, () => {
        throw new Error("Instruction 'SUB (HL)', '96' not implemented");
      })
      // SUB A
      .with(0x97, () => {
        throw new Error("Instruction 'SUB A', '97' not implemented");
      })
      // SBC A,B
      .with(0x98, () => {
        throw new Error("Instruction 'SBC A,B', '98' not implemented");
      })
      // SBC A,C
      .with(0x99, () => {
        throw new Error("Instruction 'SBC A,C', '99' not implemented");
      })
      // SBC A,D
      .with(0x9a, () => {
        throw new Error("Instruction 'SBC A,D', '9a' not implemented");
      })
      // SBC A,E
      .with(0x9b, () => {
        throw new Error("Instruction 'SBC A,E', '9b' not implemented");
      })
      // SBC A,H
      .with(0x9c, () => {
        throw new Error("Instruction 'SBC A,H', '9c' not implemented");
      })
      // SBC A,L
      .with(0x9d, () => {
        throw new Error("Instruction 'SBC A,L', '9d' not implemented");
      })
      // SBC A,(HL)
      .with(0x9e, () => {
        throw new Error("Instruction 'SBC A,(HL)', '9e' not implemented");
      })
      // SBC A,A
      .with(0x9f, () => {
        throw new Error("Instruction 'SBC A,A', '9f' not implemented");
      })
      // AND B
      .with(0xa0, () => {
        throw new Error("Instruction 'AND B', 'a0' not implemented");
      })
      // AND C
      .with(0xa1, () => {
        throw new Error("Instruction 'AND C', 'a1' not implemented");
      })
      // AND D
      .with(0xa2, () => {
        throw new Error("Instruction 'AND D', 'a2' not implemented");
      })
      // AND E
      .with(0xa3, () => {
        throw new Error("Instruction 'AND E', 'a3' not implemented");
      })
      // AND H
      .with(0xa4, () => {
        throw new Error("Instruction 'AND H', 'a4' not implemented");
      })
      // AND L
      .with(0xa5, () => {
        throw new Error("Instruction 'AND L', 'a5' not implemented");
      })
      // AND (HL)
      .with(0xa6, () => {
        throw new Error("Instruction 'AND (HL)', 'a6' not implemented");
      })
      // AND A
      .with(0xa7, () => {
        throw new Error("Instruction 'AND A', 'a7' not implemented");
      })
      // XOR B
      .with(0xa8, () => {
        const v = this.b;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR C
      .with(0xa9, () => {
        const v = this.c;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR D
      .with(0xaa, () => {
        const v = this.d;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR E
      .with(0xab, () => {
        const v = this.e;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR H
      .with(0xac, () => {
        const v = this.h;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR L
      .with(0xad, () => {
        const v = this.l;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // XOR (HL)
      .with(0xae, () => {
        const v = this.mmu.readByte(this.hl);
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 8;
      })
      // XOR A
      .with(0xaf, () => {
        const v = this.a;
        this.a[0] ^= v[0];
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 4;
      })
      // OR B
      .with(0xb0, () => {
        throw new Error("Instruction 'OR B', 'b0' not implemented");
      })
      // OR C
      .with(0xb1, () => {
        throw new Error("Instruction 'OR C', 'b1' not implemented");
      })
      // OR D
      .with(0xb2, () => {
        throw new Error("Instruction 'OR D', 'b2' not implemented");
      })
      // OR E
      .with(0xb3, () => {
        throw new Error("Instruction 'OR E', 'b3' not implemented");
      })
      // OR H
      .with(0xb4, () => {
        throw new Error("Instruction 'OR H', 'b4' not implemented");
      })
      // OR L
      .with(0xb5, () => {
        throw new Error("Instruction 'OR L', 'b5' not implemented");
      })
      // OR (HL)
      .with(0xb6, () => {
        throw new Error("Instruction 'OR (HL)', 'b6' not implemented");
      })
      // OR A
      .with(0xb7, () => {
        throw new Error("Instruction 'OR A', 'b7' not implemented");
      })
      // CP B
      .with(0xb8, () => {
        throw new Error("Instruction 'CP B', 'b8' not implemented");
      })
      // CP C
      .with(0xb9, () => {
        throw new Error("Instruction 'CP C', 'b9' not implemented");
      })
      // CP D
      .with(0xba, () => {
        throw new Error("Instruction 'CP D', 'ba' not implemented");
      })
      // CP E
      .with(0xbb, () => {
        throw new Error("Instruction 'CP E', 'bb' not implemented");
      })
      // CP H
      .with(0xbc, () => {
        throw new Error("Instruction 'CP H', 'bc' not implemented");
      })
      // CP L
      .with(0xbd, () => {
        throw new Error("Instruction 'CP L', 'bd' not implemented");
      })
      // CP (HL)
      .with(0xbe, () => {
        throw new Error("Instruction 'CP (HL)', 'be' not implemented");
      })
      // CP A
      .with(0xbf, () => {
        throw new Error("Instruction 'CP A', 'bf' not implemented");
      })
      // RET NZ
      .with(0xc0, () => {
        throw new Error("Instruction 'RET NZ', 'c0' not implemented");
      })
      // POP BC
      .with(0xc1, () => {
        throw new Error("Instruction 'POP BC', 'c1' not implemented");
      })
      // JP NZ,a16
      .with(0xc2, () => {
        throw new Error("Instruction 'JP NZ,a16', 'c2' not implemented");
      })
      // JP a16
      .with(0xc3, () => {
        throw new Error("Instruction 'JP a16', 'c3' not implemented");
      })
      // CALL NZ,a16
      .with(0xc4, () => {
        throw new Error("Instruction 'CALL NZ,a16', 'c4' not implemented");
      })
      // PUSH BC
      .with(0xc5, () => {
        throw new Error("Instruction 'PUSH BC', 'c5' not implemented");
      })
      // ADD A,d8
      .with(0xc6, () => {
        throw new Error("Instruction 'ADD A,d8', 'c6' not implemented");
      })
      // RST 00H
      .with(0xc7, () => {
        throw new Error("Instruction 'RST 00H', 'c7' not implemented");
      })
      // RET Z
      .with(0xc8, () => {
        throw new Error("Instruction 'RET Z', 'c8' not implemented");
      })
      // RET
      .with(0xc9, () => {
        throw new Error("Instruction 'RET', 'c9' not implemented");
      })
      // JP Z,a16
      .with(0xca, () => {
        throw new Error("Instruction 'JP Z,a16', 'ca' not implemented");
      })
      // PREFIX CB
      .with(0xcb, () => {
        this.prefix_cb = true;
      })
      // CALL Z,a16
      .with(0xcc, () => {
        throw new Error("Instruction 'CALL Z,a16', 'cc' not implemented");
      })
      // CALL a16
      .with(0xcd, () => {
        throw new Error("Instruction 'CALL a16', 'cd' not implemented");
      })
      // ADC A,d8
      .with(0xce, () => {
        throw new Error("Instruction 'ADC A,d8', 'ce' not implemented");
      })
      // RST 08H
      .with(0xcf, () => {
        throw new Error("Instruction 'RST 08H', 'cf' not implemented");
      })
      // RET NC
      .with(0xd0, () => {
        throw new Error("Instruction 'RET NC', 'd0' not implemented");
      })
      // POP DE
      .with(0xd1, () => {
        throw new Error("Instruction 'POP DE', 'd1' not implemented");
      })
      // JP NC,a16
      .with(0xd2, () => {
        throw new Error("Instruction 'JP NC,a16', 'd2' not implemented");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // CALL NC,a16
      .with(0xd4, () => {
        throw new Error("Instruction 'CALL NC,a16', 'd4' not implemented");
      })
      // PUSH DE
      .with(0xd5, () => {
        throw new Error("Instruction 'PUSH DE', 'd5' not implemented");
      })
      // SUB d8
      .with(0xd6, () => {
        throw new Error("Instruction 'SUB d8', 'd6' not implemented");
      })
      // RST 10H
      .with(0xd7, () => {
        throw new Error("Instruction 'RST 10H', 'd7' not implemented");
      })
      // RET C
      .with(0xd8, () => {
        throw new Error("Instruction 'RET C', 'd8' not implemented");
      })
      // RETI
      .with(0xd9, () => {
        throw new Error("Instruction 'RETI', 'd9' not implemented");
      })
      // JP C,a16
      .with(0xda, () => {
        throw new Error("Instruction 'JP C,a16', 'da' not implemented");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // CALL C,a16
      .with(0xdc, () => {
        throw new Error("Instruction 'CALL C,a16', 'dc' not implemented");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // SBC A,d8
      .with(0xde, () => {
        throw new Error("Instruction 'SBC A,d8', 'de' not implemented");
      })
      // RST 18H
      .with(0xdf, () => {
        throw new Error("Instruction 'RST 18H', 'df' not implemented");
      })
      // LDH (a8),A
      .with(0xe0, () => {
        throw new Error("Instruction 'LDH (a8),A', 'e0' not implemented");
      })
      // POP HL
      .with(0xe1, () => {
        throw new Error("Instruction 'POP HL', 'e1' not implemented");
      })
      // LD (C),A
      .with(0xe2, () => {
        const v = this.a;
        const addr = new Uint16Array(0xff00 + this.c[0]);
        this.mmu.writeByte(addr, v);
        return 8;
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // PUSH HL
      .with(0xe5, () => {
        throw new Error("Instruction 'PUSH HL', 'e5' not implemented");
      })
      // AND d8
      .with(0xe6, () => {
        throw new Error("Instruction 'AND d8', 'e6' not implemented");
      })
      // RST 20H
      .with(0xe7, () => {
        throw new Error("Instruction 'RST 20H', 'e7' not implemented");
      })
      // ADD SP,r8
      .with(0xe8, () => {
        throw new Error("Instruction 'ADD SP,r8', 'e8' not implemented");
      })
      // JP (HL)
      .with(0xe9, () => {
        throw new Error("Instruction 'JP (HL)', 'e9' not implemented");
      })
      // LD (a16),A
      .with(0xea, () => {
        const v = this.a;
        const addr /*a16*/ = this.mmu.readWord(this.pc);
        this.mmu.writeByte(addr, v);
        this.pc[0] += 2;
        return 16;
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // XOR d8
      .with(0xee, () => {
        const v /*d8*/ = this.mmu.readByte(this.pc);
        this.a[0] ^= v[0];
        this.pc[0] += 1;
        if (this.a[0] === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 0;
        this.flag_c[0] = 0;
        return 8;
      })
      // RST 28H
      .with(0xef, () => {
        throw new Error("Instruction 'RST 28H', 'ef' not implemented");
      })
      // LDH A,(a8)
      .with(0xf0, () => {
        throw new Error("Instruction 'LDH A,(a8)', 'f0' not implemented");
      })
      // POP AF
      .with(0xf1, () => {
        throw new Error("Instruction 'POP AF', 'f1' not implemented");
      })
      // LD A,(C)
      .with(0xf2, () => {
        const addr = new Uint16Array(0xff00 + this.c[0]);
        const v = this.mmu.readByte(addr);
        this.a = v;
        return 8;
      })
      // DI
      .with(0xf3, () => {
        throw new Error("Instruction 'DI', 'f3' not implemented");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // PUSH AF
      .with(0xf5, () => {
        throw new Error("Instruction 'PUSH AF', 'f5' not implemented");
      })
      // OR d8
      .with(0xf6, () => {
        throw new Error("Instruction 'OR d8', 'f6' not implemented");
      })
      // RST 30H
      .with(0xf7, () => {
        throw new Error("Instruction 'RST 30H', 'f7' not implemented");
      })
      // LD HL,SP+r8
      .with(0xf8, () => {
        const r8 = this.mmu.readByte(this.pc);
        const v = new Uint16Array(this.sp[0] + ((0x80 ^ r8[0]) - 0x80));
        this.hl = v;
        this.pc[0] += 1;
        this.flag_z[0] = 0;
        this.flag_n[0] = 0;
        console.log("Implement H flag");
        console.log("Implement C flag");
        return 12;
      })
      // LD SP,HL
      .with(0xf9, () => {
        const v = this.hl;
        this.sp = v;
        return 8;
      })
      // LD A,(a16)
      .with(0xfa, () => {
        const v /*a16*/ = this.mmu.readByte(this.pc);
        this.a = v;
        this.pc[0] += 2;
        return 16;
      })
      // EI
      .with(0xfb, () => {
        throw new Error("Instruction 'EI', 'fb' not implemented");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Invalid instruction, should never be called");
      })
      // CP d8
      .with(0xfe, () => {
        throw new Error("Instruction 'CP d8', 'fe' not implemented");
      })
      // RST 38H
      .with(0xff, () => {
        throw new Error("Instruction 'RST 38H', 'ff' not implemented");
      })
      .otherwise(() => {
        throw new Error(
          `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"`,
        );
      });

    this.previousInstruction[0] = instruction[0];
  }

  executeCB(instruction: Uint8Array) {
    match(instruction[0])
      // RLC B
      .with(0x00, () => {
        throw new Error("Instruction 'RLC B', '00' not implemented");
      })
      // RLC C
      .with(0x01, () => {
        throw new Error("Instruction 'RLC C', '01' not implemented");
      })
      // RLC D
      .with(0x02, () => {
        throw new Error("Instruction 'RLC D', '02' not implemented");
      })
      // RLC E
      .with(0x03, () => {
        throw new Error("Instruction 'RLC E', '03' not implemented");
      })
      // RLC H
      .with(0x04, () => {
        throw new Error("Instruction 'RLC H', '04' not implemented");
      })
      // RLC L
      .with(0x05, () => {
        throw new Error("Instruction 'RLC L', '05' not implemented");
      })
      // RLC (HL)
      .with(0x06, () => {
        throw new Error("Instruction 'RLC (HL)', '06' not implemented");
      })
      // RLC A
      .with(0x07, () => {
        throw new Error("Instruction 'RLC A', '07' not implemented");
      })
      // RRC B
      .with(0x08, () => {
        throw new Error("Instruction 'RRC B', '08' not implemented");
      })
      // RRC C
      .with(0x09, () => {
        throw new Error("Instruction 'RRC C', '09' not implemented");
      })
      // RRC D
      .with(0x0a, () => {
        throw new Error("Instruction 'RRC D', '0a' not implemented");
      })
      // RRC E
      .with(0x0b, () => {
        throw new Error("Instruction 'RRC E', '0b' not implemented");
      })
      // RRC H
      .with(0x0c, () => {
        throw new Error("Instruction 'RRC H', '0c' not implemented");
      })
      // RRC L
      .with(0x0d, () => {
        throw new Error("Instruction 'RRC L', '0d' not implemented");
      })
      // RRC (HL)
      .with(0x0e, () => {
        throw new Error("Instruction 'RRC (HL)', '0e' not implemented");
      })
      // RRC A
      .with(0x0f, () => {
        throw new Error("Instruction 'RRC A', '0f' not implemented");
      })
      // RL B
      .with(0x10, () => {
        throw new Error("Instruction 'RL B', '10' not implemented");
      })
      // RL C
      .with(0x11, () => {
        throw new Error("Instruction 'RL C', '11' not implemented");
      })
      // RL D
      .with(0x12, () => {
        throw new Error("Instruction 'RL D', '12' not implemented");
      })
      // RL E
      .with(0x13, () => {
        throw new Error("Instruction 'RL E', '13' not implemented");
      })
      // RL H
      .with(0x14, () => {
        throw new Error("Instruction 'RL H', '14' not implemented");
      })
      // RL L
      .with(0x15, () => {
        throw new Error("Instruction 'RL L', '15' not implemented");
      })
      // RL (HL)
      .with(0x16, () => {
        throw new Error("Instruction 'RL (HL)', '16' not implemented");
      })
      // RL A
      .with(0x17, () => {
        throw new Error("Instruction 'RL A', '17' not implemented");
      })
      // RR B
      .with(0x18, () => {
        throw new Error("Instruction 'RR B', '18' not implemented");
      })
      // RR C
      .with(0x19, () => {
        throw new Error("Instruction 'RR C', '19' not implemented");
      })
      // RR D
      .with(0x1a, () => {
        throw new Error("Instruction 'RR D', '1a' not implemented");
      })
      // RR E
      .with(0x1b, () => {
        throw new Error("Instruction 'RR E', '1b' not implemented");
      })
      // RR H
      .with(0x1c, () => {
        throw new Error("Instruction 'RR H', '1c' not implemented");
      })
      // RR L
      .with(0x1d, () => {
        throw new Error("Instruction 'RR L', '1d' not implemented");
      })
      // RR (HL)
      .with(0x1e, () => {
        throw new Error("Instruction 'RR (HL)', '1e' not implemented");
      })
      // RR A
      .with(0x1f, () => {
        throw new Error("Instruction 'RR A', '1f' not implemented");
      })
      // SLA B
      .with(0x20, () => {
        throw new Error("Instruction 'SLA B', '20' not implemented");
      })
      // SLA C
      .with(0x21, () => {
        throw new Error("Instruction 'SLA C', '21' not implemented");
      })
      // SLA D
      .with(0x22, () => {
        throw new Error("Instruction 'SLA D', '22' not implemented");
      })
      // SLA E
      .with(0x23, () => {
        throw new Error("Instruction 'SLA E', '23' not implemented");
      })
      // SLA H
      .with(0x24, () => {
        throw new Error("Instruction 'SLA H', '24' not implemented");
      })
      // SLA L
      .with(0x25, () => {
        throw new Error("Instruction 'SLA L', '25' not implemented");
      })
      // SLA (HL)
      .with(0x26, () => {
        throw new Error("Instruction 'SLA (HL)', '26' not implemented");
      })
      // SLA A
      .with(0x27, () => {
        throw new Error("Instruction 'SLA A', '27' not implemented");
      })
      // SRA B
      .with(0x28, () => {
        throw new Error("Instruction 'SRA B', '28' not implemented");
      })
      // SRA C
      .with(0x29, () => {
        throw new Error("Instruction 'SRA C', '29' not implemented");
      })
      // SRA D
      .with(0x2a, () => {
        throw new Error("Instruction 'SRA D', '2a' not implemented");
      })
      // SRA E
      .with(0x2b, () => {
        throw new Error("Instruction 'SRA E', '2b' not implemented");
      })
      // SRA H
      .with(0x2c, () => {
        throw new Error("Instruction 'SRA H', '2c' not implemented");
      })
      // SRA L
      .with(0x2d, () => {
        throw new Error("Instruction 'SRA L', '2d' not implemented");
      })
      // SRA (HL)
      .with(0x2e, () => {
        throw new Error("Instruction 'SRA (HL)', '2e' not implemented");
      })
      // SRA A
      .with(0x2f, () => {
        throw new Error("Instruction 'SRA A', '2f' not implemented");
      })
      // SWAP B
      .with(0x30, () => {
        throw new Error("Instruction 'SWAP B', '30' not implemented");
      })
      // SWAP C
      .with(0x31, () => {
        throw new Error("Instruction 'SWAP C', '31' not implemented");
      })
      // SWAP D
      .with(0x32, () => {
        throw new Error("Instruction 'SWAP D', '32' not implemented");
      })
      // SWAP E
      .with(0x33, () => {
        throw new Error("Instruction 'SWAP E', '33' not implemented");
      })
      // SWAP H
      .with(0x34, () => {
        throw new Error("Instruction 'SWAP H', '34' not implemented");
      })
      // SWAP L
      .with(0x35, () => {
        throw new Error("Instruction 'SWAP L', '35' not implemented");
      })
      // SWAP (HL)
      .with(0x36, () => {
        throw new Error("Instruction 'SWAP (HL)', '36' not implemented");
      })
      // SWAP A
      .with(0x37, () => {
        throw new Error("Instruction 'SWAP A', '37' not implemented");
      })
      // SRL B
      .with(0x38, () => {
        throw new Error("Instruction 'SRL B', '38' not implemented");
      })
      // SRL C
      .with(0x39, () => {
        throw new Error("Instruction 'SRL C', '39' not implemented");
      })
      // SRL D
      .with(0x3a, () => {
        throw new Error("Instruction 'SRL D', '3a' not implemented");
      })
      // SRL E
      .with(0x3b, () => {
        throw new Error("Instruction 'SRL E', '3b' not implemented");
      })
      // SRL H
      .with(0x3c, () => {
        throw new Error("Instruction 'SRL H', '3c' not implemented");
      })
      // SRL L
      .with(0x3d, () => {
        throw new Error("Instruction 'SRL L', '3d' not implemented");
      })
      // SRL (HL)
      .with(0x3e, () => {
        throw new Error("Instruction 'SRL (HL)', '3e' not implemented");
      })
      // SRL A
      .with(0x3f, () => {
        throw new Error("Instruction 'SRL A', '3f' not implemented");
      })
      // BIT 0,B
      .with(0x40, () => {
        const v = this.b;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,C
      .with(0x41, () => {
        const v = this.c;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,D
      .with(0x42, () => {
        const v = this.d;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,E
      .with(0x43, () => {
        const v = this.e;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,H
      .with(0x44, () => {
        const v = this.h;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,L
      .with(0x45, () => {
        const v = this.l;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 0,(HL)
      .with(0x46, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 0,A
      .with(0x47, () => {
        const v = this.a;
        const res = v[0] & (1 << 0);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,B
      .with(0x48, () => {
        const v = this.b;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,C
      .with(0x49, () => {
        const v = this.c;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,D
      .with(0x4a, () => {
        const v = this.d;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,E
      .with(0x4b, () => {
        const v = this.e;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,H
      .with(0x4c, () => {
        const v = this.h;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,L
      .with(0x4d, () => {
        const v = this.l;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 1,(HL)
      .with(0x4e, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 1,A
      .with(0x4f, () => {
        const v = this.a;
        const res = v[0] & (1 << 1);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,B
      .with(0x50, () => {
        const v = this.b;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,C
      .with(0x51, () => {
        const v = this.c;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,D
      .with(0x52, () => {
        const v = this.d;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,E
      .with(0x53, () => {
        const v = this.e;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,H
      .with(0x54, () => {
        const v = this.h;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,L
      .with(0x55, () => {
        const v = this.l;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 2,(HL)
      .with(0x56, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 2,A
      .with(0x57, () => {
        const v = this.a;
        const res = v[0] & (1 << 2);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,B
      .with(0x58, () => {
        const v = this.b;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,C
      .with(0x59, () => {
        const v = this.c;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,D
      .with(0x5a, () => {
        const v = this.d;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,E
      .with(0x5b, () => {
        const v = this.e;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,H
      .with(0x5c, () => {
        const v = this.h;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,L
      .with(0x5d, () => {
        const v = this.l;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 3,(HL)
      .with(0x5e, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 3,A
      .with(0x5f, () => {
        const v = this.a;
        const res = v[0] & (1 << 3);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,B
      .with(0x60, () => {
        const v = this.b;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,C
      .with(0x61, () => {
        const v = this.c;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,D
      .with(0x62, () => {
        const v = this.d;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,E
      .with(0x63, () => {
        const v = this.e;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,H
      .with(0x64, () => {
        const v = this.h;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,L
      .with(0x65, () => {
        const v = this.l;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 4,(HL)
      .with(0x66, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 4,A
      .with(0x67, () => {
        const v = this.a;
        const res = v[0] & (1 << 4);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,B
      .with(0x68, () => {
        const v = this.b;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,C
      .with(0x69, () => {
        const v = this.c;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,D
      .with(0x6a, () => {
        const v = this.d;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,E
      .with(0x6b, () => {
        const v = this.e;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,H
      .with(0x6c, () => {
        const v = this.h;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,L
      .with(0x6d, () => {
        const v = this.l;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 5,(HL)
      .with(0x6e, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 5,A
      .with(0x6f, () => {
        const v = this.a;
        const res = v[0] & (1 << 5);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,B
      .with(0x70, () => {
        const v = this.b;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,C
      .with(0x71, () => {
        const v = this.c;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,D
      .with(0x72, () => {
        const v = this.d;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,E
      .with(0x73, () => {
        const v = this.e;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,H
      .with(0x74, () => {
        const v = this.h;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,L
      .with(0x75, () => {
        const v = this.l;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 6,(HL)
      .with(0x76, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 6,A
      .with(0x77, () => {
        const v = this.a;
        const res = v[0] & (1 << 6);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,B
      .with(0x78, () => {
        const v = this.b;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,C
      .with(0x79, () => {
        const v = this.c;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,D
      .with(0x7a, () => {
        const v = this.d;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,E
      .with(0x7b, () => {
        const v = this.e;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,H
      .with(0x7c, () => {
        const v = this.h;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,L
      .with(0x7d, () => {
        const v = this.l;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // BIT 7,(HL)
      .with(0x7e, () => {
        const v = this.mmu.readByte(this.hl);
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 16;
      })
      // BIT 7,A
      .with(0x7f, () => {
        const v = this.a;
        const res = v[0] & (1 << 7);
        this.pc[0] += 1;
        if (res === 0) {
          this.flag_z[0] = 1;
        }
        this.flag_n[0] = 0;
        this.flag_h[0] = 1;
        return 8;
      })
      // RES 0,B
      .with(0x80, () => {
        throw new Error("Instruction 'RES 0,B', '80' not implemented");
      })
      // RES 0,C
      .with(0x81, () => {
        throw new Error("Instruction 'RES 0,C', '81' not implemented");
      })
      // RES 0,D
      .with(0x82, () => {
        throw new Error("Instruction 'RES 0,D', '82' not implemented");
      })
      // RES 0,E
      .with(0x83, () => {
        throw new Error("Instruction 'RES 0,E', '83' not implemented");
      })
      // RES 0,H
      .with(0x84, () => {
        throw new Error("Instruction 'RES 0,H', '84' not implemented");
      })
      // RES 0,L
      .with(0x85, () => {
        throw new Error("Instruction 'RES 0,L', '85' not implemented");
      })
      // RES 0,(HL)
      .with(0x86, () => {
        throw new Error("Instruction 'RES 0,(HL)', '86' not implemented");
      })
      // RES 0,A
      .with(0x87, () => {
        throw new Error("Instruction 'RES 0,A', '87' not implemented");
      })
      // RES 1,B
      .with(0x88, () => {
        throw new Error("Instruction 'RES 1,B', '88' not implemented");
      })
      // RES 1,C
      .with(0x89, () => {
        throw new Error("Instruction 'RES 1,C', '89' not implemented");
      })
      // RES 1,D
      .with(0x8a, () => {
        throw new Error("Instruction 'RES 1,D', '8a' not implemented");
      })
      // RES 1,E
      .with(0x8b, () => {
        throw new Error("Instruction 'RES 1,E', '8b' not implemented");
      })
      // RES 1,H
      .with(0x8c, () => {
        throw new Error("Instruction 'RES 1,H', '8c' not implemented");
      })
      // RES 1,L
      .with(0x8d, () => {
        throw new Error("Instruction 'RES 1,L', '8d' not implemented");
      })
      // RES 1,(HL)
      .with(0x8e, () => {
        throw new Error("Instruction 'RES 1,(HL)', '8e' not implemented");
      })
      // RES 1,A
      .with(0x8f, () => {
        throw new Error("Instruction 'RES 1,A', '8f' not implemented");
      })
      // RES 2,B
      .with(0x90, () => {
        throw new Error("Instruction 'RES 2,B', '90' not implemented");
      })
      // RES 2,C
      .with(0x91, () => {
        throw new Error("Instruction 'RES 2,C', '91' not implemented");
      })
      // RES 2,D
      .with(0x92, () => {
        throw new Error("Instruction 'RES 2,D', '92' not implemented");
      })
      // RES 2,E
      .with(0x93, () => {
        throw new Error("Instruction 'RES 2,E', '93' not implemented");
      })
      // RES 2,H
      .with(0x94, () => {
        throw new Error("Instruction 'RES 2,H', '94' not implemented");
      })
      // RES 2,L
      .with(0x95, () => {
        throw new Error("Instruction 'RES 2,L', '95' not implemented");
      })
      // RES 2,(HL)
      .with(0x96, () => {
        throw new Error("Instruction 'RES 2,(HL)', '96' not implemented");
      })
      // RES 2,A
      .with(0x97, () => {
        throw new Error("Instruction 'RES 2,A', '97' not implemented");
      })
      // RES 3,B
      .with(0x98, () => {
        throw new Error("Instruction 'RES 3,B', '98' not implemented");
      })
      // RES 3,C
      .with(0x99, () => {
        throw new Error("Instruction 'RES 3,C', '99' not implemented");
      })
      // RES 3,D
      .with(0x9a, () => {
        throw new Error("Instruction 'RES 3,D', '9a' not implemented");
      })
      // RES 3,E
      .with(0x9b, () => {
        throw new Error("Instruction 'RES 3,E', '9b' not implemented");
      })
      // RES 3,H
      .with(0x9c, () => {
        throw new Error("Instruction 'RES 3,H', '9c' not implemented");
      })
      // RES 3,L
      .with(0x9d, () => {
        throw new Error("Instruction 'RES 3,L', '9d' not implemented");
      })
      // RES 3,(HL)
      .with(0x9e, () => {
        throw new Error("Instruction 'RES 3,(HL)', '9e' not implemented");
      })
      // RES 3,A
      .with(0x9f, () => {
        throw new Error("Instruction 'RES 3,A', '9f' not implemented");
      })
      // RES 4,B
      .with(0xa0, () => {
        throw new Error("Instruction 'RES 4,B', 'a0' not implemented");
      })
      // RES 4,C
      .with(0xa1, () => {
        throw new Error("Instruction 'RES 4,C', 'a1' not implemented");
      })
      // RES 4,D
      .with(0xa2, () => {
        throw new Error("Instruction 'RES 4,D', 'a2' not implemented");
      })
      // RES 4,E
      .with(0xa3, () => {
        throw new Error("Instruction 'RES 4,E', 'a3' not implemented");
      })
      // RES 4,H
      .with(0xa4, () => {
        throw new Error("Instruction 'RES 4,H', 'a4' not implemented");
      })
      // RES 4,L
      .with(0xa5, () => {
        throw new Error("Instruction 'RES 4,L', 'a5' not implemented");
      })
      // RES 4,(HL)
      .with(0xa6, () => {
        throw new Error("Instruction 'RES 4,(HL)', 'a6' not implemented");
      })
      // RES 4,A
      .with(0xa7, () => {
        throw new Error("Instruction 'RES 4,A', 'a7' not implemented");
      })
      // RES 5,B
      .with(0xa8, () => {
        throw new Error("Instruction 'RES 5,B', 'a8' not implemented");
      })
      // RES 5,C
      .with(0xa9, () => {
        throw new Error("Instruction 'RES 5,C', 'a9' not implemented");
      })
      // RES 5,D
      .with(0xaa, () => {
        throw new Error("Instruction 'RES 5,D', 'aa' not implemented");
      })
      // RES 5,E
      .with(0xab, () => {
        throw new Error("Instruction 'RES 5,E', 'ab' not implemented");
      })
      // RES 5,H
      .with(0xac, () => {
        throw new Error("Instruction 'RES 5,H', 'ac' not implemented");
      })
      // RES 5,L
      .with(0xad, () => {
        throw new Error("Instruction 'RES 5,L', 'ad' not implemented");
      })
      // RES 5,(HL)
      .with(0xae, () => {
        throw new Error("Instruction 'RES 5,(HL)', 'ae' not implemented");
      })
      // RES 5,A
      .with(0xaf, () => {
        throw new Error("Instruction 'RES 5,A', 'af' not implemented");
      })
      // RES 6,B
      .with(0xb0, () => {
        throw new Error("Instruction 'RES 6,B', 'b0' not implemented");
      })
      // RES 6,C
      .with(0xb1, () => {
        throw new Error("Instruction 'RES 6,C', 'b1' not implemented");
      })
      // RES 6,D
      .with(0xb2, () => {
        throw new Error("Instruction 'RES 6,D', 'b2' not implemented");
      })
      // RES 6,E
      .with(0xb3, () => {
        throw new Error("Instruction 'RES 6,E', 'b3' not implemented");
      })
      // RES 6,H
      .with(0xb4, () => {
        throw new Error("Instruction 'RES 6,H', 'b4' not implemented");
      })
      // RES 6,L
      .with(0xb5, () => {
        throw new Error("Instruction 'RES 6,L', 'b5' not implemented");
      })
      // RES 6,(HL)
      .with(0xb6, () => {
        throw new Error("Instruction 'RES 6,(HL)', 'b6' not implemented");
      })
      // RES 6,A
      .with(0xb7, () => {
        throw new Error("Instruction 'RES 6,A', 'b7' not implemented");
      })
      // RES 7,B
      .with(0xb8, () => {
        throw new Error("Instruction 'RES 7,B', 'b8' not implemented");
      })
      // RES 7,C
      .with(0xb9, () => {
        throw new Error("Instruction 'RES 7,C', 'b9' not implemented");
      })
      // RES 7,D
      .with(0xba, () => {
        throw new Error("Instruction 'RES 7,D', 'ba' not implemented");
      })
      // RES 7,E
      .with(0xbb, () => {
        throw new Error("Instruction 'RES 7,E', 'bb' not implemented");
      })
      // RES 7,H
      .with(0xbc, () => {
        throw new Error("Instruction 'RES 7,H', 'bc' not implemented");
      })
      // RES 7,L
      .with(0xbd, () => {
        throw new Error("Instruction 'RES 7,L', 'bd' not implemented");
      })
      // RES 7,(HL)
      .with(0xbe, () => {
        throw new Error("Instruction 'RES 7,(HL)', 'be' not implemented");
      })
      // RES 7,A
      .with(0xbf, () => {
        throw new Error("Instruction 'RES 7,A', 'bf' not implemented");
      })
      // SET 0,B
      .with(0xc0, () => {
        throw new Error("Instruction 'SET 0,B', 'c0' not implemented");
      })
      // SET 0,C
      .with(0xc1, () => {
        throw new Error("Instruction 'SET 0,C', 'c1' not implemented");
      })
      // SET 0,D
      .with(0xc2, () => {
        throw new Error("Instruction 'SET 0,D', 'c2' not implemented");
      })
      // SET 0,E
      .with(0xc3, () => {
        throw new Error("Instruction 'SET 0,E', 'c3' not implemented");
      })
      // SET 0,H
      .with(0xc4, () => {
        throw new Error("Instruction 'SET 0,H', 'c4' not implemented");
      })
      // SET 0,L
      .with(0xc5, () => {
        throw new Error("Instruction 'SET 0,L', 'c5' not implemented");
      })
      // SET 0,(HL)
      .with(0xc6, () => {
        throw new Error("Instruction 'SET 0,(HL)', 'c6' not implemented");
      })
      // SET 0,A
      .with(0xc7, () => {
        throw new Error("Instruction 'SET 0,A', 'c7' not implemented");
      })
      // SET 1,B
      .with(0xc8, () => {
        throw new Error("Instruction 'SET 1,B', 'c8' not implemented");
      })
      // SET 1,C
      .with(0xc9, () => {
        throw new Error("Instruction 'SET 1,C', 'c9' not implemented");
      })
      // SET 1,D
      .with(0xca, () => {
        throw new Error("Instruction 'SET 1,D', 'ca' not implemented");
      })
      // SET 1,E
      .with(0xcb, () => {
        throw new Error("Instruction 'SET 1,E', 'cb' not implemented");
      })
      // SET 1,H
      .with(0xcc, () => {
        throw new Error("Instruction 'SET 1,H', 'cc' not implemented");
      })
      // SET 1,L
      .with(0xcd, () => {
        throw new Error("Instruction 'SET 1,L', 'cd' not implemented");
      })
      // SET 1,(HL)
      .with(0xce, () => {
        throw new Error("Instruction 'SET 1,(HL)', 'ce' not implemented");
      })
      // SET 1,A
      .with(0xcf, () => {
        throw new Error("Instruction 'SET 1,A', 'cf' not implemented");
      })
      // SET 2,B
      .with(0xd0, () => {
        throw new Error("Instruction 'SET 2,B', 'd0' not implemented");
      })
      // SET 2,C
      .with(0xd1, () => {
        throw new Error("Instruction 'SET 2,C', 'd1' not implemented");
      })
      // SET 2,D
      .with(0xd2, () => {
        throw new Error("Instruction 'SET 2,D', 'd2' not implemented");
      })
      // SET 2,E
      .with(0xd3, () => {
        throw new Error("Instruction 'SET 2,E', 'd3' not implemented");
      })
      // SET 2,H
      .with(0xd4, () => {
        throw new Error("Instruction 'SET 2,H', 'd4' not implemented");
      })
      // SET 2,L
      .with(0xd5, () => {
        throw new Error("Instruction 'SET 2,L', 'd5' not implemented");
      })
      // SET 2,(HL)
      .with(0xd6, () => {
        throw new Error("Instruction 'SET 2,(HL)', 'd6' not implemented");
      })
      // SET 2,A
      .with(0xd7, () => {
        throw new Error("Instruction 'SET 2,A', 'd7' not implemented");
      })
      // SET 3,B
      .with(0xd8, () => {
        throw new Error("Instruction 'SET 3,B', 'd8' not implemented");
      })
      // SET 3,C
      .with(0xd9, () => {
        throw new Error("Instruction 'SET 3,C', 'd9' not implemented");
      })
      // SET 3,D
      .with(0xda, () => {
        throw new Error("Instruction 'SET 3,D', 'da' not implemented");
      })
      // SET 3,E
      .with(0xdb, () => {
        throw new Error("Instruction 'SET 3,E', 'db' not implemented");
      })
      // SET 3,H
      .with(0xdc, () => {
        throw new Error("Instruction 'SET 3,H', 'dc' not implemented");
      })
      // SET 3,L
      .with(0xdd, () => {
        throw new Error("Instruction 'SET 3,L', 'dd' not implemented");
      })
      // SET 3,(HL)
      .with(0xde, () => {
        throw new Error("Instruction 'SET 3,(HL)', 'de' not implemented");
      })
      // SET 3,A
      .with(0xdf, () => {
        throw new Error("Instruction 'SET 3,A', 'df' not implemented");
      })
      // SET 4,B
      .with(0xe0, () => {
        throw new Error("Instruction 'SET 4,B', 'e0' not implemented");
      })
      // SET 4,C
      .with(0xe1, () => {
        throw new Error("Instruction 'SET 4,C', 'e1' not implemented");
      })
      // SET 4,D
      .with(0xe2, () => {
        throw new Error("Instruction 'SET 4,D', 'e2' not implemented");
      })
      // SET 4,E
      .with(0xe3, () => {
        throw new Error("Instruction 'SET 4,E', 'e3' not implemented");
      })
      // SET 4,H
      .with(0xe4, () => {
        throw new Error("Instruction 'SET 4,H', 'e4' not implemented");
      })
      // SET 4,L
      .with(0xe5, () => {
        throw new Error("Instruction 'SET 4,L', 'e5' not implemented");
      })
      // SET 4,(HL)
      .with(0xe6, () => {
        throw new Error("Instruction 'SET 4,(HL)', 'e6' not implemented");
      })
      // SET 4,A
      .with(0xe7, () => {
        throw new Error("Instruction 'SET 4,A', 'e7' not implemented");
      })
      // SET 5,B
      .with(0xe8, () => {
        throw new Error("Instruction 'SET 5,B', 'e8' not implemented");
      })
      // SET 5,C
      .with(0xe9, () => {
        throw new Error("Instruction 'SET 5,C', 'e9' not implemented");
      })
      // SET 5,D
      .with(0xea, () => {
        throw new Error("Instruction 'SET 5,D', 'ea' not implemented");
      })
      // SET 5,E
      .with(0xeb, () => {
        throw new Error("Instruction 'SET 5,E', 'eb' not implemented");
      })
      // SET 5,H
      .with(0xec, () => {
        throw new Error("Instruction 'SET 5,H', 'ec' not implemented");
      })
      // SET 5,L
      .with(0xed, () => {
        throw new Error("Instruction 'SET 5,L', 'ed' not implemented");
      })
      // SET 5,(HL)
      .with(0xee, () => {
        throw new Error("Instruction 'SET 5,(HL)', 'ee' not implemented");
      })
      // SET 5,A
      .with(0xef, () => {
        throw new Error("Instruction 'SET 5,A', 'ef' not implemented");
      })
      // SET 6,B
      .with(0xf0, () => {
        throw new Error("Instruction 'SET 6,B', 'f0' not implemented");
      })
      // SET 6,C
      .with(0xf1, () => {
        throw new Error("Instruction 'SET 6,C', 'f1' not implemented");
      })
      // SET 6,D
      .with(0xf2, () => {
        throw new Error("Instruction 'SET 6,D', 'f2' not implemented");
      })
      // SET 6,E
      .with(0xf3, () => {
        throw new Error("Instruction 'SET 6,E', 'f3' not implemented");
      })
      // SET 6,H
      .with(0xf4, () => {
        throw new Error("Instruction 'SET 6,H', 'f4' not implemented");
      })
      // SET 6,L
      .with(0xf5, () => {
        throw new Error("Instruction 'SET 6,L', 'f5' not implemented");
      })
      // SET 6,(HL)
      .with(0xf6, () => {
        throw new Error("Instruction 'SET 6,(HL)', 'f6' not implemented");
      })
      // SET 6,A
      .with(0xf7, () => {
        throw new Error("Instruction 'SET 6,A', 'f7' not implemented");
      })
      // SET 7,B
      .with(0xf8, () => {
        throw new Error("Instruction 'SET 7,B', 'f8' not implemented");
      })
      // SET 7,C
      .with(0xf9, () => {
        throw new Error("Instruction 'SET 7,C', 'f9' not implemented");
      })
      // SET 7,D
      .with(0xfa, () => {
        throw new Error("Instruction 'SET 7,D', 'fa' not implemented");
      })
      // SET 7,E
      .with(0xfb, () => {
        throw new Error("Instruction 'SET 7,E', 'fb' not implemented");
      })
      // SET 7,H
      .with(0xfc, () => {
        throw new Error("Instruction 'SET 7,H', 'fc' not implemented");
      })
      // SET 7,L
      .with(0xfd, () => {
        throw new Error("Instruction 'SET 7,L', 'fd' not implemented");
      })
      // SET 7,(HL)
      .with(0xfe, () => {
        throw new Error("Instruction 'SET 7,(HL)', 'fe' not implemented");
      })
      // SET 7,A
      .with(0xff, () => {
        throw new Error("Instruction 'SET 7,A', 'ff' not implemented");
      })
      .otherwise(() => {
        throw new Error(
          `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"`,
        );
      });

    this.previousInstruction[0] = instruction[0];
  }
}
