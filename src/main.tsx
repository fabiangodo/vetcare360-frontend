import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Gz8tIv6dd",
  client_id: "3j84mt3n833o1qucrr2uuo3ohc",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "openid", // <-- Solo 'openid' para asegurar la autorización inicial
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);