// Import necessary modules
import dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';
import { load } from 'cheerio';
import TurndownService from 'turndown';
import OpenAI from 'openai';
import pkg from '@prisma/client';
const { PrismaClient, Organization, User } = pkg;

// Load environment variables
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const app = express();

const prisma = new PrismaClient();
const turndownService = new TurndownService();
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

// Find or create organization in database by EIN
async function findOrCreateOrganizationByEin(ein) {
    let organization = await prisma.organization.findFirst({
        where: {
            Ein: ein
        }
    });

    if (!organization) {
        console.log("Creating new organization with EIN: " + ein);
        // Scrape GuideStar nonprofit profile
        const guideStarProfile = await scrapeGuideStarProfileByEin(ein);
        const profileData = JSON.parse(guideStarProfile);
        
        // Create a new organization with just the EIN
        const newOrganization = await prisma.organization.create({
            data: { 
                Ein: ein,
                Name: profileData.Name,
                WebsiteUrl: profileData.WebsiteUrl,
                GuideStarURL: `https://www.guidestar.org/profile/${ein}`,
                NteeCode: profileData.NteeCode,
                NteeDescription: profileData.NteeDescription,
                BusinessZip: profileData.ZipCode,
            }
        });
        return newOrganization;
    }
    return organization;
}

const organization = await findOrCreateOrganizationByEin('75-3139219');
console.log("New organization created: " + organization);

//Scrape GuideStar nonprofit profile and save to database
async function scrapeGuideStarProfileByEin(ein) {
    const response = await axios.get(`https://www.guidestar.org/profile/${ein}`);
    const html = response.data;
    const markdown = turndownService.turndown(html);
    const prompt = 'Extract the following data from the nonprofit profile using the following key value pairs: ' +
    'Name\n' +
    'WebsiteUrl\n' +
    'NteeCode\n' +
    'NteeDescription\n' +
    'ZipCode\n' +
    '\n' +
    'Return the data in JSON format. Only return the JSON, no other text or comments.\n' +
    'Here is the profile: ' + markdown;
    const profileData = await ChatGPTRequest(prompt);
    console.log("Profile data: " + profileData);
    return profileData;
}

async function ChatGPTRequest(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }]
        });
        
        const answer = response.choices[0].message.content;
        return answer;
    } catch (error) {
        console.error("Error interacting with ChatGPT:", error);
    }
}

// Function to get unique URLs from HTML
function get_unique_urls_from_html(html, starting_with_url) {
    const urls = [];
    const $ = load(html);
    $('a').each((index, a) => {
        const href = $(a).attr('href');
        if (!href) return;

        // Convert relative URLs to absolute
        const absoluteUrl = new URL(href, starting_with_url).href;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:') || href.includes('#') || href.startsWith('javascript:')) return;

        if (absoluteUrl.startsWith(starting_with_url)) {
            urls.push(absoluteUrl);
        }
    });
    return [...new Set(urls)];
}

// Function to scrape a URL and return HTML and Markdown
async function scrapeUrl(url_to_scrape) {
    try {
        const response = await axios.get(url_to_scrape);
        const html = response.data;
        // console.log(html);
        const markdown = turndownService.turndown(html);
        // console.log(markdown);
        return { html, markdown }; // Return both HTML and Markdown
    } catch (error) {
        console.error('Error fetching data:', error);
        return { html: null, markdown: null }; // Return nulls in case of error
    }
}

// Function to scrape a URL and extract unique URLs
async function scrapeAndExtractUrls(url_to_scrape) {
    try {
        const { html, markdown } = await scrapeUrl(url_to_scrape);
        if (html) {
            const urls_on_page = get_unique_urls_from_html(html, url_to_scrape);
            return urls_on_page; // Return the extracted URLs
        }
        return [];
    } catch (error) {
        console.error('Error scraping and extracting URLs:', error);
        return [];
    }
}

const urls = await scrapeAndExtractUrls('https://pastorserve.org');
// console.log('Extracted URLs:', urls);

const urls_to_scrape = await ChatGPTRequest(
    `Below is a list of URLs from the nonprofit organization's website:
    ${urls.map((u, i) => `${i + 1}. ${u}`).join('\n')}

        return up to 10 urls that are most likely to contain content about the organization, their programs, and their impact.
        Do not include url's that appear to be blog posts, login pages, privacy policies, or other non-content pages.
        Return the urls in an array format using JSON.stringify().
    `
);
const parsedUrls = JSON.parse(urls_to_scrape);
console.log("URLs to scrape: " + parsedUrls);

console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");


// await prisma.organization.update({
//     where: { 
//         website_url: url_to_scrape,
//         name: 'Pastorserve'
//      }
// });