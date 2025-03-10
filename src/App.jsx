import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Flex, Box, Text, Heading, Link as RadixLink, Card, Badge, Avatar, Grid, Button, Strong, Code, Separator, TextArea, TextField } from '@radix-ui/themes';

// Home page - now displays recent pages from the database
function Home() {
  const [pages, setPages] = useState([]);
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
            <li><Text>Add new API endpoints in <Code>index.js</Code></Text></li>
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
  const [pages, setPages] = useState([]);
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
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  if (loading) return (
    <Container size="3">
      <Box py="8" textAlign="center">
        <Text>Loading page...</Text>
      </Box>
    </Container>
  );

  if (error) return (
    <Container size="3">
      <Box py="8" textAlign="center">
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
          
          <Separator size="4" my="2" />
          
          <Text size="3">{page.description}</Text>
          
          <Box style={{ whiteSpace: 'pre-wrap' }}>
            {page.content}
          </Box>
          
          <Box mt="4">
            <Link to="/pages">
              <Button variant="soft">Back to Pages</Button>
            </Link>
          </Box>
        </Flex>
      </Card>
    </Container>
  );
}

function AIDemo() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      setResponse(data.response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container size="3">
      <Card>
        <Flex direction="column" p="6" gap="4">
          <Heading size="6">AI Demo</Heading>
          <Text color="gray">Enter a prompt to generate a response using AI</Text>
          
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextArea 
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                size="3"
              />
              
              <Box>
                <Button type="submit" disabled={loading} color="purple">
                  {loading ? 'Generating...' : 'Generate Response'}
                </Button>
              </Box>
            </Flex>
          </form>
          
          {error && (
            <Box p="3" style={{ backgroundColor: 'var(--red-3)', borderRadius: 'var(--radius-3)' }}>
              <Text color="red">{error}</Text>
            </Box>
          )}
          
          {response && (
            <Box mt="4">
              <Heading size="4" mb="2">Response:</Heading>
              <Box p="4" style={{ 
                backgroundColor: 'var(--gray-2)', 
                borderRadius: 'var(--radius-3)',
                whiteSpace: 'pre-wrap'
              }}>
                <Text>{response}</Text>
              </Box>
            </Box>
          )}
        </Flex>
      </Card>
    </Container>
  );
}

function App() {
  return (
    <Flex direction="column" style={{ minHeight: '100vh' }}>
      <Box style={{ backgroundColor: 'var(--gray-2)' }}>
        <Container size="4">
          <Flex py="4" justify="between" align="center">
            <Flex align="center" gap="4">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Heading size="5" style={{ color: 'var(--gray-12)' }}>AI Prototype</Heading>
              </Link>
              <Flex as="nav" gap="5">
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--gray-12)' }}>
                  <Text>Home</Text>
                </Link>
                <Link to="/pages" style={{ textDecoration: 'none', color: 'var(--gray-12)' }}>
                  <Text>Pages</Text>
                </Link>
                <Link to="/ai-demo" style={{ textDecoration: 'none', color: 'var(--gray-12)' }}>
                  <Text>AI Demo</Text>
                </Link>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Box py="8" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/pages/:slug" element={<PageDetail />} />
          <Route path="/ai-demo" element={<AIDemo />} />
        </Routes>
      </Box>

      <Box style={{ backgroundColor: 'var(--gray-2)' }}>
        <Container size="4">
          <Flex py="4" justify="between" align="center">
            <Text size="2" color="gray">© 2023 AI Prototype Boilerplate</Text>
            <Flex gap="4">
              <RadixLink href="https://github.com" target="_blank" size="2">GitHub</RadixLink>
              <RadixLink href="https://openai.com" target="_blank" size="2">OpenAI</RadixLink>
              <RadixLink href="https://radix-ui.com" target="_blank" size="2">Radix UI</RadixLink>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}

export default App;

