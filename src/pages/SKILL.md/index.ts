import rawContent from "../../../skills/modern-css/SKILL.md?raw";

export function GET() {
  return new Response(rawContent, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
