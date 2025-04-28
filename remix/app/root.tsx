import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Link } from "@remix-run/react";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 min-h-screen">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">My Remix App</Link>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">ホーム</Link>
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/contact" className="hover:underline">お問い合わせ</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </>
  );
}