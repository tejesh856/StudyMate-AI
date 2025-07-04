import dotenv from 'dotenv';
import cloudinary from '../lib/cloudinary.js';
dotenv.config({ path: `${process.cwd()}/.env` });

export async function generateImageFromTopic(topic,prompt,quiz) {
  try {

    const response = await fetch(`${process.env.HUGGINGFACE_API_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY2}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        response_format: "b64_json",
        prompt,
        model: "black-forest-labs/flux-schnell",
        parameters: {
          num_inference_steps: 5
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Hugging Face API Error: ${response.status} ${errText}`);
    }

    const result = await response.json();

    // Get base64 image from response
    const base64Image = result?.data?.[0]?.b64_json;
    if (!base64Image) throw new Error("Image generation failed: No image in response");

    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(dataUrl, {
      folder: quiz?'quiz-banners':'course-banners',
      public_id: `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      overwrite: true,
      transformation: [
        { width: 800, crop: "limit" },
        { fetch_format: "auto" },
        { quality: "auto" },
      ],
    });

    return uploadRes.secure_url;

  } catch (err) {
    console.error("Hugging Face image generation error:", err);
    return null;
  }
}
