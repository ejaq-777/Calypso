import { useState } from 'react';
import App from './App.tsx';
import Warnings from './Warnings.tsx';
import Navigation from './Navigation.tsx';
import { type PageProps } from './types';

export default function Router() {
  const [currentView, setCurrentView] = useState('App');
  const [warningsOnly, setWarningsOnly] = useState(false);

  const sharedProps: PageProps = {
    setCurrentView,
    warningsOnly,
    setWarningsOnly,
  };

  switch (currentView) {
    case 'warnings':
      return <Warnings {...sharedProps} />;
    case 'navigation':
      return <Navigation {...sharedProps} />;
    case 'app':
    default:
      return <App {...sharedProps} />;
  }
}