export const safeErrorLog = (message: string, error: any) => {
  const status = error?.response?.status || error?.status;
  const errorMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Unknown Error";

  const silentCodes = [400, 401, 403, 404, 422, 500];

  if (silentCodes.includes(status) ||
    errorMsg.toLowerCase().includes('not available') ||
    errorMsg.toLowerCase().includes('location')) {

    console.warn(`[API] ${message} (${status}): ${errorMsg}`);
    return;
  }

  console.error(`[CRITICAL] ${message}:`, error);
};
