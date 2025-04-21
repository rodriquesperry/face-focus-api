// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = 'c54460b16f71448d9bd4526ba359d620';
// Specify the correct User_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';


const handleDetectFace = async (req, res) => {
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
};

module.exports = {
	handleDetectFace: handleDetectFace,
};
