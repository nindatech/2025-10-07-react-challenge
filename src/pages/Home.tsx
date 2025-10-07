import { Link } from 'react-router-dom';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom>
        React Technical Assessment
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Challenge Instructions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This assessment contains two challenges to evaluate your React skills:
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Paper elevation={3} sx={{ p: 3, borderLeft: 4, borderColor: 'primary.main' }}>
          <Typography variant="h5" gutterBottom>
            Challenge 1: Vanilla JS → React
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Convert a vanilla JavaScript/HTML application to React with hooks and proper state management.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/legacy.html"
            target="_blank"
          >
            Open Challenge 1
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, borderLeft: 4, borderColor: 'error.main' }}>
          <Typography variant="h5" gutterBottom>
            Challenge 2: Fix React Anti-patterns
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Identify and fix performance issues and React anti-patterns in a poorly optimized component.
          </Typography>
          <Button
            variant="contained"
            color="error"
            component={Link}
            to="/products"
          >
            Open Challenge 2
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
