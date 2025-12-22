import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../src/utlis/axiosinstance";
import { API_PATHS } from "../src/utlis/apiPaths";
import { UserContext } from '../src/context/userContext';
import NavBar from "../src/components/NavBar";
import { useSnackbar } from "notistack";
import { TbMail, TbLock, TbArrowRight } from "react-icons/tb";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      enqueueSnackbar('Please fill in all fields', { variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        enqueueSnackbar('Welcome back!', { variant: 'success' });
        navigate(user.role === "Owner" ? "/dashboard" : "/dashboard/user");
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Login failed', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <NavBar />
      
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        {/* Main Card with Boundary & Shadow */}
        <div className="max-w-5xl w-full bg-white border border-slate-300 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row transition-all duration-500 ease-in-out transform hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.12)]">
          
          {/* Left Side: Form Section */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em]">
                Enter your credentials to manage your store
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="group">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
                <div className="relative">
                  <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors text-xl" />
                  <input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    placeholder="name@example.com"
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Password</label>
                  <Link to="/forgot" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <TbLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors text-xl" />
                  <input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group disabled:bg-slate-400"
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
                <TbArrowRight className="group-hover:translate-x-1 transition-transform text-xl" />
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2">
               <span className="h-[1px] w-8 bg-slate-100"></span>
               <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                Don't have an account?
              </p>
               <span className="h-[1px] w-8 bg-slate-100"></span>
            </div>
            
            <Link 
              className="mt-4 text-center text-slate-900 font-black text-sm underline decoration-2 underline-offset-4 hover:text-blue-600 transition-colors" 
              to="/register"
            >
              Create Account
            </Link>
          </div>

          {/* Right Side: Visual Section */}
          <div className="hidden md:block w-5/12 relative group">
            <img
              src="/login.jpg"
              alt="Store"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            />
            {/* Neo-Brutalist Erect Badge */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">System Status: Operational</p>
              </div>
              <p className="text-slate-900 font-black text-sm leading-tight">
                Empower your bookstore management with real-time data and inventory control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;