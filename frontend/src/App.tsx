import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import { useThemeStore } from './store/themeState';
import NicknameEntry from './pages/nicknameEntry';
import PresentationsList from './pages/presentationListPage';
import EditorWrapper from './pages/editPage';

function App() {
  const { darkMode } = useThemeStore();
  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<NicknameEntry onNicknameSet={() => {}} />} />
          <Route path="/presentations" element={<PresentationsList />} />
          <Route path="/editor/:presentationId" element={<EditorWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;