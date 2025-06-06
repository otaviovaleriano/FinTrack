import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import LoginPage from "./pages/LoginPage";

// This wrapper allows us to access `location.pathname` from inside Router
function AppLayout() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/create-account"];

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      {!shouldHideNavbar && <Navbar />}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
