"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const { signIn, user } = useAuth();
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const handleValidation = (field: string) => {
    setError(null);
    switch (field) {
      case "email":
        if (!email.trim()) {
          setEmailError("Email is required.");
        } else if (!validateEmail(email)) {
          setEmailError("Please enter a valid email address.");
        } else {
          setEmailError("");
        }
        break;
      case "password":
        setPasswordError(
          password.length < 8
            ? "Password must be at least 8 characters long."
            : "",
        );
        break;
      default:
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    handleValidation("email");
    handleValidation("password");
    if (emailError || passwordError || !email || !password) {
      setIsProcessing(false);
      setError("Please fix the errors to proceed.");
      return;
    }

    try {
      const userCredential = await signIn(email, password);
      console.log(`User email verified: ${userCredential.user.emailVerified}`);
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setIsProcessing(false);
    }
  };
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 text-white p-6 overflow-hidden">
      <style jsx global>{`
        @keyframes bg-pan {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-bg-pan {
          animation: bg-pan 20s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 z-0 opacity-80" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent opacity-10 animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-700 via-transparent to-transparent opacity-10 animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      <div className="relative z-10 bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 transform border border-gray-700 w-full max-w-xl">
        <div className="flex items-center justify-between bg-gray-700 rounded-t-2xl border-b border-gray-600 p-3">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
          <p className="font-semibold text-sm text-gray-400">Hack Club Login</p>
          <div className="w-10"></div>
        </div>
        <div className="p-8 md:p-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center text-indigo-400 drop-shadow-md">
            Welcome Back
          </h1>
          <p className="text-center text-xl text-gray-400 mb-12 font-light">
            Sign in to continue your journey.
          </p>

          <form onSubmit={handleSignIn} className="w-full">
            {error && (
              <div className="bg-red-600 text-white p-4 rounded-lg mb-4 text-center font-semibold">
                {error}
              </div>
            )}
            <div className="relative mb-6">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${emailError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleValidation("email")}
                  required
                />
                <Mail className="absolute left-5 text-gray-400" size={24} />
              </div>
              {emailError && (
                <p className="text-red-400 text-sm italic mt-2">{emailError}</p>
              )}
            </div>
            <div className="relative mb-8">
              <label
                className="block text-gray-300 text-lg font-semibold mb-3"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full pl-14 pr-8 py-4 bg-gray-600 rounded-lg text-white text-xl focus:outline-none transition duration-200 border-2 ${passwordError ? "border-red-500" : "border-gray-500"} focus:border-indigo-500 focus:ring-indigo-500`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleValidation("password")}
                  required
                />
                <Lock className="absolute left-5 text-gray-400" size={24} />
                <div
                  className="absolute right-5 cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm italic mt-2">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              className={`w-full text-white text-xl font-bold py-5 px-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform shadow-lg bg-indigo-500 hover:bg-indigo-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              type="submit"
              disabled={isProcessing}
            >
              <div className="flex items-center justify-center">
                {isProcessing ? (
                  <svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Log In <LogIn size={28} className="ml-3" />
                  </>
                )}
              </div>
            </button>

            <div className="mt-8 text-center">
              <Link
                href="/signup"
                className="font-bold text-lg text-indigo-400 hover:text-indigo-300 transition duration-200"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
