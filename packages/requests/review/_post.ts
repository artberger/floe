import { z } from "zod";
import type OpenAI from "openai";
import { api } from "../api";

export const querySchema = z.object({
  path: z.string(),
  content: z.string(),
  startLine: z.coerce.number().optional().default(1),
  rule: z.object({
    code: z.string(),
    level: z.union([z.literal("error"), z.literal("warn")]),
    description: z.string(),
  }),
});

export type PostReviewResponse =
  | {
      violations: {
        // A description of the violation
        description: string | undefined;
        // This is `replaceTextWithFix`, but with the rest of the line(s) content include
        linesWithFix: string | undefined;
        // The original content that should be replaced
        linesWithoutFix: string;
        // The first line number of the violation
        startLine: number;
        // The last line number of the violation
        endLine: number;
        // The specific string that should be replaced (generated by LLM)
        textToReplace: string;
        // The suggested fix (generated by LLM)
        replaceTextWithFix: string;
      }[];
      rule: {
        level: "error" | "warn" | undefined;
        code: string;
        description: string;
      };
      path: string;
      cached: boolean;
      model: string;
      usage: OpenAI.Completions.CompletionUsage | undefined;
    }
  | undefined;
export type PostReviewInput = z.infer<typeof querySchema>;

export async function createReview({
  path,
  content,
  startLine,
  rule,
}: PostReviewInput) {
  return api.post<PostReviewResponse>("/api/v1/review", {
    path,
    content,
    startLine,
    rule,
  });
}
