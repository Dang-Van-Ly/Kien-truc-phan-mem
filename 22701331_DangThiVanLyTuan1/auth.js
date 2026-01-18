const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("private.key");

const token = jwt.sign(
  { userId: 1, role: "USER" },
  privateKey,
  {
    algorithm: "RS256",
    expiresIn: "15m"
  }
);

console.log("ACCESS TOKEN:");
console.log(token);
