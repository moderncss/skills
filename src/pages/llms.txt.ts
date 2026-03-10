import rawContent from "./llms.md?raw";

const content = rawContent.replace(/^---[\s\S]*?---\s*/, "");

export function GET() {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
