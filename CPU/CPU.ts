import { MMU } from "../MMU/MMU";
import { match } from "ts-pattern";
import Uint1Array from "uint1array";

/**
 * The Z80 is an 8-bit chip, so all the internal workings operate on one byte at a time;
 *
 */
export class CPU {
  _REGISTER_MEMORY: ArrayBuffer = new ArrayBuffer(8);

  A: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 0, 1);
  // Skip 1 byte
  D: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 2, 1);
  B: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 3, 1);
  C: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 4, 1);
  E: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 5, 1);
  L: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 6, 1);
  H: Uint8Array = new Uint8Array(this._REGISTER_MEMORY, 7, 1);
  BC: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 2, 1);
  DE: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 4, 1);
  HL: Uint16Array = new Uint16Array(this._REGISTER_MEMORY, 6, 1);

  /**
   * Zero (0x80): Set if the last operation produced a result of 0;
   * Operation (0x40): Set if the last operation was a subtraction;
   * Half-carry (0x20): Set if, in the result of the last operation, the lower half of the byte overflowed past 15;
   * Carry (0x10): Set if the last operation produced a result over 255 (for additions) or under 0 (for subtractions);
   */
  F: Uint8Array = new Uint1Array(8);

  PC: Uint16Array = new Uint16Array(1);
  SP: Uint16Array = new Uint16Array(1);
  M: Uint8Array = new Uint8Array(1);
  T: Uint8Array = new Uint8Array(1);
  clock_M: Uint8Array = new Uint8Array(1);
  clock_T: Uint8Array = new Uint8Array(1);

  previousInstruction: Uint8Array = new Uint8Array(1);

  constructor(private mmu: MMU) {}

  execute(instruction: Uint8Array) {
    const r = match(instruction[0])
      // INC C
      .with(0x0c, () => {
        this.C[0] += 1;

        this.F[7] = 1;
        this.F[6] = 0;
        this.F[5] = 0; // TODO: implement half-carry flag

        this.M[0] = 1;
        this.T[0] = 4;
      })
      // LD C,d8
      .with(0x0e, () => {
        const d8 = this.mmu.readByte(this.PC);
        this.PC[0] += 1;
        this.C = d8;
        this.M[0] = 2;
        this.T[0] = 8;
      })
      // LD DE, n16
      .with(0x11, () => {
        const n16 = this.mmu.readWord(this.PC);
        this.PC[0] += 2;
        this.DE = n16;
        this.M[0] = 3;
        this.T[0] = 12;
      })
      // LD A,(DE)
      .with(0x1a, () => {
        this.A = this.mmu.readByte(this.DE);
        this.M[0] = 2;
        this.T[0] = 8;
      })
      // JR NZ,r8
      .with(0x20, () => {
        const r8 = this.mmu.readByte(this.PC);
        this.PC[0] += 1;
        if (this.F[7] === 1) {
          this.M[0] = 2;
          this.T[0] = 8;
        } else {
          this.PC[0] += r8[0];
          this.M[0] = 2;
          this.T[0] = 12;
        }
      })
      // INC D
      .with(0x14, () => {
        this.D[0] += 1;
        this.F[7] = 1;
        this.M[0] = 1;
        this.T[0] = 4;
      })
      // LD HL,d16
      .with(0x21, () => {
        const d16 = this.mmu.readWord(this.PC);
        this.PC[0] += 2;
        this.HL = d16;
        this.M[0] = 3;
        this.T[0] = 12;
      })
      // LD SP,u16
      .with(0x31, () => {
        const d16 = this.mmu.readWord(this.PC);
        this.PC[0] += 2;
        this.SP = d16;
        this.M[0] = 3;
        this.T[0] = 12;
      })
      // LD (HL-),A
      .with(0x32, () => {
        this.mmu.writeByte(this.HL, this.A);
        this.HL[0] -= 1;
        this.M[0] = 1;
        this.T[0] = 8;
      })
      // LD A,d8
      .with(0x3e, () => {
        const d8 = this.mmu.readByte(this.PC);
        this.PC[0] += 1;
        this.A = d8;
        this.M[0] = 2;
        this.T[0] = 8;
      })
      // LD (HL),A
      .with(0x77, () => {
        this.mmu.writeByte(this.HL, this.A);
        this.M[0] = 1;
        this.T[0] = 8;
      })
      // LD (HL),D
      .with(0x7c, () => {
        this.mmu.writeByte(this.HL, this.D);
        this.M[0] = 1;
        this.T[0] = 8;
      })
      // ADD A,B
      .with(0x80, () => {
        this.A[0] += this.B[0];
        this.F[7] = 1;
        this.F[6] = 0;
        this.F[5] = 0; // TODO: implement half-carry flag
        this.F[4] = 0; // TODO: implement carry flag
        this.M[0] = 1;
        this.T[0] = 4;
      })
      // PREFIX CB
      .with(0xcb, () => {
        this.mmu.readByte(this.BC);
        this.M[0] = 1;
        this.T[0] = 4;
      })

      // XOR A
      .with(0xaf, () => {
        this.A[0] = this.A[0] ^ this.A[0];
        this.F[7] = 1;
        this.M[0] = 1;
        this.T[0] = 4;
      })
      // LDH (a8),A
      .with(0xe0, () => {
        const a8 = this.mmu.readByte(this.PC);
        this.PC[0] += 1;
        this.mmu.writeByte(new Uint16Array([0xff + a8[0]]), this.A);
        console.log(a8[0].toString(16));
        console.log((0xff + a8[0]).toString(16));
        console.log(`${new Uint16Array([0xff + a8[0]])}`);
        this.M[0] = 2;
        this.T[0] = 12;
      })
      // LD (C),A
      .with(0xe2, () => {
        this.C[0] = this.A[0];
        this.M[0] = 2;
        this.T[0] = 8;
      })

      // DI
      .with(0xf3, () => {
        // TODO: disable interrupts
        this.M[0] = 1;
        this.T[0] = 4;
      })

      .otherwise(() => {
        throw new Error(
          `Instruction "${instruction}" not implemented. Previous instruction: "${this.previousInstruction}"`
        );
      });

    this.previousInstruction[0] = instruction[0];
  }
}
