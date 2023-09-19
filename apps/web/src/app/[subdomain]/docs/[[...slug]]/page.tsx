import React from "react";
import AmorphousBlob from "@/components/AmorphousBlob";
import { getFloeClient } from "@/app/floe-client";
import { withFloeServerPages, FloePageProps } from "@floe/next";
import SideNav from "./SideNav";
import Link from "next/link";
import DocItem from "./DocPage";
import NotFound from "@/app/NotFound";
import { MobileNav } from "./MobileNav";
import { Footer } from "../../_components/Footer";
import { generateMetadata as gm } from "@/utils/generateMetaData";

export const revalidate = 10;

export const generateMetadata = gm("Docs");

const BASE_PATH = "docs";

async function DocsPage({
  isError,
  isNode,
  post,
  posts,
  isNotFound,
  floeClient,
  params,
}: FloePageProps) {
  let fileTree: Awaited<ReturnType<typeof floeClient.post.getTree>>;

  const slugWithBasePath = () => {
    const slug = params.slug as string[] | undefined;

    return `${BASE_PATH}/${slug ? slug.join("/") : ""}`;
  };

  try {
    fileTree = await floeClient.post.getTree(BASE_PATH);
  } catch (e) {
    console.error(e);
  }

  if (isNotFound || isError) {
    return <NotFound />;
  }

  const renderDocOrDocs = () => {
    return (
      <>
        <div className="flex mr-6 md:hidden">
          <MobileNav
            fileTree={fileTree}
            subdomain={params.subdomain as unknown as string}
            slugWithBasePath={slugWithBasePath()}
          />
        </div>
        <section className="relative hidden w-full md:w-60 shrink-0 md:block">
          <div className="relative inset-0 md:absolute">
            <div className="relative w-full md:fixed md:w-60">
              <SideNav
                fileTree={fileTree}
                subdomain={params.subdomain as unknown as string}
                slugWithBasePath={slugWithBasePath()}
              />
            </div>
          </div>
        </section>
        <section className="w-full m-auto mt-12 md:mt-0 border-zinc-700">
          {isNode ? (
            <div className="w-full">
              <DocItem doc={post} />
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={post.slug}
                className="mb-2 no-underline"
              >
                <DocItem doc={post} />
              </Link>
            ))
          )}
        </section>
      </>
    );
  };

  return (
    <main className="relative z-10 flex flex-col">
      <div className="flex flex-col-reverse w-full max-w-screen-xl gap-8 px-6 pt-24 pb-8 mx-auto md:px-8 md:flex-row">
        {renderDocOrDocs()}
      </div>
      <AmorphousBlob
        blur={50}
        rotation={0}
        className="fixed top-0 -left-48 scale-x-[2] h-screen w-[300px] opacity-10 md:opacity-20"
      />
    </main>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ params }: { params: any }) => {
  const floeClient = getFloeClient(params.subdomain);

  return withFloeServerPages(DocsPage, floeClient, BASE_PATH)({ params });
};
