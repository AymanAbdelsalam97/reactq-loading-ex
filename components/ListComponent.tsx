import { GetAllUsers } from "@/core/api/user/actions";
import React from "react";
type ListComponentProps = {
  data?:
    | {
        userId: number;
        id: number;
        title: string;
        completed: boolean;
      }[]
    | null;
};
const ListComponent = async ({ data }: ListComponentProps) => {
  if (!data) {
    data = await GetAllUsers();
  }
  if (!data) {
    return <div>No data available</div>;
  }
  return (
    <ul>
      <li>
        {data?.map((name) => {
          return (
            <div key={name.id}>
              <h2>{name.title}</h2>
              <p>{name.completed ? "Completed" : "Not Completed"}</p>
            </div>
          );
        })}
      </li>
    </ul>
  );
};

export default ListComponent;
