import "@/app/globals.css";
import UsersWrapper from "@/components/UsersWrapper";
import { Suspense } from "react";
import { GetAllUsers } from "@/core/api/user/actions";
import { Skeleton } from "@/components/ui/skeleton";
const FastPage = () => {
  const userData = GetAllUsers();
  const skeletonGroup = Array.from({ length: 10 }, (_, index) => (
    <div key={index} className="mb-4 bg-amber-500">
      <Skeleton className="h-10 w-full" />
    </div>
  ));
  return (
    <div className="p-10">
      <h1>The Fast Page</h1>
      <Suspense fallback={skeletonGroup}>
        <UsersWrapper userData={userData} />
      </Suspense>
    </div>
  );
};

export default FastPage;
