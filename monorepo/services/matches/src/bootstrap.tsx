import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MatchesPage from './domains/matches/views/MatchesPage/MatchesPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/matches" element={<MatchesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
