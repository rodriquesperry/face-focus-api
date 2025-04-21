const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { sequelize } = require('./models/index.js');
const { v4: uuidv4 } = require('uuid');
const db = require('./models/index.js');

const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const entries = require('./controllers/entries.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/detectFace.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Function to hash a password
async function hashPassword(plainPassword) {
	const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
	const hashedPassword = await bcrypt.hash(plainPassword, salt);
	return hashedPassword;
}

// Function to verify a password
async function verifyPassword(plainPassword, hashedPassword) {
	const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
	return isMatch;
}

app.get('/', (req, res) => getAll.handleGetAll(req, res, db));

app.post('/',(req, res) => signIn.handleSignin(req, res, db, verifyPassword, sequelize));

app.get('/home', (req, res) => res.send('home page'));

app.post('/register',(req, res) => register.handleRegister(req, res, db, hashPassword, uuidv4));

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

app.post('/api/image', (req, res) => entries.handleEntriesIncrease(req, res, db));

app.post('/detect-face', (req, res) => image.handleDetectFace(req, res));

app.listen(8080, () => {
	console.log('app is runngin on port 3000!!!');
});
