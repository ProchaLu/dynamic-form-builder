import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-800">
        Oops! Page not found
      </p>
      <p className="mt-2 text-gray-600">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition rounded-full"
      >
        Return Home
      </Link>
    </div>
  );
}
