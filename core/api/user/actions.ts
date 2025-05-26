"use server";
import { TUser } from "@/types/User";
import { allowedRoles } from "@/lib/utils";
export const GetAllUsers = async () => {
  const endPoint = "users";
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endPoint}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const GetUserById = async (id: number) => {
  const endPoint = `users/${id}`;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endPoint}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateUser = async (userData: {
  name: string;
  email: string;
  role: (typeof allowedRoles)[number];
}) => {
  const endPoint = "users";
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`;

  // Check if the role is valid
  if (!allowedRoles.includes(userData.role)) {
    throw new Error("Invalid role. Allowed values: 'Admin' or 'User'.");
  }

  try {
    const emailExists = await GetAllUsers().then((users) =>
      users.find((user: TUser) => user.email === userData.email)
    );

    if (emailExists) {
      throw new Error("Email is already in use.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const EditUser = async (userData: TUser) => {
  const id = userData?.id;
  const endPoint = `users/${id}`;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // Pass the user data here
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endPoint}`);
    }

    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteUser = async (id: number) => {
  const endPoint = `users/${id}`;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${endPoint}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }
    return response.status;
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};
