import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// Import Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('dist'));

// OpenAI
import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

// Example API endpoint - now uses the database
app.get('/api/example', async (req, res) => {
  try {
    // Fetch recent pages from the database
    const recentPages = await prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        tags: true
      }
    });
    
    res.json(recentPages);
  } catch (error) {
    console.error('Error fetching example data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get all pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true
      }
    });
    
    // Transform the data for the frontend
    const transformedPages = pages.map(page => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      description: page.content.substring(0, 150) + '...',
      category: page.tags.length > 0 ? page.tags[0].name : 'Uncategorized',
      createdAt: page.createdAt,
      author: page.authorName,
      authorEmail: page.authorEmail
    }));
    
    res.json(transformedPages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get a single page by slug
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        tags: true
      }
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Transform the data for the frontend
    const transformedPage = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      description: page.content.substring(0, 150) + '...',
      category: page.tags.length > 0 ? page.tags[0].name : 'Uncategorized',
      createdAt: page.createdAt,
      author: page.authorName,
      authorEmail: page.authorEmail,
      tags: page.tags.map(tag => tag.name)
    };
    
    res.json(transformedPage);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// AI endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await ChatGPTRequest(prompt);
    
    res.json({ response });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// Function to make requests to ChatGPT
async function ChatGPTRequest(prompt, model = "gpt-4o-mini") {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error making OpenAI request:', error);
    throw new Error('Failed to generate AI response');
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});