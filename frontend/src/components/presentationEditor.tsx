import React, { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  TextFields as TextFieldsIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  AddBox as AddSlideIcon
} from '@mui/icons-material';
import { usePresentationStore } from '../store/presentationStore';
import SlideCanvas from './slideCanvas';
import UsersList from './usersList';

interface PresentationEditorProps {
  presentationId: string;
  nickname: string;
  onBack: () => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({
  presentationId,
  nickname,
  onBack
}) => {
  const {
    currentPresentation,
    slides,
    currentSlideIndex,
    users,
    currentUser,
    connected,
    connectSocket,
    disconnectSocket,
    setCurrentSlide,
    addTextElement,
    addSlide,
    deleteSlide
  } = usePresentationStore();

  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [slideMenuAnchor, setSlideMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(-1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    connectSocket(presentationId, nickname);
    
    return () => {
      disconnectSocket();
    };
  }, [presentationId, nickname, connectSocket, disconnectSocket]);

  const handleAddTextElement = () => {
    if (slides.length === 0) return;
    
    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return;

    const newElement = {
      type: 'text' as const,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      content: 'Double-click to edit',
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false
    };

    addTextElement(currentSlide.id, newElement);
  };

  const handleAddSlide = () => {
    if (currentUser?.role === 'creator') {
      addSlide();
    }
  };

  const handleSlideMenuOpen = (event: React.MouseEvent<HTMLElement>, slideIndex: number) => {
    if (currentUser?.role === 'creator') {
      setSlideMenuAnchor(event.currentTarget);
      setSelectedSlideIndex(slideIndex);
    }
  };

  const handleSlideMenuClose = () => {
    setSlideMenuAnchor(null);
  };

  const handleDeleteSlide = () => {
    if (selectedSlideIndex >= 0 && slides[selectedSlideIndex]) {
      setDeleteConfirmOpen(true);
    }
    handleSlideMenuClose();
  };

  const confirmDeleteSlide = () => {
    if (selectedSlideIndex >= 0 && slides[selectedSlideIndex] && currentUser?.role === 'creator') {
      deleteSlide(slides[selectedSlideIndex].id);
    }
    setDeleteConfirmOpen(false);
    setSelectedSlideIndex(0);
  };

  const canEdit = currentUser?.role === 'creator' || currentUser?.role === 'editor';
  const isCreator = currentUser?.role === 'creator';

  if (!connected || !currentPresentation) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Connecting to presentation...</Typography>
      </Box>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator': return <AdminIcon fontSize="small" />;
      case 'editor': return <EditIcon fontSize="small" />;
      case 'viewer': return <ViewIcon fontSize="small" />;
      default: return <ViewIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string): 'error' | 'primary' | 'default' => {
    switch (role) {
      case 'creator': return 'error';
      case 'editor': return 'primary';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {currentPresentation.name}
          </Typography>

          <Chip
            size="small"
            icon={<PeopleIcon />}
            label={`${users.length} users`}
            color={connected ? 'success' : 'error'}
            sx={{ mr: 2 }}
          />

          <Chip
            size="small"
            icon={getRoleIcon(currentUser?.role || 'viewer')}
            label={currentUser?.role}
            color={getRoleColor(currentUser?.role || 'viewer')}
            sx={{ mr: 2 }}
          />

          {canEdit && (
            <Tooltip title="Add Text">
              <IconButton onClick={handleAddTextElement} sx={{ mr: 1 }}>
                <TextFieldsIcon />
              </IconButton>
            </Tooltip>
          )}

          {isCreator && (
            <Tooltip title="Add Slide">
              <IconButton onClick={handleAddSlide} sx={{ mr: 1 }}>
                <AddSlideIcon />
              </IconButton>
            </Tooltip>
          )}

          <IconButton 
            onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
            sx={{ ml: 1 }}
          >
            <PeopleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Paper 
          elevation={1} 
          sx={{ 
            width: 280, 
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Slides ({slides.length})
            </Typography>
            {isCreator && (
              <Tooltip title="Add Slide">
                <IconButton size="small" onClick={handleAddSlide}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            {slides.map((slide, index) => (
              <ListItem key={slide.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={index === currentSlideIndex}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    border: '1px solid',
                    borderColor: index === currentSlideIndex ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      '&:hover': {
                        bgcolor: 'primary.100',
                      }
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 120,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 1,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: '90%',
                          height: '90%',
                          bgcolor: 'white',
                          border: '1px solid #eee',
                          borderRadius: 0.5,
                          position: 'relative'
                        }}
                      >
                        {slide.elements.slice(0, 3).map((element, i) => (
                          <Box
                            key={element.id}
                            sx={{
                              position: 'absolute',
                              left: `${(element.x / 800) * 100}%`,
                              top: `${(element.y / 600) * 100}%`,
                              width: `${Math.min((element.width / 800) * 100, 80)}%`,
                              height: `${Math.min((element.height / 600) * 100, 30)}%`,
                              bgcolor: 'primary.100',
                              borderRadius: 0.25,
                              opacity: 0.7
                            }}
                          />
                        ))}
                        {slide.elements.length > 3 && (
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 2,
                              right: 4,
                              fontSize: '8px',
                              color: 'text.secondary'
                            }}
                          >
                            +{slide.elements.length - 3}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ListItemText
                        primary={`Slide ${index + 1}`}
                        secondary={`${slide.elements.length} elements`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      
                      {isCreator && slides.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideMenuOpen(e, index);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
            
            {slides.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No slides yet
                </Typography>
                {isCreator && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddSlide}
                  >
                    Add First Slide
                  </Button>
                )}
              </Box>
            )}
          </List>
        </Paper>

        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          transition: 'all 0.225s cubic-bezier(0.0, 0, 0.2, 1)'
        }}>
          {slides.length > 0 && slides[currentSlideIndex] ? (
            <SlideCanvas
              slide={slides[currentSlideIndex]}
              canEdit={canEdit}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No slides available
              </Typography>
              {isCreator && (
                <Button
                  variant="contained"
                  startIcon={<AddSlideIcon />}
                  onClick={handleAddSlide}
                >
                  Create First Slide
                </Button>
              )}
            </Box>
          )}
        </Box>

        {rightDrawerOpen && (
          <Paper
            elevation={1}
            sx={{
              width: 300,
              borderRadius: 0,
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideIn 0.225s cubic-bezier(0.0, 0, 0.2, 1)'
            }}
          >
            <UsersList 
              users={users}
              currentUser={currentUser}
              isCreator={isCreator}
            />
          </Paper>
        )}
      </Box>

      <Menu
        anchorEl={slideMenuAnchor}
        open={Boolean(slideMenuAnchor)}
        onClose={handleSlideMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleDeleteSlide}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Slide
        </MenuItem>
      </Menu>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Slide</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Slide {selectedSlideIndex + 1}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteSlide} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresentationEditor;