import { useState } from 'react';
import App from './App.tsx';
import Warnings from './Warnings.tsx';
import Navigation from './Navigation.tsx';

export default function Router() {
  const [currentView, setCurrentView] = useState('App');

  switch (currentView) {
    case 'warnings':
      return <Warnings setCurrentView={setCurrentView} />;
    case 'navigation':
      return <Navigation setCurrentView={setCurrentView} />;
    case 'app':
    default:
      return <App setCurrentView={setCurrentView} />;
  }
}