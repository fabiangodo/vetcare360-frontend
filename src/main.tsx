import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';
import App from './App';

const env = (import.meta as any).env;

const cognitoAuthConfig: AuthProviderProps = {
    authority: 'https://cognito-idp.' + env.VITE_AWS_REGION + '.amazonaws.com/' + env.VITE_COGNITO_USER_POOL_ID,
    client_id: env.VITE_COGNITO_APP_CLIENT_ID,
    redirect_uri: "http://localhost:5173",
    post_logout_redirect_uri: "http://localhost:5173",
    response_type: "code",
    scope: "email openid phone",
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
);