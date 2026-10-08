import React from 'react';
import './global.css';
import { AppProviders } from '@/providers';
import { RootNavigator } from '@/navigation/root-navigator';

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
