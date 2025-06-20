import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import logo from "../assets/FinTrack-logo.png";
import API from "../api";
import { fetchCurrentUser } from "../api";
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateLogin = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const validateSignup = () => {
    const errors = validateLogin();
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm your password";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const { login } = useUser();

  const handleLogin = async () => {
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) return setFormErrors(errors);

    try {
      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);

      const user = await fetchCurrentUser(data.token);
      login(user);
      navigate('/');
      console.log("User data:", user);

      // need to do: Save to context or redirect
    } catch (err) {
      console.error(err);
      setFormErrors({ general: err.response?.data?.message || "Login failed" });
    }
  };

  const handleSignup = async () => {
    const errors = validateSignup();
    if (Object.keys(errors).length > 0) return setFormErrors(errors);

    try {
      const { data } = await API.post("/auth/register", {
        name: formData.email.split("@")[0], // or use a dedicated name input later
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);

      const user = await fetchCurrentUser(data.token);
      login(user);
      navigate('/');
      console.log("User data:", user);

      // TODO: Save to context or redirect
    } catch (err) {
      console.error(err);
      setFormErrors({
        general: err.response?.data?.message || "Signup failed",
      });
    }
    
    
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card
        className="w-full max-w-md shadow-xl"
        style={{ backgroundColor: "#F9F8F7" }}
      >
        <CardHeader className="text-center">
          <img src={logo} alt="FinTrack Logo" className="w-40 mx-auto mb-4" />
          <CardTitle className="text-2xl mt-4 text-blue-500">
            Welcome to FinTrack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold text-center">
              {isLogin ? "Log In" : "Create Account"}
            </h2>

            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}

            <Input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm">{formErrors.password}</p>
            )}

            {!isLogin && (
              <>
                <Input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </>
            )}

            {formErrors.general && (
              <p className="text-red-500 text-sm text-center">
                {formErrors.general}
              </p>
            )}

            <Button
              className="w-full"
              onClick={isLogin ? handleLogin : handleSignup}
            >
              {isLogin ? "Log In" : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => {
                      setFormErrors({});
                      setIsLogin(false);
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign up here
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setFormErrors({});
                      setIsLogin(true);
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Log in here
                  </span>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
