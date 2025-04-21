const handleProfile = async (req, res) => {
	const { id } = req.params;
	let found = false;
	try {
		const user = await db.User.findOne({ where: { id } });
		if (user) {
			found = true;
			return res.json(user);
		}
	} catch (err) {
		if (!found) {
			return res.status(404).json('User not found.');
		}
		return res.status(500).json({ error: 'Something went wrong.' });
	}
};

module.exports = {
	handleProfile: handleProfile,
};
