import { Instruction } from "./InstructionSet";

export const InstructionSetPrefixDB: Record<number, Instruction> = {
  0x00: {
    opcode: 0x00,
    mnemonic: "RLC B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x01: {
    opcode: 0x01,
    mnemonic: "RLC C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x02: {
    opcode: 0x02,
    mnemonic: "RLC D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x03: {
    opcode: 0x03,
    mnemonic: "RLC E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x04: {
    opcode: 0x04,
    mnemonic: "RLC H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x05: {
    opcode: 0x05,
    mnemonic: "RLC L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x06: {
    opcode: 0x06,
    mnemonic: "RLC (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x07: {
    opcode: 0x07,
    mnemonic: "RLC A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x08: {
    opcode: 0x08,
    mnemonic: "RRC B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x09: {
    opcode: 0x09,
    mnemonic: "RRC C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0a: {
    opcode: 0x0a,
    mnemonic: "RRC D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0b: {
    opcode: 0x0b,
    mnemonic: "RRC E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0c: {
    opcode: 0x0c,
    mnemonic: "RRC H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0d: {
    opcode: 0x0d,
    mnemonic: "RRC L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0e: {
    opcode: 0x0e,
    mnemonic: "RRC (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x0f: {
    opcode: 0x0f,
    mnemonic: "RRC A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x10: {
    opcode: 0x10,
    mnemonic: "RL B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x11: {
    opcode: 0x11,
    mnemonic: "RL C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x12: {
    opcode: 0x12,
    mnemonic: "RL D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x13: {
    opcode: 0x13,
    mnemonic: "RL E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x14: {
    opcode: 0x14,
    mnemonic: "RL H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x15: {
    opcode: 0x15,
    mnemonic: "RL L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x16: {
    opcode: 0x16,
    mnemonic: "RL (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x17: {
    opcode: 0x17,
    mnemonic: "RL A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x18: {
    opcode: 0x18,
    mnemonic: "RR B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x19: {
    opcode: 0x19,
    mnemonic: "RR C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1a: {
    opcode: 0x1a,
    mnemonic: "RR D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1b: {
    opcode: 0x1b,
    mnemonic: "RR E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1c: {
    opcode: 0x1c,
    mnemonic: "RR H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1d: {
    opcode: 0x1d,
    mnemonic: "RR L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1e: {
    opcode: 0x1e,
    mnemonic: "RR (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x1f: {
    opcode: 0x1f,
    mnemonic: "RR A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x20: {
    opcode: 0x20,
    mnemonic: "SLA B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x21: {
    opcode: 0x21,
    mnemonic: "SLA C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x22: {
    opcode: 0x22,
    mnemonic: "SLA D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x23: {
    opcode: 0x23,
    mnemonic: "SLA E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x24: {
    opcode: 0x24,
    mnemonic: "SLA H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x25: {
    opcode: 0x25,
    mnemonic: "SLA L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x26: {
    opcode: 0x26,
    mnemonic: "SLA (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x27: {
    opcode: 0x27,
    mnemonic: "SLA A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x28: {
    opcode: 0x28,
    mnemonic: "SRA B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x29: {
    opcode: 0x29,
    mnemonic: "SRA C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2a: {
    opcode: 0x2a,
    mnemonic: "SRA D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2b: {
    opcode: 0x2b,
    mnemonic: "SRA E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2c: {
    opcode: 0x2c,
    mnemonic: "SRA H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2d: {
    opcode: 0x2d,
    mnemonic: "SRA L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2e: {
    opcode: 0x2e,
    mnemonic: "SRA (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x2f: {
    opcode: 0x2f,
    mnemonic: "SRA A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x30: {
    opcode: 0x30,
    mnemonic: "SWAP B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x31: {
    opcode: 0x31,
    mnemonic: "SWAP C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x32: {
    opcode: 0x32,
    mnemonic: "SWAP D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x33: {
    opcode: 0x33,
    mnemonic: "SWAP E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x34: {
    opcode: 0x34,
    mnemonic: "SWAP H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x35: {
    opcode: 0x35,
    mnemonic: "SWAP L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x36: {
    opcode: 0x36,
    mnemonic: "SWAP (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x37: {
    opcode: 0x37,
    mnemonic: "SWAP A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "0",
  },
  0x38: {
    opcode: 0x38,
    mnemonic: "SRL B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x39: {
    opcode: 0x39,
    mnemonic: "SRL C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3a: {
    opcode: 0x3a,
    mnemonic: "SRL D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3b: {
    opcode: 0x3b,
    mnemonic: "SRL E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3c: {
    opcode: 0x3c,
    mnemonic: "SRL H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3d: {
    opcode: 0x3d,
    mnemonic: "SRL L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3e: {
    opcode: 0x3e,
    mnemonic: "SRL (HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x3f: {
    opcode: 0x3f,
    mnemonic: "SRL A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "0",
    C: "C",
  },
  0x40: {
    opcode: 0x40,
    mnemonic: "BIT 0,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x41: {
    opcode: 0x41,
    mnemonic: "BIT 0,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x42: {
    opcode: 0x42,
    mnemonic: "BIT 0,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x43: {
    opcode: 0x43,
    mnemonic: "BIT 0,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x44: {
    opcode: 0x44,
    mnemonic: "BIT 0,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x45: {
    opcode: 0x45,
    mnemonic: "BIT 0,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x46: {
    opcode: 0x46,
    mnemonic: "BIT 0,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x47: {
    opcode: 0x47,
    mnemonic: "BIT 0,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x48: {
    opcode: 0x48,
    mnemonic: "BIT 1,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x49: {
    opcode: 0x49,
    mnemonic: "BIT 1,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4a: {
    opcode: 0x4a,
    mnemonic: "BIT 1,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4b: {
    opcode: 0x4b,
    mnemonic: "BIT 1,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4c: {
    opcode: 0x4c,
    mnemonic: "BIT 1,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4d: {
    opcode: 0x4d,
    mnemonic: "BIT 1,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4e: {
    opcode: 0x4e,
    mnemonic: "BIT 1,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x4f: {
    opcode: 0x4f,
    mnemonic: "BIT 1,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x50: {
    opcode: 0x50,
    mnemonic: "BIT 2,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x51: {
    opcode: 0x51,
    mnemonic: "BIT 2,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x52: {
    opcode: 0x52,
    mnemonic: "BIT 2,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x53: {
    opcode: 0x53,
    mnemonic: "BIT 2,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x54: {
    opcode: 0x54,
    mnemonic: "BIT 2,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x55: {
    opcode: 0x55,
    mnemonic: "BIT 2,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x56: {
    opcode: 0x56,
    mnemonic: "BIT 2,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x57: {
    opcode: 0x57,
    mnemonic: "BIT 2,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x58: {
    opcode: 0x58,
    mnemonic: "BIT 3,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x59: {
    opcode: 0x59,
    mnemonic: "BIT 3,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5a: {
    opcode: 0x5a,
    mnemonic: "BIT 3,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5b: {
    opcode: 0x5b,
    mnemonic: "BIT 3,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5c: {
    opcode: 0x5c,
    mnemonic: "BIT 3,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5d: {
    opcode: 0x5d,
    mnemonic: "BIT 3,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5e: {
    opcode: 0x5e,
    mnemonic: "BIT 3,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x5f: {
    opcode: 0x5f,
    mnemonic: "BIT 3,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x60: {
    opcode: 0x60,
    mnemonic: "BIT 4,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x61: {
    opcode: 0x61,
    mnemonic: "BIT 4,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x62: {
    opcode: 0x62,
    mnemonic: "BIT 4,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x63: {
    opcode: 0x63,
    mnemonic: "BIT 4,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x64: {
    opcode: 0x64,
    mnemonic: "BIT 4,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x65: {
    opcode: 0x65,
    mnemonic: "BIT 4,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x66: {
    opcode: 0x66,
    mnemonic: "BIT 4,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x67: {
    opcode: 0x67,
    mnemonic: "BIT 4,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x68: {
    opcode: 0x68,
    mnemonic: "BIT 5,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x69: {
    opcode: 0x69,
    mnemonic: "BIT 5,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6a: {
    opcode: 0x6a,
    mnemonic: "BIT 5,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6b: {
    opcode: 0x6b,
    mnemonic: "BIT 5,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6c: {
    opcode: 0x6c,
    mnemonic: "BIT 5,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6d: {
    opcode: 0x6d,
    mnemonic: "BIT 5,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6e: {
    opcode: 0x6e,
    mnemonic: "BIT 5,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x6f: {
    opcode: 0x6f,
    mnemonic: "BIT 5,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x70: {
    opcode: 0x70,
    mnemonic: "BIT 6,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x71: {
    opcode: 0x71,
    mnemonic: "BIT 6,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x72: {
    opcode: 0x72,
    mnemonic: "BIT 6,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x73: {
    opcode: 0x73,
    mnemonic: "BIT 6,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x74: {
    opcode: 0x74,
    mnemonic: "BIT 6,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x75: {
    opcode: 0x75,
    mnemonic: "BIT 6,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x76: {
    opcode: 0x76,
    mnemonic: "BIT 6,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x77: {
    opcode: 0x77,
    mnemonic: "BIT 6,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x78: {
    opcode: 0x78,
    mnemonic: "BIT 7,B",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x79: {
    opcode: 0x79,
    mnemonic: "BIT 7,C",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7a: {
    opcode: 0x7a,
    mnemonic: "BIT 7,D",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7b: {
    opcode: 0x7b,
    mnemonic: "BIT 7,E",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7c: {
    opcode: 0x7c,
    mnemonic: "BIT 7,H",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7d: {
    opcode: 0x7d,
    mnemonic: "BIT 7,L",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7e: {
    opcode: 0x7e,
    mnemonic: "BIT 7,(HL)",
    length: 2,
    cycles: 16,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x7f: {
    opcode: 0x7f,
    mnemonic: "BIT 7,A",
    length: 2,
    cycles: 8,

    Z: "Z",
    N: "0",
    H: "1",
    C: "-",
  },
  0x80: {
    opcode: 0x80,
    mnemonic: "RES 0,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x81: {
    opcode: 0x81,
    mnemonic: "RES 0,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x82: {
    opcode: 0x82,
    mnemonic: "RES 0,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x83: {
    opcode: 0x83,
    mnemonic: "RES 0,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x84: {
    opcode: 0x84,
    mnemonic: "RES 0,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x85: {
    opcode: 0x85,
    mnemonic: "RES 0,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x86: {
    opcode: 0x86,
    mnemonic: "RES 0,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x87: {
    opcode: 0x87,
    mnemonic: "RES 0,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x88: {
    opcode: 0x88,
    mnemonic: "RES 1,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x89: {
    opcode: 0x89,
    mnemonic: "RES 1,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8a: {
    opcode: 0x8a,
    mnemonic: "RES 1,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8b: {
    opcode: 0x8b,
    mnemonic: "RES 1,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8c: {
    opcode: 0x8c,
    mnemonic: "RES 1,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8d: {
    opcode: 0x8d,
    mnemonic: "RES 1,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8e: {
    opcode: 0x8e,
    mnemonic: "RES 1,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x8f: {
    opcode: 0x8f,
    mnemonic: "RES 1,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x90: {
    opcode: 0x90,
    mnemonic: "RES 2,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x91: {
    opcode: 0x91,
    mnemonic: "RES 2,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x92: {
    opcode: 0x92,
    mnemonic: "RES 2,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x93: {
    opcode: 0x93,
    mnemonic: "RES 2,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x94: {
    opcode: 0x94,
    mnemonic: "RES 2,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x95: {
    opcode: 0x95,
    mnemonic: "RES 2,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x96: {
    opcode: 0x96,
    mnemonic: "RES 2,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x97: {
    opcode: 0x97,
    mnemonic: "RES 2,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x98: {
    opcode: 0x98,
    mnemonic: "RES 3,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x99: {
    opcode: 0x99,
    mnemonic: "RES 3,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9a: {
    opcode: 0x9a,
    mnemonic: "RES 3,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9b: {
    opcode: 0x9b,
    mnemonic: "RES 3,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9c: {
    opcode: 0x9c,
    mnemonic: "RES 3,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9d: {
    opcode: 0x9d,
    mnemonic: "RES 3,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9e: {
    opcode: 0x9e,
    mnemonic: "RES 3,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0x9f: {
    opcode: 0x9f,
    mnemonic: "RES 3,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa0: {
    opcode: 0xa0,
    mnemonic: "RES 4,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa1: {
    opcode: 0xa1,
    mnemonic: "RES 4,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa2: {
    opcode: 0xa2,
    mnemonic: "RES 4,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa3: {
    opcode: 0xa3,
    mnemonic: "RES 4,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa4: {
    opcode: 0xa4,
    mnemonic: "RES 4,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa5: {
    opcode: 0xa5,
    mnemonic: "RES 4,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa6: {
    opcode: 0xa6,
    mnemonic: "RES 4,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa7: {
    opcode: 0xa7,
    mnemonic: "RES 4,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa8: {
    opcode: 0xa8,
    mnemonic: "RES 5,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xa9: {
    opcode: 0xa9,
    mnemonic: "RES 5,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xaa: {
    opcode: 0xaa,
    mnemonic: "RES 5,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xab: {
    opcode: 0xab,
    mnemonic: "RES 5,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xac: {
    opcode: 0xac,
    mnemonic: "RES 5,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xad: {
    opcode: 0xad,
    mnemonic: "RES 5,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xae: {
    opcode: 0xae,
    mnemonic: "RES 5,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xaf: {
    opcode: 0xaf,
    mnemonic: "RES 5,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb0: {
    opcode: 0xb0,
    mnemonic: "RES 6,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb1: {
    opcode: 0xb1,
    mnemonic: "RES 6,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb2: {
    opcode: 0xb2,
    mnemonic: "RES 6,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb3: {
    opcode: 0xb3,
    mnemonic: "RES 6,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb4: {
    opcode: 0xb4,
    mnemonic: "RES 6,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb5: {
    opcode: 0xb5,
    mnemonic: "RES 6,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb6: {
    opcode: 0xb6,
    mnemonic: "RES 6,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb7: {
    opcode: 0xb7,
    mnemonic: "RES 6,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb8: {
    opcode: 0xb8,
    mnemonic: "RES 7,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xb9: {
    opcode: 0xb9,
    mnemonic: "RES 7,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xba: {
    opcode: 0xba,
    mnemonic: "RES 7,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xbb: {
    opcode: 0xbb,
    mnemonic: "RES 7,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xbc: {
    opcode: 0xbc,
    mnemonic: "RES 7,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xbd: {
    opcode: 0xbd,
    mnemonic: "RES 7,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xbe: {
    opcode: 0xbe,
    mnemonic: "RES 7,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xbf: {
    opcode: 0xbf,
    mnemonic: "RES 7,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc0: {
    opcode: 0xc0,
    mnemonic: "SET 0,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc1: {
    opcode: 0xc1,
    mnemonic: "SET 0,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc2: {
    opcode: 0xc2,
    mnemonic: "SET 0,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc3: {
    opcode: 0xc3,
    mnemonic: "SET 0,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc4: {
    opcode: 0xc4,
    mnemonic: "SET 0,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc5: {
    opcode: 0xc5,
    mnemonic: "SET 0,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc6: {
    opcode: 0xc6,
    mnemonic: "SET 0,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc7: {
    opcode: 0xc7,
    mnemonic: "SET 0,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc8: {
    opcode: 0xc8,
    mnemonic: "SET 1,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xc9: {
    opcode: 0xc9,
    mnemonic: "SET 1,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xca: {
    opcode: 0xca,
    mnemonic: "SET 1,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xcb: {
    opcode: 0xcb,
    mnemonic: "SET 1,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xcc: {
    opcode: 0xcc,
    mnemonic: "SET 1,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xcd: {
    opcode: 0xcd,
    mnemonic: "SET 1,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xce: {
    opcode: 0xce,
    mnemonic: "SET 1,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xcf: {
    opcode: 0xcf,
    mnemonic: "SET 1,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd0: {
    opcode: 0xd0,
    mnemonic: "SET 2,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd1: {
    opcode: 0xd1,
    mnemonic: "SET 2,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd2: {
    opcode: 0xd2,
    mnemonic: "SET 2,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd3: {
    opcode: 0xd3,
    mnemonic: "SET 2,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd4: {
    opcode: 0xd4,
    mnemonic: "SET 2,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd5: {
    opcode: 0xd5,
    mnemonic: "SET 2,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd6: {
    opcode: 0xd6,
    mnemonic: "SET 2,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd7: {
    opcode: 0xd7,
    mnemonic: "SET 2,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd8: {
    opcode: 0xd8,
    mnemonic: "SET 3,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xd9: {
    opcode: 0xd9,
    mnemonic: "SET 3,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xda: {
    opcode: 0xda,
    mnemonic: "SET 3,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xdb: {
    opcode: 0xdb,
    mnemonic: "SET 3,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xdc: {
    opcode: 0xdc,
    mnemonic: "SET 3,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xdd: {
    opcode: 0xdd,
    mnemonic: "SET 3,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xde: {
    opcode: 0xde,
    mnemonic: "SET 3,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xdf: {
    opcode: 0xdf,
    mnemonic: "SET 3,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe0: {
    opcode: 0xe0,
    mnemonic: "SET 4,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe1: {
    opcode: 0xe1,
    mnemonic: "SET 4,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe2: {
    opcode: 0xe2,
    mnemonic: "SET 4,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe3: {
    opcode: 0xe3,
    mnemonic: "SET 4,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe4: {
    opcode: 0xe4,
    mnemonic: "SET 4,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe5: {
    opcode: 0xe5,
    mnemonic: "SET 4,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe6: {
    opcode: 0xe6,
    mnemonic: "SET 4,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe7: {
    opcode: 0xe7,
    mnemonic: "SET 4,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe8: {
    opcode: 0xe8,
    mnemonic: "SET 5,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xe9: {
    opcode: 0xe9,
    mnemonic: "SET 5,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xea: {
    opcode: 0xea,
    mnemonic: "SET 5,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xeb: {
    opcode: 0xeb,
    mnemonic: "SET 5,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xec: {
    opcode: 0xec,
    mnemonic: "SET 5,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xed: {
    opcode: 0xed,
    mnemonic: "SET 5,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xee: {
    opcode: 0xee,
    mnemonic: "SET 5,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xef: {
    opcode: 0xef,
    mnemonic: "SET 5,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf0: {
    opcode: 0xf0,
    mnemonic: "SET 6,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf1: {
    opcode: 0xf1,
    mnemonic: "SET 6,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf2: {
    opcode: 0xf2,
    mnemonic: "SET 6,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf3: {
    opcode: 0xf3,
    mnemonic: "SET 6,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf4: {
    opcode: 0xf4,
    mnemonic: "SET 6,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf5: {
    opcode: 0xf5,
    mnemonic: "SET 6,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf6: {
    opcode: 0xf6,
    mnemonic: "SET 6,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf7: {
    opcode: 0xf7,
    mnemonic: "SET 6,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf8: {
    opcode: 0xf8,
    mnemonic: "SET 7,B",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xf9: {
    opcode: 0xf9,
    mnemonic: "SET 7,C",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xfa: {
    opcode: 0xfa,
    mnemonic: "SET 7,D",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xfb: {
    opcode: 0xfb,
    mnemonic: "SET 7,E",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xfc: {
    opcode: 0xfc,
    mnemonic: "SET 7,H",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xfd: {
    opcode: 0xfd,
    mnemonic: "SET 7,L",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xfe: {
    opcode: 0xfe,
    mnemonic: "SET 7,(HL)",
    length: 2,
    cycles: 16,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
  0xff: {
    opcode: 0xff,
    mnemonic: "SET 7,A",
    length: 2,
    cycles: 8,

    Z: "-",
    N: "-",
    H: "-",
    C: "-",
  },
};
