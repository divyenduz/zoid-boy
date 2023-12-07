Uint16Array.prototype.toString = function () {
  const strs = Array.from(this).map((byte) => {
    const str = byte.toString(16).padStart(2, "0");
    return str;
  });
  return "0x" + strs.reverse().join("");
};

Uint8Array.prototype.toString = function () {
  const strs = Array.from(this).map((byte) => {
    const str = byte.toString(16).padStart(2, "0");
    return str;
  });
  return "0x" + strs.reverse().join("");
};
