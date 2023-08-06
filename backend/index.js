//variable de entorno "shh"
const mySecret = "shh"

import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

const bd = [{email: "test@test.com", password: "123456", id: 0}];
app.use(express.json());

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(403).json({message: "no proveido"});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, mySecret);
    const { id, email } = decoded;
    req.user = { id, email };
    next();
  } catch (error) {
    res.status(403).json({message: "no autorizado"});
  }
};

const token = (user)=> jwt.sign(user, mySecret, {
    expiresIn: '1h',
  });

app.post('/auth', (req, res) => {
  console.log(req.body);
  const {email, password} = req.body;
  const user = bd.find(u => u.email === email);
  if (!user) {
    res.status(401).json({message: "Usuario no encontrado"});
    return;
  }
  const tokenAuth = token({email, id: user.id});
  const userData = {
    user: {
      email: user.email,
      id: user.id,
    },
    token: tokenAuth
  };
  res.status(200).json({data: userData});
});

app.get("/home", authenticationMiddleware, (req,res)=> {
  res.send("home");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
