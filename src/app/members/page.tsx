import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Members Area</h1>
      <p className="mt-4">Welcome {session.user?.name}</p>
      <p className="text-sm text-gray-500">
        User ID: {(session.user as any)?.id}
      </p>
    </div>
  );
}