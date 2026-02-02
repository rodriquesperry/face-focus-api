// controllers/detectFace.js
const { Model } = require("clarifai-nodejs");

const modelUrl = "https://clarifai.com/clarifai/main/models/face-detection";

const handleDetectFace = async (req, res) => {
  const { imgUrl } = req.body;

  if (!imgUrl) {
    return res.status(400).json({ error: "imgUrl is required" });
  }

  const pat = process.env.CLARIFAI_PAT;
  if (!pat) {
    return res.status(500).json({ error: "Missing CLARIFAI_PAT env var" });
  }

  try {
    // Create model instance using URL (no version lookup headaches)
    const model = new Model({
      url: modelUrl,
      authConfig: { pat },
    });

    const prediction = await model.predictByUrl({
      url: imgUrl,
      inputType: "image",
    });

    // prediction is an array; your frontend expects outputs[0].data.regions
    // Clarifai SDK uses regionsList (protobuf naming), so normalize it:
    const regionsList = prediction?.[0]?.data?.regionsList || [];

    // Convert to a Clarifai-REST-ish shape your frontend already handles
    return res.json({
      outputs: [
        {
          data: {
            regions: regionsList.map((r) => ({
              region_info: {
                bounding_box: {
                  top_row: r?.regionInfo?.boundingBox?.topRow,
                  left_col: r?.regionInfo?.boundingBox?.leftCol,
                  bottom_row: r?.regionInfo?.boundingBox?.bottomRow,
                  right_col: r?.regionInfo?.boundingBox?.rightCol,
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
      message: err?.message,
      status: err?.status || err?.response?.status,
    });
  }
};

module.exports = { handleDetectFace };
