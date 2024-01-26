import { NextApiRequest, NextApiResponse } from "next";

import { apiResponse, ApiResponse } from "src/types/api-response";

export const postApi = async (path: string, body?: object) => {
  return await fetchApi("POST", path, body);
};

export const putApi = async (path: string, body?: object) => {
  return await fetchApi("PUT", path, body);
};

export const patchApi = async (path: string, body?: object) => {
  return await fetchApi("PATCH", path, body);
};

const fetchApi = async (method: HttpMethod, path: string, body?: object) => {
  return await fetch(path, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const extractJsonFromResponse = async <TData = object>(
  response: Response,
): Promise<ApiResponse<TData>> => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data as ApiResponse<TData>;
  } else {
    throw new Error("Something went wrong");
  }
};

export const handleResult = async ({
  result,
  onSuccess,
  onError,
  onFinally,
}: {
  result: ApiResponse;
  onSuccess: () => Promise<void> | void;
  onError: (error: { message: string; details?: string | undefined }) => void;
  onFinally?: () => void;
}) => {
  try {
    if (result.success) {
      await onSuccess();
    } else {
      if (result.error == undefined) {
        throw new Error("Something went wrong");
      }
      onError(result.error);
    }
  } finally {
    if (onFinally) {
      onFinally();
    }
  }
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HandlerMapping = {
  [key in HttpMethod]?: (req: NextApiRequest, res: NextApiResponse) => void;
};

export const handlerMapping = (
  req: NextApiRequest,
  res: NextApiResponse,
  mapping: HandlerMapping,
) => {
  try {
    if (req.method == undefined) {
      return res
        .status(400)
        .json(
          apiResponse({ success: false, error: { message: "Bad Request" } }),
        );
    }
    const handler = mapping[req.method as HttpMethod];
    if (handler == undefined) {
      return res
        .status(400)
        .json(
          apiResponse({ success: false, error: { message: "Bad Request" } }),
        );
    }
    return handler(req, res);
  } catch (error) {
    return res.status(500).json(
      apiResponse({
        success: false,
        error: {
          message: (error as Error).message,
          details: (error as Error).stack,
        },
      }),
    );
  }
};
