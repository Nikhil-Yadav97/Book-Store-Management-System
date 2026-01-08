import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/userContext.jsx";

import Home from "./pages/Home.jsx";
import ShowBook from "./pages/ShowBook.jsx";
import CreateBook from "./pages/CreateBook.jsx";
import UpdateBook from "./pages/UpdateBook.jsx";
import DeleteBook from "./pages/DeleteBook.jsx";
import Store from "./pages/Store.jsx";
import StoreDetails from "./pages/Dashboards/StoreDetails.jsx";
import UserHistory from "./pages/Dashboards/UserHistory.jsx";


import OwnerNavbar from "./pages/Dashboards/OwnerNavbar.jsx";
import Login from "../auths/Login.jsx";
import Ownersdashboard from "./pages/Dashboards/OwnersDashboard.jsx";
import Register from "../auths/Register.jsx";
import UserDashboard from "./pages/Dashboards/UserDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes";
import OwnerTransactionDashboard from "./pages/Dashboards/OwnerTransactionDashboard.jsx";
import UserProfile from "./pages/Dashboards/UserProfile.jsx";
import ShopBooks from "./pages/User/BooksOperations/ShopBooks.jsx";
function App() {
  const { user, loading } = useContext(UserContext);


  if (loading) {
    return <h1>Loading user...</h1>;
  }

  return (
    <Routes>

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to={user?.role === 'owner' ? "/dashboard" : "/user/home"} />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to={user?.role === 'owner' ? "/dashboard" : "/user/home"} />}
      />


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
        element={<Navigate to="/user/home" replace />}
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
        path="/owner/stores/:storeId/dashboard"
        element={
          <ProtectedRoute>
            <OwnerTransactionDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/home"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/stores"
        element={
          <ProtectedRoute>
            <StoreDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <ProtectedRoute>
            <UserHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/store/:storeId/books"
        element={
          <ProtectedRoute>
            <ShopBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? (user.role === 'owner' ? "/dashboard" : "/user/home") : "/login"} />}
      />
    </Routes>
  );
}

export default App;
