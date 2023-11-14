import * as express from 'express';
import { Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from "@prisma/client"

const app = express();
const PORT = 5000;

// app.use(express.static(__dirname + '/')); // adding routes to connect to the frontEnd

const prisma = new PrismaClient()

app.use(express.json()); //middlewere

// Typings
type User = {
  username: string;
  password: string;
};

// endpoint
app.get('/register', async (req: Request, resp: Response) => {
  const users = await prisma.users.findMany();
  resp.send(users);
})

//Register
app.post('/register', async (req: Request, resp: Response) => { 
  const users = await prisma.users.findMany();
  let newUser: Prisma.UsersCreateInput 
  
  newUser = {
    username: req.body.username,
    password: req.body.password
  }; 

if (users.find(user => user.username === newUser.username)) {
    resp.status(400).json('the username is already in use')
  } else {
  const hashedPassword = bcrypt.hashSync(newUser.password, 8); //Password hash
  newUser.password = hashedPassword;
  
 await prisma.users.create({ data: newUser });
  resp.status(201).json('User registered successfully')
}

})
//Login
app.post('/login', async (req: Request, resp: Response) => { 
  const { username, password} = req.body;
  const users = await prisma.users.findMany();  //Search the user in the database
  const user = users.find(user => user.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return resp.status(401).json({ error: 'Invalid credentials.' });
  }

  resp.status(200).json({ message: 'Successful login.' });
});







app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


