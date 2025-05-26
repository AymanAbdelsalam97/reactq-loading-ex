"use client";
import "@/app/globals.css";
import UsersWrapper from "@/components/UsersWrapper";

import { Suspense } from "react";
const FastestPage = () => {
  return (
    <div className="p-10">
      <h1>The Fastest Page</h1>
      <Suspense fallback="Loading users...">
        <UsersWrapper />
      </Suspense>
    </div>
  );
};
export default FastestPage;
