import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = "Write the following sentence in  5 various tones of voice and style. Use proper grammar. Create a new line before each example.";

const generateAction = async (req, res) => {
   console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.4,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
