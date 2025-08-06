import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Person as PersonIcon, DarkMode, LightMode } from '@mui/icons-material';
import { useThemeStore } from '../store/themeState';

interface NicknameEntryProps {
  onNicknameSet: (nickname: string) => void;
}

function NicknameEntry({ onNicknameSet }: NicknameEntryProps) {
  const [tempNickname, setTempNickname] = useState('');
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useThemeStore();

  const handleNicknameSubmit = () => {
    if (!tempNickname.trim()) return;
    onNicknameSet(tempNickname.trim());
    navigate(`/presentations?nickname=${encodeURIComponent(tempNickname.trim())}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          mx: 2,
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.main',
            mx: 'auto',
            mb: 2
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          SlideCollab
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter your nickname to get started with collaborative presentations
        </Typography>
        
        <TextField
          fullWidth
          label="Your Nickname"
          variant="outlined"
          value={tempNickname}
          onChange={(e) => setTempNickname(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleNicknameSubmit();
            }
          }}
          sx={{ mb: 3 }}
          autoFocus
        />
        
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleNicknameSubmit}
          disabled={!tempNickname.trim()}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
}

export default NicknameEntry;