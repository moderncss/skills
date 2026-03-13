import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const skill = defineCollection({
  loader: glob({ pattern: "SKILL.md", base: "skills/modern-css" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
  }),
});

export const collections = { skill };
