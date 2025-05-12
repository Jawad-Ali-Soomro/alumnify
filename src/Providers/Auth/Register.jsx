import React from 'react';
import { FormProviderContext, registerSchema } from '..';
import LoginForm from '../Form/LoginForm';
import RegisterForm from '../Form/RegisterForm';

const Register = () => {
  return (
    <FormProviderContext schema={registerSchema} defaultValues={{ email: "", password: "" }}>
      <RegisterForm />
    </FormProviderContext>
  );
};

export default Register;
