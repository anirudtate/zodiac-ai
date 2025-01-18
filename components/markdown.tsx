import Markdown from "react-markdown";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const MarkdownComponents = {
  p: ({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-base mb-4 leading-7", className)} {...props}>{children}</p>
  ),
  h1: ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn("text-2xl font-bold mb-4 mt-6", className)} {...props}>{children}</h1>
  ),
  h2: ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-xl font-semibold mb-3 mt-5", className)} {...props}>{children}</h2>
  ),
  h3: ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-lg font-medium mb-2 mt-4", className)} {...props}>{children}</h3>
  ),
  ul: ({ children, className, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("list-disc list-outside ml-6 mb-4 space-y-2", className)} {...props}>{children}</ul>
  ),
  ol: ({ children, className, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("list-decimal list-outside ml-6 mb-4 space-y-2", className)} {...props}>{children}</ol>
  ),
  li: ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("text-base leading-7 pl-1", className)} {...props}>{children}</li>
  ),
  em: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => (
    <em className={cn("italic text-primary/90", className)} {...props}>{children}</em>
  ),
  strong: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-semibold text-primary", className)} {...props}>{children}</strong>
  ),
  blockquote: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn("border-l-4 border-primary/20 pl-4 italic my-4", className)} {...props}>{children}</blockquote>
  ),
  code: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => (
    <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>{children}</code>
  ),
  pre: ({ children, className, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("bg-muted p-4 rounded-lg my-4 overflow-x-auto", className)} {...props}>{children}</pre>
  ),
  hr: ({ className, ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn("my-8 border-primary/20", className)} {...props} />
  ),
};

export function RenderMarkdown(props: React.ComponentProps<typeof Markdown>) {
  return (
    <div className="prose prose-primary dark:prose-invert max-w-none">
      <Markdown components={MarkdownComponents} {...props} />
    </div>
  );
}