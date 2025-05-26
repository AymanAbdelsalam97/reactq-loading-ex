"use client";
import { createContext, useContext, useState, ReactNode } from "react";
const DataContext = createContext<DataContextType | undefined>(undefined);
import type { TUser } from "@/types/User";

export const DataProvider = ({
  children,
  data,
}: {
  children: ReactNode;
  data: TUser[] | null;
}) => {
  const [users, setUsers] = useState<TUser[] | null>(data);

  return (
    <DataContext.Provider value={{ users, setUsers }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
