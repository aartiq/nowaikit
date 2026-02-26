import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { SetupWizard } from './pages/SetupWizard';
import { ToolBrowser } from './pages/ToolBrowser';
import { AuditLog } from './pages/AuditLog';
import { Settings } from './pages/Settings';
import { Instances } from './pages/Instances';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="setup" element={<SetupWizard />} />
          <Route path="tools" element={<ToolBrowser />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="instances" element={<Instances />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
