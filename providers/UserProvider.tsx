// components/UserProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllUsers } from "@/core/api/user/actions";
import { TUser } from "@/types/User";

type UserContextType = {
  users: TUser[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

const UserContext = createContext<UserContextType>({
  users: [],
  isLoading: false,
  isError: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: GetAllUsers,
  });

  return (
    <UserContext.Provider value={{ users: data, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
