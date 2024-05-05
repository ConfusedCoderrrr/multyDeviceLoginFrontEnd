"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoadig, setIsloading] = useState(false);
  const [role, setRole] = useState("user");

  const handleLogin = () => {
    const currentDeviceToken = Date.now();

    setIsloading(true);
    axios
      .post("https://multidevicebackend.onrender.com/api/login", {
        email: username,
        password,
        currentDeviceToken,
        role,
      })
      .then((res: any) => {
        setIsloading(false);
        const response = JSON.stringify(res);
        toast.success("Login successful!", {
          autoClose: 2000,
        });
        localStorage.setItem("userdata", response);
        localStorage.setItem(
          "currentDeviceToken",
          currentDeviceToken.toString()
        );
        router.push("/verify");
      })
      .catch((error: any) => {
        setIsloading(false);
        alert(error);
        console.log(error);
      });
  };

  if (isLoadig) {
    return (
      <div className="flex justify-center items-center absolute left-[45%] top-[35%]">
        <InfinitySpin width="400" color="black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="appearance-none rounded-none relative rounded-b-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
              Sign in
            </button>
          </div>
        </div>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Register here
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
