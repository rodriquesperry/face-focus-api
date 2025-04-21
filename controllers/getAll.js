const handleGetAll = async (req, res) => {
	await db.User.findAll()
		.then((users) => res.send(users))
		.catch((err) => {
			res.status(500).json({ error: err.message || 'Unexpected Error' });
		});
};

module.exports = {
	handleGetAll: handleGetAll,
};
