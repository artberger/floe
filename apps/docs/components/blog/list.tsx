import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import type { Page } from "nextra";
import type { Frontmatter } from "~/types/frontmatter";

const BLOG_ROUTE = "/blog";

export function BlogList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {(
        getPagesUnderRoute(BLOG_ROUTE) as (Page & {
          frontMatter: Frontmatter | undefined;
        })[]
      ).map((page) => (
        <Link className="block mb-8 group" href={page.route} key={page.route}>
          {page.frontMatter?.ogImage ? (
            <div className="relative mt-4 overflow-hidden rounded-md aspect-video">
              <Image
                alt={page.frontMatter.title}
                className="object-cover transition-transform transform group-hover:scale-105"
                fill
                src={page.frontMatter.ogImage}
              />
            </div>
          ) : null}
          <div className="block mt-8 text-2xl font-semibold opacity-90 group-hover:opacity-100">
            {page.meta?.title || page.frontMatter?.title || page.name}
          </div>
          <div className="mt-2 opacity-80 group-hover:opacity-100">
            {page.frontMatter?.subheading} <span>Read more →</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2 mt-3">
            {page.frontMatter?.tag ? (
              <span className="px-2 py-1 text-xs rounded-sm opacity-80 ring-1 ring-gray-300 group-hover:opacity-100">
                {page.frontMatter.tag}
              </span>
            ) : null}
            {page.frontMatter?.date ? (
              <span className="text-sm opacity-60 group-hover:opacity-100">
                {page.frontMatter.date}
              </span>
            ) : null}
            {page.frontMatter?.author ? (
              <span className="text-sm opacity-60 group-hover:opacity-100">
                by {page.frontMatter.author}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
