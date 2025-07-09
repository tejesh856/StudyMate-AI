import axios from "axios";
import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });

export async function CodeLanguages(detectedLang = null) {
  try {
    const res = await axios.get(`${process.env.CODING_LANGUAGES_URL}`);
    const allLanguages = res.data;

    let filteredLanguages = allLanguages;

    if (detectedLang) {
      filteredLanguages = allLanguages.filter((lang) =>
        lang.language.toLowerCase().includes(detectedLang.toLowerCase()) ||
        lang.aliases.some((alias) =>
          alias.toLowerCase().includes(detectedLang.toLowerCase())
        )
      );
    }
    return {
      output: filteredLanguages,
      success: true,
    };
  } catch (err) {
    return {
      output: err.message,
      success: false,
    };
  }
}
