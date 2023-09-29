const express = require('express')
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express()

let User;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

sequelize.sync();  

app.get('/api/users', async (req,res) => {
  const users = await User.findAll();
  res.send(users)
})

app.get('/api/users/:id', async (req,res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user)
})

app.post('/api/users', async (req,res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);  
  } catch (error) {
    res.json(error)
  }
})

app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(3001, () => {
  console.log('Server running at port 3001');
})
