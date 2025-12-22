import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { TbUser, TbMail, TbLock, TbBuildingStore, TbMapPin, TbArrowRight } from "react-icons/tb";

import axiosInstance from "../src/utlis/axiosinstance";
import { UserContext } from "../src/context/userContext";
import NavBar from "../src/components/NavBar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }
    if (role === "Owner" && (!storeName || !storeAddress)) {
      enqueueSnackbar("Store details are required for owners", { variant: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { name, email, password, role };
      if (role === "Owner") {
        payload.storeName = storeName;
        payload.storeAddress = storeAddress;
      }

      const response = await axiosInstance.post("http://localhost:5555/auth/register", payload);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      updateUser(user);
      enqueueSnackbar("Registration successful", { variant: "success" });
      navigate(user.role === "Owner" ? "/dashboard" : "/dashboard/user");
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Registration failed", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <NavBar />

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-6xl w-full bg-white border border-slate-300 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row transition-all duration-500">
          
          {/* Left Side: Form Section */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto max-h-[85vh]">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em]">
                Join our community of book enthusiasts
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="group">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
                  <div className="relative">
                    <TbUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 text-xl transition-colors" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="group">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Register As</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900 appearance-none"
                  >
                    <option value="User">Standard User</option>
                    <option value="Owner">Store Owner</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                <div className="relative">
                  <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 text-xl transition-colors" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Owner Specific Fields */}
              {role === "Owner" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Store Name</label>
                    <div className="relative">
                      <TbBuildingStore className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 text-xl transition-colors" />
                      <input
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="The Book Nook"
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Location</label>
                    <div className="relative">
                      <TbMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 text-xl transition-colors" />
                      <input
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        placeholder="Downtown Ave"
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-1 block">Password</label>
                <div className="relative">
                  <TbLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 text-xl transition-colors" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group disabled:bg-slate-400"
              >
                {isSubmitting ? "Creating Account..." : "Register Now"}
                <TbArrowRight className="group-hover:translate-x-1 transition-transform text-xl" />
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 font-bold text-sm">
              Already have an account?{" "}
              <Link className="text-slate-900 underline decoration-2 underline-offset-4 hover:text-blue-600 transition-colors" to="/login">
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Side: Visual Section */}
          <div className="hidden md:block w-5/12 relative">
            <img
              src="/login.jpg"
              alt="Register"
              className="w-full h-full object-cover grayscale-[20%]"
            />
            {/* Neo-Brutalist Erect Badge */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-slate-900 font-black text-sm leading-tight">
                {role === "Owner" 
                  ? "Open your digital doors today and reach thousands of readers."
                  : "Discover a world of stories curated just for you."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;