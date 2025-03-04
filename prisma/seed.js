import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.tag.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  console.log('Creating users...');
  const password = await hashPassword('password123');

  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Doe',
      passwordHash: password,
      role: 'ADMIN',
      bio: 'AI researcher and developer with 5+ years of experience',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Smith',
      passwordHash: password,
      role: 'USER',
      bio: 'Full-stack developer specializing in API design and implementation',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
  });

  const alex = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      name: 'Alex Johnson',
      passwordHash: password,
      role: 'USER',
      bio: 'UX designer and frontend developer passionate about creating intuitive interfaces',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
  });

  // Create tags
  console.log('Creating tags...');
  const aiTag = await prisma.tag.create({
    data: {
      name: 'AI',
    },
  });

  const developmentTag = await prisma.tag.create({
    data: {
      name: 'Development',
    },
  });

  const apiTag = await prisma.tag.create({
    data: {
      name: 'API',
    },
  });

  const backendTag = await prisma.tag.create({
    data: {
      name: 'Backend',
    },
  });

  const frontendTag = await prisma.tag.create({
    data: {
      name: 'Frontend',
    },
  });

  const uxTag = await prisma.tag.create({
    data: {
      name: 'UX',
    },
  });

  // Create pages
  console.log('Creating pages...');
  await prisma.page.create({
    data: {
      title: 'Getting Started with AI Development',
      slug: 'getting-started-ai',
      content: `# Getting Started with AI Development

This is a comprehensive guide to getting started with AI development. 

## Prerequisites
- Basic programming knowledge
- Understanding of data structures
- Familiarity with Python

## First Steps
1. Learn about machine learning concepts
2. Explore different AI frameworks
3. Start with simple projects to build experience

AI development is an exciting field with endless possibilities. Whether you're interested in natural language processing, computer vision, or reinforcement learning, there's something for everyone.`,
      isPublished: true,
      viewCount: 120,
      userId: jane.id,
      tags: {
        connect: [
          { id: aiTag.id },
          { id: developmentTag.id }
        ]
      }
    },
  });

  await prisma.page.create({
    data: {
      title: 'Building Robust APIs',
      slug: 'building-robust-apis',
      content: `# Building Robust APIs

Creating reliable and scalable APIs is essential for modern applications.

## Key Principles
- Design with the user in mind
- Use proper authentication and authorization
- Implement comprehensive error handling
- Document thoroughly

## Best Practices
1. Use versioning to manage changes
2. Implement rate limiting
3. Provide clear error messages
4. Use appropriate HTTP status codes

A well-designed API can significantly improve the developer experience and the overall quality of your application.`,
      isPublished: true,
      viewCount: 85,
      userId: john.id,
      tags: {
        connect: [
          { id: apiTag.id },
          { id: backendTag.id }
        ]
      }
    },
  });

  await prisma.page.create({
    data: {
      title: 'Modern Frontend Development Techniques',
      slug: 'modern-frontend-development',
      content: `# Modern Frontend Development Techniques

Frontend development has evolved significantly in recent years, with new frameworks, tools, and best practices emerging regularly.

## Current Trends
- Component-based architecture
- State management solutions
- Server-side rendering and static site generation
- CSS-in-JS and utility-first CSS

## Essential Tools
1. Modern JavaScript (ES6+)
2. React, Vue, or Angular
3. Testing frameworks like Jest

Staying up-to-date with frontend development requires continuous learning and adaptation to new technologies and approaches.`,
      isPublished: true,
      viewCount: 62,
      userId: alex.id,
      tags: {
        connect: [
          { id: frontendTag.id },
          { id: developmentTag.id }
        ]
      }
    },
  });

  await prisma.page.create({
    data: {
      title: 'Designing Intuitive User Experiences',
      slug: 'designing-intuitive-ux',
      content: `# Designing Intuitive User Experiences

Creating intuitive user experiences is crucial for the success of any digital product.

## UX Principles
- Focus on user needs and goals
- Maintain consistency throughout the interface
- Provide clear feedback for user actions
- Keep the interface simple and intuitive

## Design Process
1. User research and persona development
2. Information architecture and user flows
3. Wireframing and prototyping
4. Usability testing and iteration

A well-designed user experience can significantly increase user satisfaction, engagement, and conversion rates.`,
      isPublished: true,
      viewCount: 45,
      userId: alex.id,
      tags: {
        connect: [
          { id: uxTag.id },
          { id: frontendTag.id }
        ]
      }
    },
  });

  await prisma.page.create({
    data: {
      title: 'Introduction to Natural Language Processing',
      slug: 'intro-to-nlp',
      content: `# Introduction to Natural Language Processing

Natural Language Processing (NLP) is a field of AI focused on enabling computers to understand, interpret, and generate human language.

## Key Concepts
- Tokenization and text preprocessing
- Part-of-speech tagging
- Named entity recognition
- Sentiment analysis
- Text classification

## Popular NLP Libraries
1. NLTK (Natural Language Toolkit)
2. spaCy
3. Hugging Face Transformers
4. Stanford NLP

NLP has numerous applications, from chatbots and virtual assistants to content analysis and machine translation.`,
      isPublished: true,
      viewCount: 98,
      userId: jane.id,
      tags: {
        connect: [
          { id: aiTag.id },
          { id: developmentTag.id }
        ]
      }
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 