import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "universal-cookie";

export default function Auth() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const cookies = new Cookies();
    cookies.set("open-event-mod-auth", password, {
      path: "/",
    });

    try {
      setError(false);
      const res = await fetch("/api/auth");
      const { hasAccess } = await res.json();
      setError(!hasAccess);
      if (hasAccess) {
        window.location.href = router.asPath ?? "/";
      }
    } catch (err) {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form
        onSubmit={onSubmit}
        className="sm:mx-auto sm:w-full sm:max-w-sm space-y-6"
      >
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Northport Omena Calendar
        </h1>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Enter moderator password
          </label>
          <div className="mt-2">
            <input
              className="form-control w-full p-3 text-sm rounded-md text-black/85 leading-5 border-2 outline-none ring-gray-100 ring-offset-0 focus:border-blue-500"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!!error && <p className="text-red-600 mt-2">Incorrect Password</p>}
          </div>
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
