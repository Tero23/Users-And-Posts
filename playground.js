const bcrypt = require("bcryptjs");
const pass = async () => {
  const result = await bcrypt.hash("Password@123", 8);
  return result;
};

console.log(typeof pass());
console.log(pass());
