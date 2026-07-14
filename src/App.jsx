import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthForm } from './components/AuthForm';
import CreateSurvey from './pages/CreateSurvey';
import Dashboard from './pages/Dashboard';
import VoteSurvey from './pages/VoteSurvey';
import SurveyResults from './pages/SurveyResults';
import { Navbar } from './components/Navbar';
import UserProfile from './pages/UserProfile';
import { UsersDashboard } from './pages/UsersDashboard';
import { SocialMatches } from './pages/SocialMatches';

import '@mantine/core/styles.css';
import { theme } from './theme';

function App() {
  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <BrowserRouter>
          <Navbar/>
          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/survey/:id" element={<VoteSurvey />} />
            <Route path="/results/:id" element={<SurveyResults />} />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <UsersDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/matches" 
              element={
                <ProtectedRoute>
                  <SocialMatches />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<AuthForm />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateSurvey />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  )
}

export default App
