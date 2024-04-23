import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const basePromptPrefix = "Write the following sentence in 5 various tones of voice and style. Use proper grammar.";

const generateAction = async (req, res) => {
  try {
    const prompt = `${basePromptPrefix} ${req.body.userInput}`;
    console.log(`API Prompt: ${prompt}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{role: "system", content: prompt}],
      temperature: 0.4,
      max_tokens: 250,
    });

    const basePromptOutput = completion.choices[0].message.content;
    console.log("Log: " + basePromptOutput);

    // Parse the output to create a structured JSON response
    const outputs = basePromptOutput.split('\n').map(line => {
      const parts = line.split(':');
      return {
        tone: parts[0].trim().split('.')[1].trim(), // Extracting tone description
        message: parts[1].trim() // Extracting the message
      };
    });

    res.status(200).json({ outputs });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "An error occurred while generating the sentences." });
  }
};

export default generateAction;
