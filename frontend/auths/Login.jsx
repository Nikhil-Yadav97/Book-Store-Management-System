import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LuArrowBigUpDash } from "react-icons/lu";
import axiosInstance from "../src/utlis/axiosinstance";
import { API_PATHS } from "../src/utlis/apiPaths";
import { UserContext } from '../src/context/userContext';
import NavBar from "../src/components/NavBar";
import { useSnackbar } from "notistack";
import '../src/App.css'
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const { updateUser } = useContext(UserContext)
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address")
      enqueueSnackbar('Please enter a valid email address', { variant: 'error' });
      return;
    }
    if (!password) {
      setError("Please enter the password")
      enqueueSnackbar('Please enter the password', { variant: 'error' });
      return;
    }


    // Login api call

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token)
        updateUser(user)
        if(user.role==="Owner"){
          navigate("/dashboard");
        }else{
          navigate("/dashboard/user");
        }
        enqueueSnackbar('Login successful', { variant: 'success' });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });

      } else {

      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-between   ">
        <div className="p-9   flex flex-col justify-center" style={{ height: "500px", width: "500px" }}>
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Please enter your details to log in
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="john@gmail.com"
              type="email"
              label="Email"
              className="border p-2 rounded-md outline-none"
            />


            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 5 Characters"
              type="password"
              className="border p-2 rounded-md outline-none "
            />



            <button
              type="submit"
              className="btn-primary text-white outlined bg-purple-500 rounded-sm hover:bg-purple-400" style={{ height: "25px", width: "430px" }}
            >
              LOGIN
            </button>
            <p className="text-[13px] text-slate-800 mt-3">Don't have a account?{""}
              <Link className=" font-medium text-purple underline" to="/register">
                Register</Link>
            </p>
          </form>
        </div>
        <div className=" rounded-sm  p-4" style={{  height: "" }} >
          <img
            src="/login.jpg"
            alt="Book"
            style={{ width: "560px", height: "525px" }}
            className="rounded-sm"
          />

        </div>
      </div>
    </>

  );
}

export default Login;
