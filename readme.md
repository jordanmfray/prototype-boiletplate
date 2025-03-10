# AI Prototype Boilerplate

A full-stack React + Express + Prisma + OpenAI boilerplate for quickly building AI-powered prototypes.

## Features

- Express backend with OpenAI integration
- React frontend with Vite for fast development
- Radix-ui frontend comononents
- PostgreSQL database with Prisma ORM
- Concurrent development mode for frontend and backend
- Interactive setup script for quick start
- Database seeding with sample data

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database (local or remote)

## Getting Started

### Quick Setup (Recommended)

Run the interactive setup script:

```bash
npm run setup
```

This script will:
1. Create a `.env` file if it doesn't exist
2. Install dependencies (optional)
3. Push the Prisma schema to your database (optional)
4. Seed the database with sample data (optional)

### Manual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/prototype-boilerplate.git
cd prototype-boilerplate
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3000
```

Notes:
- Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Adjust the DATABASE_URL to match your PostgreSQL setup

#### 4. Set up the database

```bash
# Push the schema to the database
npm run prisma:push

# Seed the database with sample data
npm run prisma:seed
```

This will create the database tables based on the schema defined in `prisma/schema.prisma` and populate them with sample data.

#### 5. Start the development server

```bash
npm run dev
```

This will start both the backend server and the frontend development server concurrently.

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Project Structure

```
├── index.js                # Express server and API routes
├── prisma/                 # Prisma ORM configuration
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Database seeding script
├── src/                    # Frontend React application
│   ├── App.jsx             # Main React component
│   ├── main.jsx            # React entry point
├── .env                    # Environment variables
├── setup.js                # Interactive setup script
└── package.json            # Project dependencies and scripts
```

## Available Scripts

- `npm run setup` - Run the interactive setup script
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server
- `npm run prisma:push` - Push the Prisma schema to the database
- `npm run prisma:seed` - Seed the database with sample data
- `npm run prisma:reset` - Reset and seed the database (useful during development)

## Database Models

The boilerplate includes the following models:

### User
- Represents application users
- Has fields for authentication and profile information
- Has a one-to-many relationship with Pages

### Page
- Represents content pages created by users
- Belongs to a User (many-to-one relationship)
- Has a many-to-many relationship with Tags

### Tag
- Used for categorizing pages
- Has a many-to-many relationship with Pages

## Extending the Boilerplate

### Adding New API Routes

Add new routes in `index.js`:

```javascript
app.get('/api/your-endpoint', async (req, res) => {
  // Your code here
  res.json({ data: 'your data' });
});
```

### Adding New Database Models

Modify the `prisma/schema.prisma` file to add new models, then run:

```bash
npm run prisma:push
```

### Using OpenAI

The boilerplate includes a helper function for making OpenAI requests:

```javascript
const response = await ChatGPTRequest("Your prompt here", "gpt-4o-mini");
```

## Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy to your hosting provider of choice (Vercel, Netlify, Heroku, etc.)

## License

MIT

```bash
npm run start
nodemon index.js // to monitor changes automatically
```

### Running the app in dev mode (Vite)

```bash
npm run dev
```

### Pushing the schema to the database

```bash
npm run prisma:push
```

# Product Requirements Document (PRD)

### Overview

Build a dashboard that uses AI to generate insights based on impact data:
 - Milestone Reflections
 - Ratings
 - Reviews
 - Survey answers
 - Form responses

 ### Goals

 - Generate a compelling dashboard that excells at telling the story of the impact each program in the fund is having. 
 - Use "Storytelling" to help the user understand the impact of the programs.
 - Be able to take in all kinds of data and normalize it into a common format.

 ### Core Functionalities
  - Create an AI agent who's job is to suggest the best structure for the dashboard based on the data available.
    - Set the order of the sections
    - Pick the chart types for each data point from list of acceptale chart types (Bar, Line, Pie, Scatter, etc.)
  - Create an agents that generates an executive summary of the impact of a program.
  - Create an agent that can map available data to the best chart types for visualizing the data.
  - Create an agent that identifies trends and patterns in the data. 