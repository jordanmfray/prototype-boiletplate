// Import necessary modules
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
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        tags: true
      }
    });
    
    // Get popular tags
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { pages: true }
        }
      }
    });
    
    const popularTags = tags
      .map(tag => ({ name: tag.name, count: tag._count.pages }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      recentPages,
      popularTags
    });
  } catch (error) {
    console.error('Error fetching example data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// User API endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { pages: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        pages: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Page API endpoints
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true
          }
        },
        tags: true
      }
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Increment view count
    await prisma.page.update({
      where: { id: page.id },
      data: { viewCount: { increment: 1 } }
    });
    
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// AI generation endpoint
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

// AI content enhancement endpoint
app.post('/api/ai/enhance-content', async (req, res) => {
  try {
    const { content, enhancementType } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    let prompt;
    switch (enhancementType) {
      case 'grammar':
        prompt = `Improve the grammar and readability of the following text without changing its meaning: "${content}"`;
        break;
      case 'expand':
        prompt = `Expand on the following text with more details and examples: "${content}"`;
        break;
      case 'summarize':
        prompt = `Summarize the following text in a concise way: "${content}"`;
        break;
      default:
        prompt = `Enhance the following text to make it more engaging and professional: "${content}"`;
    }
    
    const enhancedContent = await ChatGPTRequest(prompt);
    res.json({ enhancedContent });
  } catch (error) {
    console.error('Error enhancing content:', error);
    res.status(500).json({ error: 'Failed to enhance content' });
  }
});

// Helper function for OpenAI requests
async function ChatGPTRequest(prompt, model = "gpt-4o-mini") {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }]
    });
    
    const answer = response.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error("Error interacting with ChatGPT:", error);
    throw error;
  }
}

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});