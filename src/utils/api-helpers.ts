export const fetchApi = async (path: string, body?: object) => {
  return await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};
