import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CatalogPage from './domains/catalog/views/CatalogPage/CatalogPage';
import DrinkPage from './domains/catalog/domains/drink/views/DrinkPage/DrinkPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<DrinkPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
