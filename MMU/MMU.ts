const MEMORY_SIZE = 65536;
export class MMU {
  /**
   * The Z80 is an 8-bit chip, so all the internal workings operate on one byte at a time;
   * 0000-3FFF: 16KB ROM Bank 00 (in cartridge, fixed at bank 00)
   * 4000-7FFF: 16KB ROM Bank 01..NN (in cartridge, switchable bank number)
   * 8000-9FFF: 8KB Video RAM (VRAM) (switchable bank 0-1 in CGB Mode)
   * A000-BFFF: 8KB External RAM (in cartridge, switchable bank, if any)
   * C000-CFFF: 4KB Work RAM Bank 0 (WRAM)
   * D000-DFFF: 4KB Work RAM Bank 1 (WRAM) (switchable bank 1-7 in CGB Mode)
   * E000-FDFF: Same as C000-DDFF (ECHO) (typically not used)
   * FE00-FE9F: Sprite Attribute Table (OAM)
   * FEA0-FEFF: Not Usable
   * FF00-FF7F: I/O Ports
   * FF80-FFFE: High RAM (HRAM)
   * FFFF: Interrupt Enable Register
   */
  _MEMORY: ArrayBuffer = new ArrayBuffer(MEMORY_SIZE);
  memory: Uint8Array = new Uint8Array(this._MEMORY);

  constructor(bootrom: Uint8Array, rom: Uint8Array) {
    this.memory.set(bootrom);
  }

  // Read 8-bit byte from a given address
  readByte(addr: Uint16Array) {
    return this.memory.subarray(addr[0], addr[0] + 1);
  }

  // Read 16-bit word from a given address
  readWord(addr: Uint16Array) {
    return new Uint16Array(this.memory.subarray(addr[0], addr[0] + 2));
  }

  // Write 8-bit byte to a given address
  writeByte(addr: Uint16Array, val: Uint8Array) {
    this.memory[addr[0]] = val[0];
  }

  // Write 16-bit word to a given address
  writeWord(addr: Uint16Array, val: Uint16Array) {
    this.memory[addr[0]] = val[0];
    this.memory[addr[0] + 1] = val[1];
  }
}
