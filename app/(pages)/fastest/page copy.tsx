"use client";
import "@/app/globals.css";
import UsersWrapper from "@/components/UsersWrapper";
import { GetAllUsers } from "@/core/api/user/actions";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
const FastestPage = () => {
  const { data, isFetched } = useQuery({
    queryKey: ["prefetchUsers"],
    queryFn: GetAllUsers,
  });

  return (
    <div className="p-10">
      <h1>The Fastest Page</h1>
      <Suspense fallback="Loading users...">
        {isFetched ? (
          <UsersWrapper userData={data} />
        ) : (
          <div>Loading users...</div>
        )}
      </Suspense>
    </div>
  );
};
export default FastestPage;
