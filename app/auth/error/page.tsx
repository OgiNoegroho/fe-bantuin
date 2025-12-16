import { Suspense } from "react";
import AuthErrorClient from "./AuthErrorClient";

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center ">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-gray-600 mb-6">Loading error details...</p>
          </div>
        </div>
      }
    >
      <AuthErrorClient />
    </Suspense>
  );
}
