import ContactForm from "./ContactForm";

type SearchParams = { listing?: string };
type PageProps = { searchParams: Promise<SearchParams> | SearchParams };

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await (typeof (searchParams as Promise<SearchParams>).then === "function"
    ? (searchParams as Promise<SearchParams>)
    : Promise.resolve(searchParams as SearchParams));
  return <ContactForm initialListing={params.listing ?? null} />;
}

export const metadata = {
  title: "Contact | Yorksell",
  description: "Get in touch with Yorksell Real Estate Group. Toronto & GTA — buying, selling, investing.",
};
