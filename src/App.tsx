import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Flex, Box, Text, Heading, Link as RadixLink, Card, Badge, Avatar, Grid, Button, Strong, Code, Separator, TextArea, TextField } from '@radix-ui/themes';
import { Page, AIResponse } from './types';

// Home page - now displays recent pages from the database
function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch('/api/pages');
        const data = await response.json();
        setPages(data.slice(0, 3)); // Get only the first 3 pages
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  return (
    <Container size="4">
      <Box mb="6">
        <Heading size="6" mb="2">Welcome to AI Prototype Boilerplate</Heading>
        <Text color="gray" mb="4">
          A full-stack React + Express + Prisma + Radix UI + OpenAI starter kit for building AI-powered applications.
        </Text>
      </Box>
      <Box p="4" style={{ backgroundColor: 'var(--blue-2)', borderLeft: '4px solid var(--blue-9)' }}>
        <Heading size="4" mb="2">Quick Start Guide</Heading>
        <Text mb="3">
          This boilerplate provides everything you need to quickly prototype AI-powered applications:
        </Text>
        <Box pl="5" mb="3" asChild>
          <ul style={{ listStyleType: 'disc' }}>
            <li><Text>React frontend with Radix UI components</Text></li>
            <li><Text>Express backend with API endpoints</Text></li>
            <li><Text>PostgreSQL database with Prisma ORM</Text></li>
            <li><Text>OpenAI integration for AI features</Text></li>
            <li><Text>User and content models with relationships</Text></li>
          </ul>
        </Box>
        <Text mb="3">
          <Strong>To start prototyping:</Strong>
        </Text>
        <Box pl="5" mb="3" asChild>
          <ol style={{ listStyleType: 'decimal' }}>
            <li><Text>Modify the database schema in <Code>prisma/schema.prisma</Code> for your data model</Text></li>
            <li><Text>Add new API endpoints in <Code>index.ts</Code></Text></li>
            <li><Text>Create new React components in <Code>src/components/</Code></Text></li>
            <li><Text>Customize the AI integration in the <Code>ChatGPTRequest</Code> function</Text></li>
          </ol>
        </Box>
        <Text>
          Explore the <Link to="/pages" style={{ color: 'var(--blue-9)', textDecoration: 'none' }}>example pages</Link> to see how everything works together, or check out the <Link to="/ai-demo" style={{ color: 'var(--blue-9)', textDecoration: 'none' }}>AI demo</Link> to test the OpenAI integration.
        </Text>
      </Box>
      
      {loading ? (
        <Text mt="4">Loading recent pages...</Text>
      ) : (
        <Box mt="6">
          <Heading size="4" mb="3">Recent Pages</Heading>
          <Grid columns={{ initial: '1', sm: '3' }} gap="4">
            {pages.map(page => (
              <Card key={page.id}>
                <Link to={`/pages/${page.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Box p="4">
                    <Heading size="3" mb="2">{page.title}</Heading>
                    <Text size="2" color="gray">{page.description}</Text>
                  </Box>
                </Link>
              </Card>
            ))}
          </Grid>
          <Box mt="4">
            <Link to="/pages">
              <Button variant="soft">View All Pages</Button>
            </Link>
          </Box>
        </Box>
      )}
    </Container>
  );
}

// Pages component to demonstrate User and Page models
function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch('/api/pages');
        const data = await response.json();
        setPages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  return (
    <Container size="4">
      <Heading size="6" mb="4">All Pages</Heading>
      
      {loading ? (
        <Text>Loading pages...</Text>
      ) : (
        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          {pages.map(page => (
            <Card key={page.id}>
              <Link to={`/pages/${page.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Flex direction="column" p="4">
                  <Heading size="4" mb="2">{page.title}</Heading>
                  <Text color="gray" size="2" mb="3">{page.description}</Text>
                  <Flex justify="between" align="center">
                    <Text size="1" color="gray">Created: {new Date(page.createdAt).toLocaleDateString()}</Text>
                    <Badge size="1">{page.category}</Badge>
                  </Flex>
                </Flex>
              </Link>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}

// Single Page component
function PageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch(`/api/pages/${slug}`);
        if (!response.ok) {
          throw new Error('Page not found');
        }
        const data = await response.json();
        setPage(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) return (
    <Container size="3">
      <Box py="8" style={{ textAlign: 'center' }}>
        <Text>Loading page...</Text>
      </Box>
    </Container>
  );

  if (error) return (
    <Container size="3">
      <Box py="8" style={{ textAlign: 'center' }}>
        <Heading size="5" mb="4" color="red">Error</Heading>
        <Text>{error}</Text>
        <Box mt="6">
          <Link to="/pages">
            <Button variant="soft">Back to Pages</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );

  if (!page) return (
    <Container size="3">
      <Box py="8" style={{ textAlign: 'center' }}>
        <Text>Page not found</Text>
      </Box>
    </Container>
  );

  return (
    <Container size="3">
      <Card>
        <Flex direction="column" p="6" gap="4">
          <Heading size="6">{page.title}</Heading>
          
          <Flex align="center" gap="2">
            <Text size="2" color="gray">
              By: {page.author} | Created: {new Date(page.createdAt).toLocaleDateString()}
            </Text>
            <Badge size="1">{page.category}</Badge>
          </Flex>
          
          {page.tags && page.tags.length > 0 && (
            <Flex gap="2" wrap="wrap">
              {page.tags.map(tag => (
                <Badge key={tag} size="1" variant="soft">{tag}</Badge>
              ))}
            </Flex>
          )}
          
          <Separator size="4" />
          
          <Box>
            <Text as="div" style={{ whiteSpace: 'pre-wrap' }}>
              {page.content}
            </Text>
          </Box>
        </Flex>
      </Card>
      
      <Box mt="6">
        <Link to="/pages">
          <Button variant="soft">Back to Pages</Button>
        </Link>
      </Box>
    </Container>
  );
}

// AI Demo component
function AIDemo() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate response');
      }

      const data: AIResponse = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error generating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="3">
      <Heading size="6" mb="4">AI Demo</Heading>
      <Text color="gray" mb="6">
        Test the OpenAI integration by asking questions or requesting content generation.
      </Text>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" p="6" gap="4">
            <Box>
              <Text as="div" size="2" mb="2" weight="bold">
                Your Prompt
              </Text>
              <TextArea
                placeholder="Ask me anything or request content generation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                required
              />
            </Box>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Response'}
            </Button>
          </Flex>
        </form>
      </Card>
      
      {response && (
        <Card mt="4">
          <Box p="6">
            <Text as="div" size="2" mb="2" weight="bold">
              AI Response
            </Text>
            <Text as="div" style={{ whiteSpace: 'pre-wrap' }}>
              {response}
            </Text>
          </Box>
        </Card>
      )}
    </Container>
  );
}

function App() {
  return (
    <Box>
      <Box p="4" style={{ backgroundColor: 'var(--gray-1)', borderBottom: '1px solid var(--gray-6)' }}>
        <Container size="4">
          <Flex justify="between" align="center">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Heading size="4">AI Prototype Boilerplate</Heading>
            </Link>
            <Flex gap="4">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text>Home</Text>
              </Link>
              <Link to="/pages" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text>Pages</Text>
              </Link>
              <Link to="/ai-demo" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text>AI Demo</Text>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
      
      <Box py="6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/pages/:slug" element={<PageDetail />} />
          <Route path="/ai-demo" element={<AIDemo />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App; 