// controllers/detectFace.js

const CLARIFAI_FACE_MODEL_ID = "face-detection";
const CLARIFAI_USER_ID = "clarifai";
const CLARIFAI_APP_ID = "main";

const handleDetectFace = async (req, res) => {
  const { imgUrl } = req.body;

  if (!imgUrl) {
    return res.status(400).json({ error: "imgUrl is required" });
  }

  const pat = process.env.CLARIFAI_PAT?.trim();
  if (!pat || pat.length < 20) {
    return res.status(500).json({ error: "Missing/invalid CLARIFAI_PAT env var" });
  }

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/models/${CLARIFAI_FACE_MODEL_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${pat}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  url: imgUrl,
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Clarifai API error ${response.status}: ${text}`);
    }

    const data = await response.json();

    const regions = data?.outputs?.[0]?.data?.regions || [];

    // Normalize response to match your frontend expectations
    return res.json({
      outputs: [
        {
          data: {
            regions: regions.map((r) => ({
              region_info: {
                bounding_box: {
                  top_row: r?.region_info?.bounding_box?.top_row,
                  left_col: r?.region_info?.bounding_box?.left_col,
                  bottom_row: r?.region_info?.bounding_box?.bottom_row,
                  right_col: r?.region_info?.bounding_box?.right_col,
                },
              },
            })),
          },
        },
      ],
    });
  } catch (err) {
    console.error("Clarifai error:", err);
    return res.status(502).json({
      error: "clarifai_error",
      message: err.message,
    });
  }
};

module.exports = { handleDetectFace };
