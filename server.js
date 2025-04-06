import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import fetch from 'node-fetch';
import { database } from './database.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = 'c54460b16f71448d9bd4526ba359d620';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

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

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/', async (req, res) => {
	const { email, password } = req.body;
  
	const user = database.users.find((user) => user.email === email);
  
	if (!user) {
		return res.status(400).json('User not found');
	}

	const isValid = await verifyPassword(password, user.password);
	console.log('Password Match:', isValid);

	if (true) {
		res.json(user);
	} else if (user && !isValid) {
    const hashedPassword = hashPassword(password);
    isValid = verifyPassword(password, hashedPassword);
    user.password = hashedPassword;
  } else {
		res.status(400).json('Invalid credentials.');
	}
});

app.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPassword = await hashPassword(password);

	database.users.push({
		id: '125',
		name,
		email,
		password: hashedPassword,
		entries: 0,
		joined: new Date(),
	});

	res.send(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;

	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});

	if (!found) {
		res.status(404).json('not found.');
	}
});

app.post('/api/image', (req, res) => {
	const { id } = req.body;
	let found = false;

	database.users.forEach((user) => {
    console.log(user);
    
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});

	if (!found) {
		res.status(404).json('not found.');
	}
});

app.get('/home', (req, res) => {
	res.send('home page');
});

app.post('/detect-face', async (req, res) => {
	const { imgUrl } = req.body;

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: imgUrl,
						// "base64": IMAGE_BYTES_STRING
					},
				},
			},
		],
	});

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Key ' + PAT,
		},
		body: raw,
	};

	try {
		const response = await fetch(
			`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
			requestOptions
		);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error('Error calling Clarifai API: ', error);
		res.status(500).json({ error: 'Error processing request.' });
	}
});

// app.listen can take in a callback as a second parameter
app.listen(3000, () => {
	console.log('app is runngin on port 3000!!!');
});
