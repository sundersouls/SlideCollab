import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Add as AddIcon, 
  People as PeopleIcon, 
  Person as PersonIcon, 
  DarkMode, 
  LightMode 
} from '@mui/icons-material';
import { useThemeStore } from '../store/themeState';

interface PresentationListItem {
  id: string;
  name: string;
  creatorId: string;
  slideCount: number;
  activeUsers: number;
  createdAt: string;
}

function PresentationsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get('nickname');
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  if (!nickname) {
    navigate('/');
    return null;
  }

  const [presentations, setPresentations] = useState<PresentationListItem[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

  const fetchPresentations = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/presentations`);
      if (response.ok) {
        const data = await response.json();
        setPresentations(data);
      }
    } catch (error) {
      console.error('Error fetching presentations:', error);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleCreatePresentation = async () => {
    if (!newPresentationName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/presentations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPresentationName,
          creatorNickname: nickname,
        }),
      });

      if (response.ok) {
        const presentation = await response.json();
        setCreateDialogOpen(false);
        setNewPresentationName('');
        navigate(`/editor/${presentation.id}?nickname=${encodeURIComponent(nickname)}`);
      }
    } catch (error) {
      console.error('Error creating presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPresentation = (presentationId: string) => {
    navigate(`/editor/${presentationId}?nickname=${encodeURIComponent(nickname)}`);
  };

  const handleChangeNickname = () => {
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SlideCollab
          </Typography>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            title="Toggle Dark Mode"
            sx={{ mr: 1 }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          <Chip
            icon={<PersonIcon />}
            label={nickname}
            variant="outlined"
            sx={{ mr: 2, cursor: 'pointer' }}
            onClick={handleChangeNickname}
          />
          
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Presentation
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Presentations
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchPresentations}
            size="small"
          >
            Refresh
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {presentations.map((presentation) => (
            <Grid size={{xs:12, sm:6}} key={presentation.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  mb: 1,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => handleJoinPresentation(presentation.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {presentation.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      label={`${presentation.slideCount} slides`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      icon={<PeopleIcon />}
                      label={presentation.activeUsers}
                      color={presentation.activeUsers > 0 ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(presentation.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {presentations.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No presentations yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first presentation to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Presentation
            </Button>
          </Box>
        )}
      </Container>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Presentation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Presentation Name"
            fullWidth
            variant="outlined"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreatePresentation();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePresentation}
            variant="contained"
            disabled={!newPresentationName.trim() || loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PresentationsList;