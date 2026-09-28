import React from "react";
import Markdoc, { type Node } from "@markdoc/markdoc";
import { cn } from "@/lib/utils";

/** Keystatic markdoc alanlarını tipografi stilleriyle render eder. */
export function Prose({ node, className }: { node: Node | null | undefined; className?: string }) {
  if (!node) return null;
  const renderable = Markdoc.transform(node);
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none font-sans text-foreground/85",
        "prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-a:text-accent prose-strong:text-foreground prose-blockquote:border-accent prose-li:marker:text-accent",
        className,
      )}
    >
      {Markdoc.renderers.react(renderable, React)}
    </div>
  );
}
