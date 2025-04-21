const handleEntriesIncrease = async (req, res, db) => {
	const { id } = req.body;
	let found = false;

	try {
		const user = await db.User.findOne({ where: { id } });

		if (user) {
			found = true;
			user.entries++;
			await user.save();
			return res.json(user.entries);
		}
	} catch (err) {
		if (!found) {
			return res.status(404).json('User not found.');
		}
		return res
			.status(500)
			.json({ error: 'Something went wrong updating your entries.' });
	}
};

module.exports = {
	handleEntriesIncrease: handleEntriesIncrease,
};
