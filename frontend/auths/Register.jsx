import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

import axiosInstance from "../src/utlis/axiosinstance";
import { UserContext } from "../src/context/userContext";
import NavBar from "../src/components/NavBar";
import "../src/App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  //  Store fields (ONLY for Owner)
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }

    // Owner-specific validation
    if (role === "Owner" && (!storeName || !storeAddress)) {
      enqueueSnackbar(
        "Store name and address are required for owners",
        { variant: "error" }
      );
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role,
      };

      // Send store details only for Owner
      if (role === "Owner") {
        payload.storeName = storeName;
        payload.storeAddress = storeAddress;
      }

      const response = await axiosInstance.post(
        "http://localhost:5555/auth/register",
        payload
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      updateUser(user);

      navigate(user.role === "Owner" ? "/dashboard" : "/dashboard/user");

      enqueueSnackbar("Registration successful", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Something went wrong",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-between">
        {/* FORM */}
        <div
          className="p-9 flex flex-col justify-center"
          style={{ height: "550px", width: "500px" }}
        >
          <h3 className="text-xl font-semibold text-black">
            Create an Account
          </h3>
          <p className="text-xs text-slate-700 mt-1 mb-6">
            Join us by entering your details
          </p>

          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                type="text"
                className="border p-2 rounded-md outline-none"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="border p-2 rounded-md outline-none"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 rounded-md outline-none"
              >
                <option value="User">User</option>
                <option value="Owner">Owner</option>
              </select>

              {/*  STORE FIELDS – ONLY FOR OWNER */}
              {role === "Owner" && (
                <>
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Store Name"
                    type="text"
                    className="border p-2 rounded-md outline-none"
                  />

                  <input
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="Store Address"
                    type="text"
                    className="border p-2 rounded-md outline-none"
                  />
                </>
              )}

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 chars)"
                type="password"
                className="border p-2 rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white rounded-sm mt-5 hover:bg-purple-500 transition"
              style={{ height: "40px", width: "430px" }}
            >
              REGISTER
            </button>

            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account?{" "}
              <Link
                className="font-medium text-purple-700 underline"
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* IMAGE */}
        <div className="p-4">
          <img
            src="/login.jpg"
            alt="Register"
            style={{ width: "560px", height: "525px" }}
            className="rounded-sm"
          />
        </div>
      </div>
    </>
  );
}

export default Register;
