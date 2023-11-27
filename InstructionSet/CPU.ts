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
  z_flag: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 8th bit, [0] reversed because endian-ness
  n_flag: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 7th bit, [1] reversed because endian-ness
  h_flag: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 6th bit, [2] reversed because endian-ness
  c_flag: Uint1Array = new Uint1Array(this._REGISTER_MEMORY, 0, 1); // 5th bit, [3] reversed because endian-ness

  pc: Uint16Array = new Uint16Array(1);
  sp: Uint16Array = new Uint16Array(1);

  prefix_cb: boolean = false;

  previousInstruction: Uint8Array = new Uint8Array(1);

  constructor(private mmu: MMU) {}

  execute(instruction: Uint8Array) {
    match(instruction[0])
      // NOP
      .with(0x00, () => {
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD BC,d16
      .with(0x01, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.bc = d16;
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // LD (BC),A
      .with(0x02, () => {
        this.mmu.writeByte(this.mmu.readWord(this.bc), this.a);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC BC
      .with(0x03, () => {
        throw new Error("Instruction 'INC BC', '03' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC B
      .with(0x04, () => {
        throw new Error("Instruction 'INC B', '04' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC B
      .with(0x05, () => {
        throw new Error("Instruction 'DEC B', '05' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,d8
      .with(0x06, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.b = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RLCA
      .with(0x07, () => {
        throw new Error("Instruction 'RLCA', '07' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD (a16),SP
      .with(0x08, () => {
        const a16 = this.mmu.readWord(this.sp);
        this.mmu.writeWord(a16, this.sp);
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 20;
      })
      // ADD HL,BC
      .with(0x09, () => {
        throw new Error("Instruction 'ADD HL,BC', '09' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,(BC)
      .with(0x0a, () => {
        this.a = this.mmu.readByte(this.bc);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // DEC BC
      .with(0x0b, () => {
        throw new Error("Instruction 'DEC BC', '0b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC C
      .with(0x0c, () => {
        throw new Error("Instruction 'INC C', '0c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC C
      .with(0x0d, () => {
        throw new Error("Instruction 'DEC C', '0d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,d8
      .with(0x0e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.c = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RRCA
      .with(0x0f, () => {
        throw new Error("Instruction 'RRCA', '0f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // STOP 0
      .with(0x10, () => {
        throw new Error("Instruction 'STOP 0', '10' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 4;
      })
      // LD DE,d16
      .with(0x11, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.de = d16;
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // LD (DE),A
      .with(0x12, () => {
        this.mmu.writeByte(this.mmu.readWord(this.de), this.a);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC DE
      .with(0x13, () => {
        throw new Error("Instruction 'INC DE', '13' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC D
      .with(0x14, () => {
        throw new Error("Instruction 'INC D', '14' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC D
      .with(0x15, () => {
        throw new Error("Instruction 'DEC D', '15' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,d8
      .with(0x16, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.d = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RLA
      .with(0x17, () => {
        throw new Error("Instruction 'RLA', '17' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // JR r8
      .with(0x18, () => {
        const r8 = this.mmu.readByte(this.pc);
        this.pc[0] += r8[0];
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 12;
      })
      // ADD HL,DE
      .with(0x19, () => {
        throw new Error("Instruction 'ADD HL,DE', '19' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,(DE)
      .with(0x1a, () => {
        this.a = this.mmu.readByte(this.de);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // DEC DE
      .with(0x1b, () => {
        throw new Error("Instruction 'DEC DE', '1b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC E
      .with(0x1c, () => {
        throw new Error("Instruction 'INC E', '1c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC E
      .with(0x1d, () => {
        throw new Error("Instruction 'DEC E', '1d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,d8
      .with(0x1e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.e = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RRA
      .with(0x1f, () => {
        throw new Error("Instruction 'RRA', '1f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // JR NZ,r8
      .with(0x20, () => {
        console.log({ flag: !this.z_flag[0] });
        if (!this.z_flag[0]) {
          const r8 = this.mmu.readByte(this.pc);
          const d8 = (0x80 ^ r8[0]) - 0x80;
          console.log("jumping by", d8);
          this.pc[0] += d8;
        } else {
          this.pc[0] += 1;
        }
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // LD HL,d16
      .with(0x21, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.hl = d16;
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // LD (HL+),A
      .with(0x22, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);
        this.hl[0] += 1;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC HL
      .with(0x23, () => {
        throw new Error("Instruction 'INC HL', '23' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC H
      .with(0x24, () => {
        throw new Error("Instruction 'INC H', '24' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC H
      .with(0x25, () => {
        throw new Error("Instruction 'DEC H', '25' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,d8
      .with(0x26, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.h = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // DAA
      .with(0x27, () => {
        throw new Error("Instruction 'DAA', '27' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // JR Z,r8
      .with(0x28, () => {
        console.log({ flag: this.z_flag[0] });
        if (this.z_flag[0]) {
          const r8 = this.mmu.readByte(this.pc);
          const d8 = (0x80 ^ r8[0]) - 0x80;
          console.log("jumping by", d8);
          this.pc[0] += d8;
        } else {
          this.pc[0] += 1;
        }
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // ADD HL,HL
      .with(0x29, () => {
        throw new Error("Instruction 'ADD HL,HL', '29' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,(HL+)
      .with(0x2a, () => {
        this.a = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // DEC HL
      .with(0x2b, () => {
        throw new Error("Instruction 'DEC HL', '2b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC L
      .with(0x2c, () => {
        throw new Error("Instruction 'INC L', '2c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC L
      .with(0x2d, () => {
        throw new Error("Instruction 'DEC L', '2d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,d8
      .with(0x2e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.l = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // CPL
      .with(0x2f, () => {
        throw new Error("Instruction 'CPL', '2f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // JR NC,r8
      .with(0x30, () => {
        console.log({ flag: !this.c_flag[3] });
        if (!this.c_flag[3]) {
          const r8 = this.mmu.readByte(this.pc);
          const d8 = (0x80 ^ r8[0]) - 0x80;
          console.log("jumping by", d8);
          this.pc[0] += d8;
        } else {
          this.pc[0] += 1;
        }
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // LD SP,d16
      .with(0x31, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.sp = d16;
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // LD (HL-),A
      .with(0x32, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);
        this.hl[0] -= 1;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC SP
      .with(0x33, () => {
        throw new Error("Instruction 'INC SP', '33' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC (HL)
      .with(0x34, () => {
        throw new Error("Instruction 'INC (HL)', '34' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // DEC (HL)
      .with(0x35, () => {
        throw new Error("Instruction 'DEC (HL)', '35' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // LD (HL),d8
      .with(0x36, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.mmu.writeByte(this.mmu.readWord(this.hl), d8);
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 12;
      })
      // SCF
      .with(0x37, () => {
        throw new Error("Instruction 'SCF', '37' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // JR C,r8
      .with(0x38, () => {
        console.log({ flag: this.c_flag[3] });
        if (this.c_flag[3]) {
          const r8 = this.mmu.readByte(this.pc);
          const d8 = (0x80 ^ r8[0]) - 0x80;
          console.log("jumping by", d8);
          this.pc[0] += d8;
        } else {
          this.pc[0] += 1;
        }
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // ADD HL,SP
      .with(0x39, () => {
        throw new Error("Instruction 'ADD HL,SP', '39' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,(HL-)
      .with(0x3a, () => {
        this.a = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // DEC SP
      .with(0x3b, () => {
        throw new Error("Instruction 'DEC SP', '3b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INC A
      .with(0x3c, () => {
        throw new Error("Instruction 'INC A', '3c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // DEC A
      .with(0x3d, () => {
        throw new Error("Instruction 'DEC A', '3d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,d8
      .with(0x3e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.a = d8;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // CCF
      .with(0x3f, () => {
        throw new Error("Instruction 'CCF', '3f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,B
      .with(0x40, () => {
        this.b = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,C
      .with(0x41, () => {
        this.b = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,D
      .with(0x42, () => {
        this.b = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,E
      .with(0x43, () => {
        this.b = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,H
      .with(0x44, () => {
        this.b = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,L
      .with(0x45, () => {
        this.b = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD B,(HL)
      .with(0x46, () => {
        this.b = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD B,A
      .with(0x47, () => {
        this.b = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,B
      .with(0x48, () => {
        this.c = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,C
      .with(0x49, () => {
        this.c = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,D
      .with(0x4a, () => {
        this.c = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,E
      .with(0x4b, () => {
        this.c = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,H
      .with(0x4c, () => {
        this.c = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,L
      .with(0x4d, () => {
        this.c = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD C,(HL)
      .with(0x4e, () => {
        this.c = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD C,A
      .with(0x4f, () => {
        this.c = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,B
      .with(0x50, () => {
        this.d = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,C
      .with(0x51, () => {
        this.d = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,D
      .with(0x52, () => {
        this.d = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,E
      .with(0x53, () => {
        this.d = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,H
      .with(0x54, () => {
        this.d = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,L
      .with(0x55, () => {
        this.d = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD D,(HL)
      .with(0x56, () => {
        this.d = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD D,A
      .with(0x57, () => {
        this.d = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,B
      .with(0x58, () => {
        this.e = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,C
      .with(0x59, () => {
        this.e = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,D
      .with(0x5a, () => {
        this.e = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,E
      .with(0x5b, () => {
        this.e = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,H
      .with(0x5c, () => {
        this.e = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,L
      .with(0x5d, () => {
        this.e = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD E,(HL)
      .with(0x5e, () => {
        this.e = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD E,A
      .with(0x5f, () => {
        this.e = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,B
      .with(0x60, () => {
        this.h = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,C
      .with(0x61, () => {
        this.h = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,D
      .with(0x62, () => {
        this.h = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,E
      .with(0x63, () => {
        this.h = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,H
      .with(0x64, () => {
        this.h = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,L
      .with(0x65, () => {
        this.h = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD H,(HL)
      .with(0x66, () => {
        this.h = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD H,A
      .with(0x67, () => {
        this.h = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,B
      .with(0x68, () => {
        this.l = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,C
      .with(0x69, () => {
        this.l = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,D
      .with(0x6a, () => {
        this.l = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,E
      .with(0x6b, () => {
        this.l = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,H
      .with(0x6c, () => {
        this.l = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,L
      .with(0x6d, () => {
        this.l = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD L,(HL)
      .with(0x6e, () => {
        this.l = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD L,A
      .with(0x6f, () => {
        this.l = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD (HL),B
      .with(0x70, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.b);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD (HL),C
      .with(0x71, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.c);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD (HL),D
      .with(0x72, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.d);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD (HL),E
      .with(0x73, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.e);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD (HL),H
      .with(0x74, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.h);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD (HL),L
      .with(0x75, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.l);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // HALT
      .with(0x76, () => {
        throw new Error("Instruction 'HALT', '76' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD (HL),A
      .with(0x77, () => {
        this.mmu.writeByte(this.mmu.readWord(this.hl), this.a);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,B
      .with(0x78, () => {
        this.a = this.b;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,C
      .with(0x79, () => {
        this.a = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,D
      .with(0x7a, () => {
        this.a = this.d;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,E
      .with(0x7b, () => {
        this.a = this.e;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,H
      .with(0x7c, () => {
        this.a = this.h;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,L
      .with(0x7d, () => {
        this.a = this.l;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD A,(HL)
      .with(0x7e, () => {
        this.a = this.mmu.readByte(this.hl);
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,A
      .with(0x7f, () => {
        this.a = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,B
      .with(0x80, () => {
        throw new Error("Instruction 'ADD A,B', '80' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,C
      .with(0x81, () => {
        throw new Error("Instruction 'ADD A,C', '81' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,D
      .with(0x82, () => {
        throw new Error("Instruction 'ADD A,D', '82' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,E
      .with(0x83, () => {
        throw new Error("Instruction 'ADD A,E', '83' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,H
      .with(0x84, () => {
        throw new Error("Instruction 'ADD A,H', '84' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,L
      .with(0x85, () => {
        throw new Error("Instruction 'ADD A,L', '85' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADD A,(HL)
      .with(0x86, () => {
        throw new Error("Instruction 'ADD A,(HL)', '86' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // ADD A,A
      .with(0x87, () => {
        throw new Error("Instruction 'ADD A,A', '87' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,B
      .with(0x88, () => {
        throw new Error("Instruction 'ADC A,B', '88' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,C
      .with(0x89, () => {
        throw new Error("Instruction 'ADC A,C', '89' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,D
      .with(0x8a, () => {
        throw new Error("Instruction 'ADC A,D', '8a' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,E
      .with(0x8b, () => {
        throw new Error("Instruction 'ADC A,E', '8b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,H
      .with(0x8c, () => {
        throw new Error("Instruction 'ADC A,H', '8c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,L
      .with(0x8d, () => {
        throw new Error("Instruction 'ADC A,L', '8d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // ADC A,(HL)
      .with(0x8e, () => {
        throw new Error("Instruction 'ADC A,(HL)', '8e' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // ADC A,A
      .with(0x8f, () => {
        throw new Error("Instruction 'ADC A,A', '8f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB B
      .with(0x90, () => {
        throw new Error("Instruction 'SUB B', '90' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB C
      .with(0x91, () => {
        throw new Error("Instruction 'SUB C', '91' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB D
      .with(0x92, () => {
        throw new Error("Instruction 'SUB D', '92' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB E
      .with(0x93, () => {
        throw new Error("Instruction 'SUB E', '93' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB H
      .with(0x94, () => {
        throw new Error("Instruction 'SUB H', '94' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB L
      .with(0x95, () => {
        throw new Error("Instruction 'SUB L', '95' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SUB (HL)
      .with(0x96, () => {
        throw new Error("Instruction 'SUB (HL)', '96' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // SUB A
      .with(0x97, () => {
        throw new Error("Instruction 'SUB A', '97' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,B
      .with(0x98, () => {
        throw new Error("Instruction 'SBC A,B', '98' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,C
      .with(0x99, () => {
        throw new Error("Instruction 'SBC A,C', '99' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,D
      .with(0x9a, () => {
        throw new Error("Instruction 'SBC A,D', '9a' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,E
      .with(0x9b, () => {
        throw new Error("Instruction 'SBC A,E', '9b' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,H
      .with(0x9c, () => {
        throw new Error("Instruction 'SBC A,H', '9c' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,L
      .with(0x9d, () => {
        throw new Error("Instruction 'SBC A,L', '9d' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // SBC A,(HL)
      .with(0x9e, () => {
        throw new Error("Instruction 'SBC A,(HL)', '9e' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // SBC A,A
      .with(0x9f, () => {
        throw new Error("Instruction 'SBC A,A', '9f' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND B
      .with(0xa0, () => {
        throw new Error("Instruction 'AND B', 'a0' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND C
      .with(0xa1, () => {
        throw new Error("Instruction 'AND C', 'a1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND D
      .with(0xa2, () => {
        throw new Error("Instruction 'AND D', 'a2' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND E
      .with(0xa3, () => {
        throw new Error("Instruction 'AND E', 'a3' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND H
      .with(0xa4, () => {
        throw new Error("Instruction 'AND H', 'a4' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND L
      .with(0xa5, () => {
        throw new Error("Instruction 'AND L', 'a5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // AND (HL)
      .with(0xa6, () => {
        throw new Error("Instruction 'AND (HL)', 'a6' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // AND A
      .with(0xa7, () => {
        throw new Error("Instruction 'AND A', 'a7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR B
      .with(0xa8, () => {
        this.a[0] ^= this.b[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR C
      .with(0xa9, () => {
        this.a[0] ^= this.c[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR D
      .with(0xaa, () => {
        this.a[0] ^= this.d[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR E
      .with(0xab, () => {
        this.a[0] ^= this.e[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR H
      .with(0xac, () => {
        this.a[0] ^= this.h[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR L
      .with(0xad, () => {
        this.a[0] ^= this.l[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // XOR (HL)
      .with(0xae, () => {
        this.a[0] ^= this.mmu.readByte(this.hl)[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // XOR A
      .with(0xaf, () => {
        this.a[0] ^= this.a[0];
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR B
      .with(0xb0, () => {
        throw new Error("Instruction 'OR B', 'b0' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR C
      .with(0xb1, () => {
        throw new Error("Instruction 'OR C', 'b1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR D
      .with(0xb2, () => {
        throw new Error("Instruction 'OR D', 'b2' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR E
      .with(0xb3, () => {
        throw new Error("Instruction 'OR E', 'b3' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR H
      .with(0xb4, () => {
        throw new Error("Instruction 'OR H', 'b4' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR L
      .with(0xb5, () => {
        throw new Error("Instruction 'OR L', 'b5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // OR (HL)
      .with(0xb6, () => {
        throw new Error("Instruction 'OR (HL)', 'b6' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // OR A
      .with(0xb7, () => {
        throw new Error("Instruction 'OR A', 'b7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP B
      .with(0xb8, () => {
        throw new Error("Instruction 'CP B', 'b8' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP C
      .with(0xb9, () => {
        throw new Error("Instruction 'CP C', 'b9' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP D
      .with(0xba, () => {
        throw new Error("Instruction 'CP D', 'ba' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP E
      .with(0xbb, () => {
        throw new Error("Instruction 'CP E', 'bb' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP H
      .with(0xbc, () => {
        throw new Error("Instruction 'CP H', 'bc' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP L
      .with(0xbd, () => {
        throw new Error("Instruction 'CP L', 'bd' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // CP (HL)
      .with(0xbe, () => {
        throw new Error("Instruction 'CP (HL)', 'be' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // CP A
      .with(0xbf, () => {
        throw new Error("Instruction 'CP A', 'bf' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // RET NZ
      .with(0xc0, () => {
        throw new Error("Instruction 'RET NZ', 'c0' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // POP BC
      .with(0xc1, () => {
        throw new Error("Instruction 'POP BC', 'c1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // JP NZ,a16
      .with(0xc2, () => {
        throw new Error("Instruction 'JP NZ,a16', 'c2' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // JP a16
      .with(0xc3, () => {
        throw new Error("Instruction 'JP a16', 'c3' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 16;
      })
      // CALL NZ,a16
      .with(0xc4, () => {
        throw new Error("Instruction 'CALL NZ,a16', 'c4' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // PUSH BC
      .with(0xc5, () => {
        throw new Error("Instruction 'PUSH BC', 'c5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // ADD A,d8
      .with(0xc6, () => {
        throw new Error("Instruction 'ADD A,d8', 'c6' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 00H
      .with(0xc7, () => {
        throw new Error("Instruction 'RST 00H', 'c7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // RET Z
      .with(0xc8, () => {
        throw new Error("Instruction 'RET Z', 'c8' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // RET
      .with(0xc9, () => {
        throw new Error("Instruction 'RET', 'c9' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // JP Z,a16
      .with(0xca, () => {
        throw new Error("Instruction 'JP Z,a16', 'ca' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // PREFIX CB
      .with(0xcb, () => {
        this.prefix_cb = true;
        this.pc[0] += 0;
        return 4;
      })
      // CALL Z,a16
      .with(0xcc, () => {
        throw new Error("Instruction 'CALL Z,a16', 'cc' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // CALL a16
      .with(0xcd, () => {
        throw new Error("Instruction 'CALL a16', 'cd' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 24;
      })
      // ADC A,d8
      .with(0xce, () => {
        throw new Error("Instruction 'ADC A,d8', 'ce' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 08H
      .with(0xcf, () => {
        throw new Error("Instruction 'RST 08H', 'cf' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // RET NC
      .with(0xd0, () => {
        throw new Error("Instruction 'RET NC', 'd0' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // POP DE
      .with(0xd1, () => {
        throw new Error("Instruction 'POP DE', 'd1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // JP NC,a16
      .with(0xd2, () => {
        throw new Error("Instruction 'JP NC,a16', 'd2' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // INVALID
      .with(0xd3, () => {
        throw new Error("Instruction 'INVALID', 'd3' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // CALL NC,a16
      .with(0xd4, () => {
        throw new Error("Instruction 'CALL NC,a16', 'd4' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // PUSH DE
      .with(0xd5, () => {
        throw new Error("Instruction 'PUSH DE', 'd5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // SUB d8
      .with(0xd6, () => {
        throw new Error("Instruction 'SUB d8', 'd6' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 10H
      .with(0xd7, () => {
        throw new Error("Instruction 'RST 10H', 'd7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // RET C
      .with(0xd8, () => {
        throw new Error("Instruction 'RET C', 'd8' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // RETI
      .with(0xd9, () => {
        throw new Error("Instruction 'RETI', 'd9' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // JP C,a16
      .with(0xda, () => {
        throw new Error("Instruction 'JP C,a16', 'da' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // INVALID
      .with(0xdb, () => {
        throw new Error("Instruction 'INVALID', 'db' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // CALL C,a16
      .with(0xdc, () => {
        throw new Error("Instruction 'CALL C,a16', 'dc' not implemented");
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 12;
      })
      // INVALID
      .with(0xdd, () => {
        throw new Error("Instruction 'INVALID', 'dd' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // SBC A,d8
      .with(0xde, () => {
        throw new Error("Instruction 'SBC A,d8', 'de' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 18H
      .with(0xdf, () => {
        throw new Error("Instruction 'RST 18H', 'df' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // LDH (a8),A
      .with(0xe0, () => {
        throw new Error("Instruction 'LDH (a8),A', 'e0' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 12;
      })
      // POP HL
      .with(0xe1, () => {
        throw new Error("Instruction 'POP HL', 'e1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // LD (C),A
      .with(0xe2, () => {
        this.c = this.a;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // INVALID
      .with(0xe3, () => {
        throw new Error("Instruction 'INVALID', 'e3' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // INVALID
      .with(0xe4, () => {
        throw new Error("Instruction 'INVALID', 'e4' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // PUSH HL
      .with(0xe5, () => {
        throw new Error("Instruction 'PUSH HL', 'e5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // AND d8
      .with(0xe6, () => {
        throw new Error("Instruction 'AND d8', 'e6' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 20H
      .with(0xe7, () => {
        throw new Error("Instruction 'RST 20H', 'e7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // ADD SP,r8
      .with(0xe8, () => {
        throw new Error("Instruction 'ADD SP,r8', 'e8' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 16;
      })
      // JP (HL)
      .with(0xe9, () => {
        throw new Error("Instruction 'JP (HL)', 'e9' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // LD (a16),A
      .with(0xea, () => {
        const a16 = this.mmu.readWord(this.pc);
        this.mmu.writeByte(this.mmu.readWord(a16), this.a);
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 16;
      })
      // INVALID
      .with(0xeb, () => {
        throw new Error("Instruction 'INVALID', 'eb' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // INVALID
      .with(0xec, () => {
        throw new Error("Instruction 'INVALID', 'ec' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // INVALID
      .with(0xed, () => {
        throw new Error("Instruction 'INVALID', 'ed' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // XOR d8
      .with(0xee, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.a[0] ^= d8[0];
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 28H
      .with(0xef, () => {
        throw new Error("Instruction 'RST 28H', 'ef' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // LDH A,(a8)
      .with(0xf0, () => {
        throw new Error("Instruction 'LDH A,(a8)', 'f0' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 12;
      })
      // POP AF
      .with(0xf1, () => {
        throw new Error("Instruction 'POP AF', 'f1' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 12;
      })
      // LD A,(C)
      .with(0xf2, () => {
        this.a = this.c;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // DI
      .with(0xf3, () => {
        throw new Error("Instruction 'DI', 'f3' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // INVALID
      .with(0xf4, () => {
        throw new Error("Instruction 'INVALID', 'f4' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // PUSH AF
      .with(0xf5, () => {
        throw new Error("Instruction 'PUSH AF', 'f5' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // OR d8
      .with(0xf6, () => {
        throw new Error("Instruction 'OR d8', 'f6' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 30H
      .with(0xf7, () => {
        throw new Error("Instruction 'RST 30H', 'f7' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      // LD HL,SP+r8
      .with(0xf8, () => {
        this.hl = this.sp;
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 12;
      })
      // LD SP,HL
      .with(0xf9, () => {
        this.sp = this.hl;
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 8;
      })
      // LD A,(a16)
      .with(0xfa, () => {
        const a16 = this.mmu.readWord(this.pc);
        this.a = this.mmu.readByte(a16);
        this.pc[0] += 2;
        this.prefix_cb = false;
        return 16;
      })
      // EI
      .with(0xfb, () => {
        throw new Error("Instruction 'EI', 'fb' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 4;
      })
      // INVALID
      .with(0xfc, () => {
        throw new Error("Instruction 'INVALID', 'fc' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // INVALID
      .with(0xfd, () => {
        throw new Error("Instruction 'INVALID', 'fd' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 0;
      })
      // CP d8
      .with(0xfe, () => {
        throw new Error("Instruction 'CP d8', 'fe' not implemented");
        this.pc[0] += 1;
        this.prefix_cb = false;
        return 8;
      })
      // RST 38H
      .with(0xff, () => {
        throw new Error("Instruction 'RST 38H', 'ff' not implemented");
        this.pc[0] += 0;
        this.prefix_cb = false;
        return 16;
      })
      .otherwise(() => {
        throw new Error(
          `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"`
        );
      });

    this.previousInstruction[0] = instruction[0];
  }
}
