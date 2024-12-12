// src/pages/Login.jsx

import React from "react";
import { useAuth } from "../contexts/UserAuthContext";

const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div>
      <h2>Login</h2>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default Login;
