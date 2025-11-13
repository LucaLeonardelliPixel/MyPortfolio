import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc, DateField, isFilled } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("project", uid).catch(() => notFound());

  function formatDate(date: DateField) {

        if (isFilled.date(date)) {
            
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }

            return new Intl.DateTimeFormat("en-US", dateOptions). format(new Date(date))
        }        
    }

    const formattedDate = formatDate(page.data.date)

  return (
    <Bounded as="article">
        <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
            <Heading as="h1">{page.data.title}</Heading>
            <div className="flex gap-4 text-yellow-400 font-bold">
                {page.tags.map((tag) =>( 
                    <span key={tag}>{tag}</span>
                ))}
            </div>
            <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">
                {formattedDate}
            </p>
            <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
              <SliceZone slices={page.data.slices} components={components} />
            </div>
        </div>
    </Bounded>
    );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("project", uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => ({ uid: page.uid }));
}