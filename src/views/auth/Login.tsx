"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createPayload } from "@/lib/payload";
import { validateAuthForm } from "@/lib/validation";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const roles = session?.roles || [];
      if (roles.length > 1) router.push("/select-role");
      else if (roles.includes("specialist")) router.push("/specialist/dashboard");
      else if (roles.includes("manager")) router.push("/manager/dashboard");
      else if (roles.includes("admin")) router.push("/admin/dashboard");
      else if (roles.includes("digital prodigy")) router.push("/digital-prodigy/dashboard");
      else router.push("/auth/login");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = createPayload(e.target as HTMLFormElement);
    const { email, password } = payload;

    setError(null);
    const validationResult = validateAuthForm(email, password);

    if (!validationResult.isValid) {
      setError(validationResult.error ?? null);
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      ...payload,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const roles = session?.roles || [];
      if (roles.length > 1) router.push("/select-role");
      else if (roles.includes("specialist")) router.push("/specialist/dashboard");
      else if (roles.includes("manager")) router.push("/manager/dashboard");
      else if (roles.includes("admin")) router.push("/admin/dashboard");
      else router.push("/auth/login");
    }, 500);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
