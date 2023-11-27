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
    if (this.prefix_cb) {
      throw new Error(
        "Normal instruction should not be called with prefix_cb set"
      );
    }
    // {{ADD_EXECUTE_MATCH}}

    this.previousInstruction[0] = instruction[0];
  }

  executeCB(instruction: Uint8Array) {
    // {{ADD_EXECUTE_CB_MATCH}}

    this.previousInstruction[0] = instruction[0];
  }
}
