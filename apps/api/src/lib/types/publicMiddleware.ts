import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { Middleware } from "next-api-middleware";

export type NextApiRequestExtension = NextApiRequest & {
  keyId: string;
};

export type NextApiResponseExtension = NextApiResponse;

export type CustomMiddleware = Middleware<
  NextApiRequestExtension,
  NextApiResponse
>;

export type { NextApiHandler };