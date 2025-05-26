import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/utils/GetQueryClient";
import { GetAllUsers } from "@/core/api/user/actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const links = [
  { href: "/slow", label: "Go to slow page" },
  { href: "/fast", label: "Go to the fast page" },
  { href: "/faster", label: "Go to the faster page" },
  { href: "/fastest", label: "Go to the fastest page" },
];

export default async function Home() {
  const queryClient = getQueryClient();
  const prefetchUsers = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["prefetchUsers"],
      queryFn: GetAllUsers,
    });
  };
  prefetchUsers();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col items-center  min-h-screen p-4">
        <h1 className="text-2xl">Home Page</h1>
        <ul className="flex flex-row gap-4 p-4">
          {links.map((link) => (
            <li key={link.href}>
              <Button asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </HydrationBoundary>
  );
}
