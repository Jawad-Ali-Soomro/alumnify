import React from 'react';
import { FormProviderContext, loginSchema } from '..';
import LoginForm from '../Form/LoginForm';

const Login = () => {
  return (
    <FormProviderContext schema={loginSchema} defaultValues={{ email: "", password: "" }}>
      <LoginForm />
    </FormProviderContext>
  );
};

export default Login;
