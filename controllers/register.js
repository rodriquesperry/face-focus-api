const handleRegister = async (req, res, db, hashPassword, uuidv4) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json('Invalid form submission.');
	}

	try {
		const hash = await hashPassword(password);

		const existingUser = await db.User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		const uuid = uuidv4();

		await db.sequelize.transaction(async (t) => {
			// Insert into login table
			await db.Login.create(
				{
					id: uuid,
					email,
					hash,
				},
				{ transaction: t }
			);

			const user = await db.User.create(
				{
					id: uuid,
					name,
					email,
					entries: 0,
					joined: new Date(),
				},
				{ transaction: t }
			);

			res.json(user);
		});
	} catch (err) {
		console.error('Registration Error:', err); // 👈 Log full error
		if (err.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({ error: 'Email already in use.' });
		}
		return res
			.status(500)
			.json({ error: err.message || 'Something went wrong.' });
	}
};

module.exports = {
	handleRegister: handleRegister,
};
