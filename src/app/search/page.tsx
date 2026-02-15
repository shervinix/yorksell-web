import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<{ q?: string }> | { q?: string };
};

export default async function SearchPage({ searchParams }: Props) {
  const resolved =
    searchParams instanceof Promise ? await searchParams : searchParams ?? {};
  const q = (resolved?.q ?? "").trim();
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  redirect(`/listings${query}`);
}
