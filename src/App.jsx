import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthForm } from './components/AuthForm';
import CreateSurvey from './pages/CreateSurvey';
import Dashboard from './pages/Dashboard';
import VoteSurvey from './pages/VoteSurvey';
import '@mantine/core/styles.css';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <>
      <MantineProvider defaultColorScheme="light">
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
