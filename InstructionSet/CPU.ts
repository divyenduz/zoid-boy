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
      .with(0x00, () => {
        throw new Error("Instruction 'NOP', '00' not implemented");
      })

      // LD BC,d16
      .with(0x01, () => {
        const d16 = this.mmu.readWord(this.pc);
        this.bc = d16;

        this.pc[0] += 3;
        return 12;
      })
      // LD (BC),A
      .with(0x02, () => {
        this.mmu.writeByte(this.mmu.readWord(this.bc), this.a);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x03, () => {
        throw new Error("Instruction 'INC BC', '03' not implemented");
      })

      .with(0x04, () => {
        throw new Error("Instruction 'INC B', '04' not implemented");
      })

      .with(0x05, () => {
        throw new Error("Instruction 'DEC B', '05' not implemented");
      })

      // LD B,d8
      .with(0x06, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.b = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x07, () => {
        throw new Error("Instruction 'RLCA', '07' not implemented");
      })

      // LD (a16),SP
      .with(0x08, () => {
        const a16 = this.mmu.readWord(this.sp);
        this.mmu.writeWord(a16, this.sp);

        this.pc[0] += 3;
        return 20;
      })

      .with(0x09, () => {
        throw new Error("Instruction 'ADD HL,BC', '09' not implemented");
      })

      // LD A,(BC)
      .with(0x0a, () => {
        this.a = this.mmu.readByte(this.bc);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x0b, () => {
        throw new Error("Instruction 'DEC BC', '0b' not implemented");
      })

      .with(0x0c, () => {
        throw new Error("Instruction 'INC C', '0c' not implemented");
      })

      .with(0x0d, () => {
        throw new Error("Instruction 'DEC C', '0d' not implemented");
      })

      // LD C,d8
      .with(0x0e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.c = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x0f, () => {
        throw new Error("Instruction 'RRCA', '0f' not implemented");
      })

      .with(0x10, () => {
        throw new Error("Instruction 'STOP 0', '10' not implemented");
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
        throw new Error("Instruction 'INC DE', '13' not implemented");
      })

      .with(0x14, () => {
        throw new Error("Instruction 'INC D', '14' not implemented");
      })

      .with(0x15, () => {
        throw new Error("Instruction 'DEC D', '15' not implemented");
      })

      // LD D,d8
      .with(0x16, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.d = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x17, () => {
        throw new Error("Instruction 'RLA', '17' not implemented");
      })

      .with(0x18, () => {
        throw new Error("Instruction 'JR r8', '18' not implemented");
      })

      .with(0x19, () => {
        throw new Error("Instruction 'ADD HL,DE', '19' not implemented");
      })

      // LD A,(DE)
      .with(0x1a, () => {
        this.a = this.mmu.readByte(this.de);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x1b, () => {
        throw new Error("Instruction 'DEC DE', '1b' not implemented");
      })

      .with(0x1c, () => {
        throw new Error("Instruction 'INC E', '1c' not implemented");
      })

      .with(0x1d, () => {
        throw new Error("Instruction 'DEC E', '1d' not implemented");
      })

      // LD E,d8
      .with(0x1e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.e = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x1f, () => {
        throw new Error("Instruction 'RRA', '1f' not implemented");
      })

      .with(0x20, () => {
        throw new Error("Instruction 'JR NZ,r8', '20' not implemented");
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
        throw new Error("Instruction 'INC HL', '23' not implemented");
      })

      .with(0x24, () => {
        throw new Error("Instruction 'INC H', '24' not implemented");
      })

      .with(0x25, () => {
        throw new Error("Instruction 'DEC H', '25' not implemented");
      })

      // LD H,d8
      .with(0x26, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.h = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x27, () => {
        throw new Error("Instruction 'DAA', '27' not implemented");
      })

      .with(0x28, () => {
        throw new Error("Instruction 'JR Z,r8', '28' not implemented");
      })

      .with(0x29, () => {
        throw new Error("Instruction 'ADD HL,HL', '29' not implemented");
      })

      // LD A,(HL+)
      .with(0x2a, () => {
        this.a = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x2b, () => {
        throw new Error("Instruction 'DEC HL', '2b' not implemented");
      })

      .with(0x2c, () => {
        throw new Error("Instruction 'INC L', '2c' not implemented");
      })

      .with(0x2d, () => {
        throw new Error("Instruction 'DEC L', '2d' not implemented");
      })

      // LD L,d8
      .with(0x2e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.l = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x2f, () => {
        throw new Error("Instruction 'CPL', '2f' not implemented");
      })

      .with(0x30, () => {
        throw new Error("Instruction 'JR NC,r8', '30' not implemented");
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
        throw new Error("Instruction 'INC SP', '33' not implemented");
      })

      .with(0x34, () => {
        throw new Error("Instruction 'INC (HL)', '34' not implemented");
      })

      .with(0x35, () => {
        throw new Error("Instruction 'DEC (HL)', '35' not implemented");
      })

      // LD (HL),d8
      .with(0x36, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.mmu.writeByte(this.mmu.readWord(this.hl), d8);

        this.pc[0] += 2;
        return 12;
      })

      .with(0x37, () => {
        throw new Error("Instruction 'SCF', '37' not implemented");
      })

      .with(0x38, () => {
        throw new Error("Instruction 'JR C,r8', '38' not implemented");
      })

      .with(0x39, () => {
        throw new Error("Instruction 'ADD HL,SP', '39' not implemented");
      })

      // LD A,(HL-)
      .with(0x3a, () => {
        this.a = this.mmu.readByte(this.hl);

        this.pc[0] += 1;
        return 8;
      })

      .with(0x3b, () => {
        throw new Error("Instruction 'DEC SP', '3b' not implemented");
      })

      .with(0x3c, () => {
        throw new Error("Instruction 'INC A', '3c' not implemented");
      })

      .with(0x3d, () => {
        throw new Error("Instruction 'DEC A', '3d' not implemented");
      })

      // LD A,d8
      .with(0x3e, () => {
        const d8 = this.mmu.readByte(this.pc);
        this.a = d8;

        this.pc[0] += 2;
        return 8;
      })

      .with(0x3f, () => {
        throw new Error("Instruction 'CCF', '3f' not implemented");
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
        throw new Error("Instruction 'HALT', '76' not implemented");
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
        throw new Error("Instruction 'ADD A,B', '80' not implemented");
      })

      .with(0x81, () => {
        throw new Error("Instruction 'ADD A,C', '81' not implemented");
      })

      .with(0x82, () => {
        throw new Error("Instruction 'ADD A,D', '82' not implemented");
      })

      .with(0x83, () => {
        throw new Error("Instruction 'ADD A,E', '83' not implemented");
      })

      .with(0x84, () => {
        throw new Error("Instruction 'ADD A,H', '84' not implemented");
      })

      .with(0x85, () => {
        throw new Error("Instruction 'ADD A,L', '85' not implemented");
      })

      .with(0x86, () => {
        throw new Error("Instruction 'ADD A,(HL)', '86' not implemented");
      })

      .with(0x87, () => {
        throw new Error("Instruction 'ADD A,A', '87' not implemented");
      })

      .with(0x88, () => {
        throw new Error("Instruction 'ADC A,B', '88' not implemented");
      })

      .with(0x89, () => {
        throw new Error("Instruction 'ADC A,C', '89' not implemented");
      })

      .with(0x8a, () => {
        throw new Error("Instruction 'ADC A,D', '8a' not implemented");
      })

      .with(0x8b, () => {
        throw new Error("Instruction 'ADC A,E', '8b' not implemented");
      })

      .with(0x8c, () => {
        throw new Error("Instruction 'ADC A,H', '8c' not implemented");
      })

      .with(0x8d, () => {
        throw new Error("Instruction 'ADC A,L', '8d' not implemented");
      })

      .with(0x8e, () => {
        throw new Error("Instruction 'ADC A,(HL)', '8e' not implemented");
      })

      .with(0x8f, () => {
        throw new Error("Instruction 'ADC A,A', '8f' not implemented");
      })

      .with(0x90, () => {
        throw new Error("Instruction 'SUB B', '90' not implemented");
      })

      .with(0x91, () => {
        throw new Error("Instruction 'SUB C', '91' not implemented");
      })

      .with(0x92, () => {
        throw new Error("Instruction 'SUB D', '92' not implemented");
      })

      .with(0x93, () => {
        throw new Error("Instruction 'SUB E', '93' not implemented");
      })

      .with(0x94, () => {
        throw new Error("Instruction 'SUB H', '94' not implemented");
      })

      .with(0x95, () => {
        throw new Error("Instruction 'SUB L', '95' not implemented");
      })

      .with(0x96, () => {
        throw new Error("Instruction 'SUB (HL)', '96' not implemented");
      })

      .with(0x97, () => {
        throw new Error("Instruction 'SUB A', '97' not implemented");
      })

      .with(0x98, () => {
        throw new Error("Instruction 'SBC A,B', '98' not implemented");
      })

      .with(0x99, () => {
        throw new Error("Instruction 'SBC A,C', '99' not implemented");
      })

      .with(0x9a, () => {
        throw new Error("Instruction 'SBC A,D', '9a' not implemented");
      })

      .with(0x9b, () => {
        throw new Error("Instruction 'SBC A,E', '9b' not implemented");
      })

      .with(0x9c, () => {
        throw new Error("Instruction 'SBC A,H', '9c' not implemented");
      })

      .with(0x9d, () => {
        throw new Error("Instruction 'SBC A,L', '9d' not implemented");
      })

      .with(0x9e, () => {
        throw new Error("Instruction 'SBC A,(HL)', '9e' not implemented");
      })

      .with(0x9f, () => {
        throw new Error("Instruction 'SBC A,A', '9f' not implemented");
      })

      .with(0xa0, () => {
        throw new Error("Instruction 'AND B', 'a0' not implemented");
      })

      .with(0xa1, () => {
        throw new Error("Instruction 'AND C', 'a1' not implemented");
      })

      .with(0xa2, () => {
        throw new Error("Instruction 'AND D', 'a2' not implemented");
      })

      .with(0xa3, () => {
        throw new Error("Instruction 'AND E', 'a3' not implemented");
      })

      .with(0xa4, () => {
        throw new Error("Instruction 'AND H', 'a4' not implemented");
      })

      .with(0xa5, () => {
        throw new Error("Instruction 'AND L', 'a5' not implemented");
      })

      .with(0xa6, () => {
        throw new Error("Instruction 'AND (HL)', 'a6' not implemented");
      })

      .with(0xa7, () => {
        throw new Error("Instruction 'AND A', 'a7' not implemented");
      })

      .with(0xa8, () => {
        throw new Error("Instruction 'XOR B', 'a8' not implemented");
      })

      .with(0xa9, () => {
        throw new Error("Instruction 'XOR C', 'a9' not implemented");
      })

      .with(0xaa, () => {
        throw new Error("Instruction 'XOR D', 'aa' not implemented");
      })

      .with(0xab, () => {
        throw new Error("Instruction 'XOR E', 'ab' not implemented");
      })

      .with(0xac, () => {
        throw new Error("Instruction 'XOR H', 'ac' not implemented");
      })

      .with(0xad, () => {
        throw new Error("Instruction 'XOR L', 'ad' not implemented");
      })

      .with(0xae, () => {
        throw new Error("Instruction 'XOR (HL)', 'ae' not implemented");
      })

      .with(0xaf, () => {
        throw new Error("Instruction 'XOR A', 'af' not implemented");
      })

      .with(0xb0, () => {
        throw new Error("Instruction 'OR B', 'b0' not implemented");
      })

      .with(0xb1, () => {
        throw new Error("Instruction 'OR C', 'b1' not implemented");
      })

      .with(0xb2, () => {
        throw new Error("Instruction 'OR D', 'b2' not implemented");
      })

      .with(0xb3, () => {
        throw new Error("Instruction 'OR E', 'b3' not implemented");
      })

      .with(0xb4, () => {
        throw new Error("Instruction 'OR H', 'b4' not implemented");
      })

      .with(0xb5, () => {
        throw new Error("Instruction 'OR L', 'b5' not implemented");
      })

      .with(0xb6, () => {
        throw new Error("Instruction 'OR (HL)', 'b6' not implemented");
      })

      .with(0xb7, () => {
        throw new Error("Instruction 'OR A', 'b7' not implemented");
      })

      .with(0xb8, () => {
        throw new Error("Instruction 'CP B', 'b8' not implemented");
      })

      .with(0xb9, () => {
        throw new Error("Instruction 'CP C', 'b9' not implemented");
      })

      .with(0xba, () => {
        throw new Error("Instruction 'CP D', 'ba' not implemented");
      })

      .with(0xbb, () => {
        throw new Error("Instruction 'CP E', 'bb' not implemented");
      })

      .with(0xbc, () => {
        throw new Error("Instruction 'CP H', 'bc' not implemented");
      })

      .with(0xbd, () => {
        throw new Error("Instruction 'CP L', 'bd' not implemented");
      })

      .with(0xbe, () => {
        throw new Error("Instruction 'CP (HL)', 'be' not implemented");
      })

      .with(0xbf, () => {
        throw new Error("Instruction 'CP A', 'bf' not implemented");
      })

      .with(0xc0, () => {
        throw new Error("Instruction 'RET NZ', 'c0' not implemented");
      })

      .with(0xc1, () => {
        throw new Error("Instruction 'POP BC', 'c1' not implemented");
      })

      .with(0xc2, () => {
        throw new Error("Instruction 'JP NZ,a16', 'c2' not implemented");
      })

      .with(0xc3, () => {
        throw new Error("Instruction 'JP a16', 'c3' not implemented");
      })

      .with(0xc4, () => {
        throw new Error("Instruction 'CALL NZ,a16', 'c4' not implemented");
      })

      .with(0xc5, () => {
        throw new Error("Instruction 'PUSH BC', 'c5' not implemented");
      })

      .with(0xc6, () => {
        throw new Error("Instruction 'ADD A,d8', 'c6' not implemented");
      })

      .with(0xc7, () => {
        throw new Error("Instruction 'RST 00H', 'c7' not implemented");
      })

      .with(0xc8, () => {
        throw new Error("Instruction 'RET Z', 'c8' not implemented");
      })

      .with(0xc9, () => {
        throw new Error("Instruction 'RET', 'c9' not implemented");
      })

      .with(0xca, () => {
        throw new Error("Instruction 'JP Z,a16', 'ca' not implemented");
      })

      .with(0xcb, () => {
        throw new Error("Instruction 'PREFIX CB', 'cb' not implemented");
      })

      .with(0xcc, () => {
        throw new Error("Instruction 'CALL Z,a16', 'cc' not implemented");
      })

      .with(0xcd, () => {
        throw new Error("Instruction 'CALL a16', 'cd' not implemented");
      })

      .with(0xce, () => {
        throw new Error("Instruction 'ADC A,d8', 'ce' not implemented");
      })

      .with(0xcf, () => {
        throw new Error("Instruction 'RST 08H', 'cf' not implemented");
      })

      .with(0xd0, () => {
        throw new Error("Instruction 'RET NC', 'd0' not implemented");
      })

      .with(0xd1, () => {
        throw new Error("Instruction 'POP DE', 'd1' not implemented");
      })

      .with(0xd2, () => {
        throw new Error("Instruction 'JP NC,a16', 'd2' not implemented");
      })

      .with(0xd3, () => {
        throw new Error("Instruction 'INVALID', 'd3' not implemented");
      })

      .with(0xd4, () => {
        throw new Error("Instruction 'CALL NC,a16', 'd4' not implemented");
      })

      .with(0xd5, () => {
        throw new Error("Instruction 'PUSH DE', 'd5' not implemented");
      })

      .with(0xd6, () => {
        throw new Error("Instruction 'SUB d8', 'd6' not implemented");
      })

      .with(0xd7, () => {
        throw new Error("Instruction 'RST 10H', 'd7' not implemented");
      })

      .with(0xd8, () => {
        throw new Error("Instruction 'RET C', 'd8' not implemented");
      })

      .with(0xd9, () => {
        throw new Error("Instruction 'RETI', 'd9' not implemented");
      })

      .with(0xda, () => {
        throw new Error("Instruction 'JP C,a16', 'da' not implemented");
      })

      .with(0xdb, () => {
        throw new Error("Instruction 'INVALID', 'db' not implemented");
      })

      .with(0xdc, () => {
        throw new Error("Instruction 'CALL C,a16', 'dc' not implemented");
      })

      .with(0xdd, () => {
        throw new Error("Instruction 'INVALID', 'dd' not implemented");
      })

      .with(0xde, () => {
        throw new Error("Instruction 'SBC A,d8', 'de' not implemented");
      })

      .with(0xdf, () => {
        throw new Error("Instruction 'RST 18H', 'df' not implemented");
      })

      .with(0xe0, () => {
        throw new Error("Instruction 'LDH (a8),A', 'e0' not implemented");
      })

      .with(0xe1, () => {
        throw new Error("Instruction 'POP HL', 'e1' not implemented");
      })

      // LD (C),A
      .with(0xe2, () => {
        this.c = this.a;

        this.pc[0] += 1;
        return 8;
      })

      .with(0xe3, () => {
        throw new Error("Instruction 'INVALID', 'e3' not implemented");
      })

      .with(0xe4, () => {
        throw new Error("Instruction 'INVALID', 'e4' not implemented");
      })

      .with(0xe5, () => {
        throw new Error("Instruction 'PUSH HL', 'e5' not implemented");
      })

      .with(0xe6, () => {
        throw new Error("Instruction 'AND d8', 'e6' not implemented");
      })

      .with(0xe7, () => {
        throw new Error("Instruction 'RST 20H', 'e7' not implemented");
      })

      .with(0xe8, () => {
        throw new Error("Instruction 'ADD SP,r8', 'e8' not implemented");
      })

      .with(0xe9, () => {
        throw new Error("Instruction 'JP (HL)', 'e9' not implemented");
      })

      // LD (a16),A
      .with(0xea, () => {
        const a16 = this.mmu.readWord(this.pc);
        this.mmu.writeByte(this.mmu.readWord(a16), this.a);

        this.pc[0] += 3;
        return 16;
      })

      .with(0xeb, () => {
        throw new Error("Instruction 'INVALID', 'eb' not implemented");
      })

      .with(0xec, () => {
        throw new Error("Instruction 'INVALID', 'ec' not implemented");
      })

      .with(0xed, () => {
        throw new Error("Instruction 'INVALID', 'ed' not implemented");
      })

      .with(0xee, () => {
        throw new Error("Instruction 'XOR d8', 'ee' not implemented");
      })

      .with(0xef, () => {
        throw new Error("Instruction 'RST 28H', 'ef' not implemented");
      })

      .with(0xf0, () => {
        throw new Error("Instruction 'LDH A,(a8)', 'f0' not implemented");
      })

      .with(0xf1, () => {
        throw new Error("Instruction 'POP AF', 'f1' not implemented");
      })

      // LD A,(C)
      .with(0xf2, () => {
        this.a = this.c;

        this.pc[0] += 1;
        return 8;
      })

      .with(0xf3, () => {
        throw new Error("Instruction 'DI', 'f3' not implemented");
      })

      .with(0xf4, () => {
        throw new Error("Instruction 'INVALID', 'f4' not implemented");
      })

      .with(0xf5, () => {
        throw new Error("Instruction 'PUSH AF', 'f5' not implemented");
      })

      .with(0xf6, () => {
        throw new Error("Instruction 'OR d8', 'f6' not implemented");
      })

      .with(0xf7, () => {
        throw new Error("Instruction 'RST 30H', 'f7' not implemented");
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
        throw new Error("Instruction 'EI', 'fb' not implemented");
      })

      .with(0xfc, () => {
        throw new Error("Instruction 'INVALID', 'fc' not implemented");
      })

      .with(0xfd, () => {
        throw new Error("Instruction 'INVALID', 'fd' not implemented");
      })

      .with(0xfe, () => {
        throw new Error("Instruction 'CP d8', 'fe' not implemented");
      })

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
}
