require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT || 5432,
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false, // only if you're not verifying certs
			},
		},
	},
	test: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT || 5432,
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false, // only if you're not verifying certs
			},
		},
	},
	production: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT || 5432,
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false, // only if you're not verifying certs
			},
		},
	},
};
