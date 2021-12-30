import React from 'react';
import Stock from './Stock';
import './App.css';
import LoginButton from './user_registration_components/LoginButton'
import LogoutButton from './user_registration_components/LogoutButton'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { isLoading } = useAuth0();
  
  if (isLoading) return <div>Loading ...</div>

  return (
    <div className="App">
      <div>
        <LoginButton />
        <LogoutButton />
      </div>
      <Stock></Stock>
    </div>
  );
}

export default App;
