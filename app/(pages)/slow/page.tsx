import "@/app/globals.css";
import { GetAllUsers } from "@/core/api/user/actions";
import { TUser } from "@/types/User";
import UsersWrapper from "@/components/UsersWrapper";
const SlowPage = async () => {
  const userData: TUser[] = await GetAllUsers();

  return (
    <div className="p-10">
      <h1>The SLOW Page</h1>
      <UsersWrapper userData={userData} />
    </div>
  );
};

export default SlowPage;
