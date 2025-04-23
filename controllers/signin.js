const handleSignin = async (req, res, db, verifyPassword, sequelize) => {
	const { email, password } = req.body;

	try {
		const user = await db.Login.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ error: 'User not found.' });
		}

		const isValid = await verifyPassword(password, user.hash);

		if (!isValid) {
			return res.status(400).json({ error: 'Password is not valid.' });
		}

		await db.sequelize.transaction(async (t) => {
			// Insert into login table
			const user = await db.Login.findOne(
				{ where: { email } },
				{ transaction: t }
			);

			const loggedInUser = await db.User.findOne(
				{ where: { id: user.id } },
				{ transaction: t }
			);

			res.json(loggedInUser);
		});

		res.json(user);
	} catch (err) {
		return res
			.status(500)
			.json({ error: err.message || 'Something went wrong.' });
	}
};

module.exports = {
	handleSignin: handleSignin,
};
