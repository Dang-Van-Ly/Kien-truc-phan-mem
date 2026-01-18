const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const publicKey = fs.readFileSync("public.key");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}

app.get("/public", (req, res) => {
  res.send("Public API");
});

app.get("/secure", authenticate, (req, res) => {
  res.send(`Hello user ${req.user.userId}`);
});

app.listen(3000, () => {
  console.log("Resource Server running on 3000");
});
