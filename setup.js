#!/usr/bin/env node

/**
 * Setup script for AI Prototype Boilerplate
 * This script helps users set up the project quickly
 */

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 Welcome to AI Prototype Boilerplate Setup!\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('Creating .env file from .env.example...');
  
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created successfully!');
    console.log('⚠️ Please update the values in .env with your actual credentials.');
  } else {
    console.log('❌ .env.example file not found. Creating a basic .env file...');
    
    const basicEnv = `OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
PORT=3000`;
    
    fs.writeFileSync('.env', basicEnv);
    console.log('✅ Basic .env file created. Please update with your actual credentials.');
  }
} else {
  console.log('✅ .env file already exists.');
}

// Ask if user wants to install dependencies
rl.question('\nDo you want to install dependencies? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\nInstalling dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully!');
    } catch (error) {
      console.error('❌ Error installing dependencies:', error.message);
    }
  }

  // Ask if user wants to push the Prisma schema
  rl.question('\nDo you want to push the Prisma schema to the database? (y/n): ', (schemaPushAnswer) => {
    if (schemaPushAnswer.toLowerCase() === 'y') {
      console.log('\nPushing Prisma schema to database...');
      try {
        execSync('npm run prisma:push', { stdio: 'inherit' });
        console.log('✅ Prisma schema pushed successfully!');
        
        // Ask if user wants to seed the database
        rl.question('\nDo you want to seed the database with sample data? (y/n): ', (seedAnswer) => {
          if (seedAnswer.toLowerCase() === 'y') {
            console.log('\nSeeding the database...');
            try {
              execSync('npm run prisma:seed', { stdio: 'inherit' });
              console.log('✅ Database seeded successfully!');
              finishSetup();
            } catch (error) {
              console.error('❌ Error seeding database:', error.message);
              console.log('⚠️ Make sure your DATABASE_URL in .env is correct and the database is running.');
              finishSetup();
            }
          } else {
            finishSetup();
          }
        });
      } catch (error) {
        console.error('❌ Error pushing Prisma schema:', error.message);
        console.log('⚠️ Make sure your DATABASE_URL in .env is correct and the database is running.');
        finishSetup();
      }
    } else {
      finishSetup();
    }
  });
});

function finishSetup() {
  console.log('\n🎉 Setup complete! You can now start the development server with:');
  console.log('npm run dev');
  console.log('\nThis will start both the backend and frontend servers concurrently.');
  console.log('- Backend: http://localhost:3000');
  console.log('- Frontend: http://localhost:5173');
  
  console.log('\nOther useful commands:');
  console.log('- npm run prisma:reset - Reset and seed the database');
  console.log('- npm run prisma:seed - Seed the database with sample data');
  console.log('- npm run build - Build the frontend for production');
  console.log('- npm run start - Start the production server\n');
  
  rl.close();
} 