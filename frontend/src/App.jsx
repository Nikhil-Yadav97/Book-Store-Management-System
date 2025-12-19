import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/userContext.jsx";

import Home from "./pages/Home.jsx";
import ShowBook from "./pages/ShowBook.jsx";
import CreateBook from "./pages/CreateBook.jsx";
import UpdateBook from "./pages/UpdateBook.jsx";
import DeleteBook from "./pages/DeleteBook.jsx";
import Store from "./pages/Store.jsx";

import Login from "../auths/Login.jsx";
import Register from "../auths/Register.jsx";
import Ownersdashboard from "./pages/Dashboards/Ownersdashboard.jsx";
import UserDashboard from "./pages/Dashboards/UserDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes";
import OwnerTransaction from "./pages/Dashboards/OwnerTransaction.jsx";
function App() {
  const { user, loading } = useContext(UserContext);

  // 🔑 BLOCK ROUTING UNTIL AUTH IS RESOLVED
  if (loading) {
    return <h1>Loading user...</h1>;
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Ownersdashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Home />} />

      <Route
        path="/books/create"
        element={
          <ProtectedRoute>
            <CreateBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/details/:id"
        element={
          <ProtectedRoute>
            <ShowBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/edit/:id"
        element={
          <ProtectedRoute>
            <UpdateBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/delete/:id"
        element={
          <ProtectedRoute>
            <DeleteBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store"
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        }
      />
      <Route
      path="/transactions/owner"
      element={
        <ProtectedRoute>
          <OwnerTransaction />
        </ProtectedRoute>
      }
    />
    

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
