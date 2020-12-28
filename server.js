const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
  });

//controllers
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const {handleApiCall, handleImage} = require('./controllers/image')

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;
const srv = app.listen(port, () => {console.log('running {-_-} on port:', port)})

app.get('/', (req, res) => {
    res.json('Hello API!')
    //db.select('*').from('users').then(users => res.json(users))
})

app.post('/signin', signin(db, bcrypt))

app.post('/register', register(db, bcrypt))

app.get('/profile/:id', profile(db))

app.put('/image', handleImage(db))
app.post('/imageurl', handleApiCall)
