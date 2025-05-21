import React from 'react'
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { UserProvider } from '../contexts/UserContext';

// Configure Amplify with environment variables for Cognito
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
        }
    }
})

// Customize form fields for the sign-up screen
const formFields = {
    signUp: {
      username: {
        order: 1,
        placeholder: "Choose a username",
        label: "Username",
        inputProps: { required: true },
      },
      email: {
        order: 1,
        placeholder: "Enter your email address",
        label: "Email",
        inputProps: { type: "email", required: true },
      },
      password: {
        order: 3,
        placeholder: "Enter your password",
        label: "Password",
        inputProps: { type: "password", required: true },
      },
      confirm_password: {
        order: 4,
        placeholder: "Confirm your password",
        label: "Confirm Password",
        inputProps: { type: "password", required: true },
      },
    },
  };

// AuthProvider component wraps the app in Amplify Authenticator and custom UserProvider
function AuthProvider({ children }: any) {
  return (
    <UserProvider>
      <Authenticator formFields={formFields}>
        {({ user, signOut }: any) => {
          if (user) {
            return (
              <div>
                {children}
                <button onClick={signOut}>Sign Out</button>
              </div>
            );
          } else {
            return (
              <div>
                <h1>Please sign in below:</h1>
              </div>
            );
          }
        }}
      </Authenticator>
    </UserProvider>
  );
}

export default AuthProvider