"use client";
import "@/app/globals.css";

import { lazy, Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { GetUserById } from "@/core/api/user/actions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EditUserForm = lazy(() => import("@/components/EditUserForm"));

const UserDetailsPage = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["users", { id }],
    queryFn: async () => GetUserById(Number(id)),
  });
  const [isFormVisible, setIsFormVisible] = useState(true);

  const router = useRouter();
  const handleGoBack = () => {
    router.push(-1);
  };
  useEffect(() => {
    if (isFormVisible === false) {
      router.push("/");
    }
  }, [isFormVisible]);
  if (isError)
    return (
      <div className="text-red-500 text-center">
        Error loading user with id {id}
      </div>
    );

  return (
    <div className="w-full fixed top-0 left-0 h-full  flex justify-center items-center">
      <div className="w-2xl h-[60vh] bg-white p-6 ">
        <Suspense
          fallback={
            <Skeleton className="h-96 w-full rounded-lg bg-gray-200 animate-pulse" />
          }
        >
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg bg-gray-200 animate-pulse" />
          ) : (
            <>
              <div className="flex relative gap-10 top-20 left-[40%]">
                <h1>Welcome to your detail page</h1>
                <Button
                  variant="default"
                  onClick={handleGoBack}
                  className=" bg-primary"
                >
                  Go back
                </Button>
              </div>
              <EditUserForm
                setIsFormVisible={setIsFormVisible}
                userData={data}
              />
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default UserDetailsPage;
