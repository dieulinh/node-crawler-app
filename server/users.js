const bcrypt = require('bcrypt');
const db = require('../db');

const getUsers = (request, response) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

const authenticateUser = async (request, response) => {
  let { email, password } = request.body;
  let user = request.body;
  var a= {pass: 1};
  let responseUser = await db.query("SELECT email, password_digest FROM users WHERE email=$1", [email]);
  try {
    let password_digest = responseUser.rows[0].password_digest;
    console.log(password_digest);
    let isSame = await comparePassword(password, password_digest);
    try {
      if (isSame) {
        response.status(200).send(password_digest);
      } else {
        response.status(401).send('unauthenticated');
      }
    } catch(er) {
      response.status(400).send(er);
    }
    
   
  } catch(error) {
    console.log('Error found', error);
    response.status(400).send(error);

  }
}
const comparePassword = (password, password_digest) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(password, password_digest, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}
const getUser = (err, data) => {
  if (err) {
    throw err
  }  
  return data.rows;
}
const createUser = async (request, response) => {
  let { email, password, password_confirmation } = request.body;
  if (password===password_confirmation) {
    var user = null;
    let password_digest = hashPassword(password).then((hashedPassword) => {
      const text = 'INSERT INTO users (email, password_digest) VALUES($1, $2)'
      
      db.query(text, [email, hashedPassword], (error, results) => {
        if (error) {
          throw error
        }
        user = results.row[0];
      });
      console.log(user)
      
    });
    response.status(201).send(`User added with ID: ${user}`);
  } else {
    response.status(400).send('password and password confirmation not match');
  }
  
}

module.exports = {
  getUsers,
  createUser,
  authenticateUser
}