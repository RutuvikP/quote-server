const express = require('express');
const cors=require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 8000;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.use(cors());
app.use(express.json());

// Set up API endpoint
app.get('/quote', async (req, res) => {
  const { keyword } = req.query;

  try {
    // Generate a quote using ChatGPT
    const prompt = `Generate a quote about "${keyword}"`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 50,
      n: 1,
      stop: '\n'
    });
    const quote=completion.data.choices[0].text
    console.log(completion.data);
    res.send(completion.data.choices[0].text)
  } catch (error) {
    console.error('Error generating quote:', error.message);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});