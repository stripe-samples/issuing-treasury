import { ApiResponse } from "src/types/api-response";

export const postApi = async (path: string, body?: object) => {
  return await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const putApi = async (path: string, body?: object) => {
  return await fetch(path, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const fetchApi = async (path: string, body?: object) => {
  return await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const extractJsonFromResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data as ApiResponse;
  } else {
    throw new Error("Something went wrong");
  }
};

export const handleResult = ({
  result,
  onSuccess,
  onError,
  onFinally,
}: {
  result: ApiResponse;
  onSuccess: () => void;
  onError: (error: { message: string; details?: string | undefined }) => void;
  onFinally?: () => void;
}) => {
  try {
    if (result.success) {
      onSuccess();
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
