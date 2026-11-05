import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformProvider } from './contexts/PlatformContext';
import { WorkspaceLayout } from './layouts/WorkspaceLayout';
import { HomePage } from './pages/HomePage';
import { ComponentsPage } from './pages/ComponentsPage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SnippetsPage } from './pages/SnippetsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ScrapePage } from './pages/ScrapePage';
import { ScrapeDetailPage } from './pages/ScrapeDetailPage';
import {
  CategoriesPage,
  DeveloperToolsPage,
  FavoritesPage,
  CollectionsPage,
  ProfilePage,
} from './pages/ToolsAndAccountPages';
import { OwnerStudioPage } from './pages/OwnerStudioPage';

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <WorkspaceLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/components/:slug" element={<ComponentDetailPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/snippets" element={<SnippetsPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/scrape" element={<ScrapePage />} />
            <Route path="/scrape/:slug" element={<ScrapeDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/tools" element={<DeveloperToolsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/owner/*" element={<OwnerStudioPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WorkspaceLayout>
      </BrowserRouter>
    </PlatformProvider>
  );
}
