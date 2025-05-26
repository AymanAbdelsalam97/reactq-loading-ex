"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import { TRole, TUser } from "@/types/User";
import { DeleteUser } from "@/core/api/user/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import UsersOverview from "@/components/UsersOverView";
import Footer from "@/components/Footer";
import AddUserForm from "@/components/AddUserForm";
import EditUserForm from "@/components/EditUserForm";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetAllUsers } from "@/core/api/user/actions";
type UsersWrapperProps = {
  userData?: TUser[] | Promise<TUser[]> | null | undefined;
};

const UsersWrapper = ({ userData }: UsersWrapperProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["prefetchUsers"],
    queryFn: GetAllUsers,
  });
  const resolvedUserData =
    userData instanceof Promise
      ? use(userData)
      : userData == undefined
      ? (data as TUser[])
      : (userData as TUser[]);

  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | TRole>("All roles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editData, setEditData] = useState<TUser | null>(null);

  useEffect(() => {
    const savedSortField = localStorage.getItem("sortField");
    const savedSortDirection = localStorage.getItem("sortDirection");

    if (savedSortField && savedSortDirection) {
      setSortField(savedSortField);
      setSortDirection(savedSortDirection as "asc" | "desc");
    }
  }, []);

  useEffect(() => {
    if (sortField && sortDirection) {
      localStorage.setItem("sortField", sortField);
      localStorage.setItem("sortDirection", sortDirection);
    }
  }, [sortField, sortDirection]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resolvedUserData"] });
      resolvedUserData?.filter((u) => u.id !== deleteMutation.variables);
    },
  });

  const roles = resolvedUserData?.reduce((acc, user) => {
    if (!acc.includes(user.role)) acc.push(user.role);
    return acc;
  }, [] as string[]);
  roles?.unshift("All roles");

  const filteredUsers = resolvedUserData?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase()?.includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All roles" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const usersLength = sortedUsers.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(usersLength / itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleEdit = (userData: TUser) => {
    setIsFormVisible(true);
    setEditData(userData);
  };

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, usersLength);
  const usersToDisplay = sortedUsers.slice(startIndex, endIndex);

  return (
    <>
      {!isFormVisible ? (
        <>
          <Navbar
            roles={roles}
            onSearch={handleSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setIsFormVisible={setIsFormVisible}
          />
          <UsersOverview
            users={usersToDisplay}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <Footer
            itemLength={usersLength}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            endIndex={endIndex}
          />
        </>
      ) : (
        <div className="w-full fixed top-0 left-0 h-full flex justify-center items-center">
          <div className="w-2xl bg-white p-6">
            {!editData ? (
              <AddUserForm setIsFormVisible={setIsFormVisible} />
            ) : (
              <EditUserForm
                setIsFormVisible={setIsFormVisible}
                userData={editData}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsersWrapper;
