"use client";
import "@/app/globals.css";
import UsersWrapper from "@/components/UsersWrapper";
import { useUsers } from "@/providers/UserProvider";
import { Suspense } from "react";
const FasterPage = () => {
  const { users: data, isLoading } = useUsers();

  return (
    <div className="p-10">
      <h1>The Faster Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {isLoading ? (
          <div>Loading users...</div>
        ) : (
          <UsersWrapper userData={data!} />
        )}
      </Suspense>
    </div>
  );
};
export default FasterPage;
