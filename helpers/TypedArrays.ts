Uint16Array.prototype.toString = function () {
  let str = [];
  this.forEach((byte) => {
    str.push(byte.toString(16).padStart(4, "0"));
  });
  return str.join("\n");
};

Uint8Array.prototype.toString = function () {
  let str = [];
  this.forEach((byte) => {
    str.push(byte.toString(16).padStart(2, "0"));
  });
  return str.join("\n");
};
