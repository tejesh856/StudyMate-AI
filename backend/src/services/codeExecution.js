import axios from "axios";

export async function runCodeWithPiston({ language, code, input,version }) {
  try {
    const res = await axios.post(`${process.env.CODING_EXECUTION_URL}`, {
      language: language,
      version: version,
      files: [
        {
          content: code,
        },
      ],
      stdin: input || '',
    });
    return {
      output: res.data.run.output?.trim(),
      success: true,
    };
  } catch (err) {
    return {
      output: err.message,
      success: false,
    };
  }
}