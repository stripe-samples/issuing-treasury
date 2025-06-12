import { prisma } from "src/db";

export const logApiRequest = async (
  email: string,
  requestUrl: string,
  requestMethod: string,
  requestBody?: any,
  responseBody?: any
) => {
  if (!prisma) {
    console.error("Prisma client is not initialized");
    return;
  }

//   console.log("Logging API request for user:", email);
  try {
    await prisma.apiRequestLog.create({
      data: {
        user: {
          connect: {
            email: email,
          },
        },
        requestUrl,
        requestMethod,
        requestBody: requestBody ? JSON.stringify(requestBody) : null,
        responseBody: responseBody ? JSON.stringify(responseBody) : null,
      },
    });
  } catch (error) {
    // Log the error but don't throw it to prevent breaking the main functionality
    console.error("Error logging API request:", error);
  }
}; 