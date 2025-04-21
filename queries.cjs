const db = require('./models/index.js');

// Find all users
const query = async () => {
	// get all users
	const user = await db.User.findOne();
	console.log('All users: ', JSON.stringify(user, null, 2));
};

query();
