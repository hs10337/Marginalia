import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import { MockDataProvider } from './context/MockDataContext';
import BriefScreen from './screens/BriefScreen';
import InboxScreen from './screens/InboxScreen';
import ChatScreen from './screens/ChatScreen';
import PeopleScreen from './screens/PeopleScreen';
import PersonScreen from './screens/PersonScreen';
import DesignSystem from './pages/DesignSystem';

const router = createBrowserRouter([
  { path: '/design-system', element: <DesignSystem /> },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/brief" replace /> },
      { path: 'brief', element: <BriefScreen /> },
      { path: 'inbox', element: <InboxScreen /> },
      { path: 'chat', element: <ChatScreen /> },
      { path: 'people', element: <PeopleScreen /> },
      { path: 'people/:id', element: <PersonScreen /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MockDataProvider>
      <RouterProvider router={router} />
    </MockDataProvider>
  </React.StrictMode>,
);
