import React from 'react';
import ReactDOM from 'react-dom/client';
import SuperAdminDashboard from './superadmin/SuperAdminDashboard';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuperAdminDashboard />
  </React.StrictMode>,
);
