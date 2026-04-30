
const extractRawMessage = (data: any, parentKey = ""): { key: string; message: string } | null => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return extractRawMessage(data[0], parentKey);
  }

  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    // If the value is a string, we found it. If it's an object/array, keep digging.
    return extractRawMessage(data[firstKey], firstKey);
  }

  if (typeof data === "string") {
    // Handle "ErrorDetail" strings if they appear
    let cleanMsg = data;
    if (cleanMsg.includes('ErrorDetail')) {
      const match = cleanMsg.match(/string='([^']+)'/);
      if (match) cleanMsg = match[1];
    }
    return { key: parentKey, message: cleanMsg };
  }

  return null;
};

export const handleApiError = (error: any): string => {
  const response = error.response || (error.data ? error : null);
  const status = response?.status;
  const data = response?.data;

  // Extract the "Technical" message first
  let technicalMessage = "";
  const extracted = extractRawMessage(data?.errors || data);

  if (extracted) {
    if (!extracted.key || extracted.key === "error" || extracted.key === "message" || extracted.key === "detail" || extracted.key === "non_field_errors") {
      technicalMessage = extracted.message;
    } else {
      const formattedKey = extracted.key.charAt(0).toUpperCase() + extracted.key.slice(1).replace(/_/g, " ");
      technicalMessage = `${formattedKey}: ${extracted.message}`;
    }
  } else {
    // Fallback to standard fields if extraction fails
    technicalMessage = data?.message || data?.error || data?.detail || error?.message || "Something went wrong";
  }

  const serverError = technicalMessage.toString().trim().replace(/\.$/, "");

  // Humanize common errors using a professional Error Map
  const errorMap: Record<string, string> = {
    "User not found": "We cannot find an account with that email address. Please check your email address or create a new account.",
    "Incorrect Password": "The password you entered is incorrect. Please try again or use the 'Forgot Password' link.",
    "Mobile number not registered": "This mobile number is not associated with an account. Please verify the number or create a new account.",
    "Invalid OTP": "Incorrect OTP. Please check the code sent to your mobile and try again.",
    "OTP Expired": "OTP expired. Please request a new one.",
    "Mobile number already exists": "This mobile number is already registered. Please login or use a different number.",
    "Email already exists": "This email address is already registered. Please login or use a different email.",
    "This contact_number and email already exist": "An account with this email and mobile number already exists. Please try logging in instead.",
    "This contact_number already exists": "An account with this mobile number already exists. Please try logging in instead.",
    "This email already exists": "An account with this email already exists. Please try logging in instead.",
    "Enter a valid email address": "Please enter a valid email address.",
    "Enter a valid mobile number": "Please enter a valid 10-digit mobile number.",
    "Password is too short": "Your password must be at least 8 characters long for better security.",
  };

  // Case-insensitive lookup in the map
  const normalizedKey = serverError.toLowerCase();
  const matchedKey = Object.keys(errorMap).find(key => key.toLowerCase() === normalizedKey || serverError.toLowerCase().includes(key.toLowerCase()));

  let finalMessage = matchedKey ? errorMap[matchedKey] : serverError;

  // Handle status-code specific fallbacks if the message is still generic
  if (finalMessage === "Something went wrong" || finalMessage === "Error" || finalMessage.toLowerCase() === "not found" || finalMessage.includes("404")) {
    if (status === 401) finalMessage = "Unauthorized access. Please login again.";
    else if (status === 403) finalMessage = "You do not have permission to perform this action.";
    else if (status === 404) finalMessage = "We couldn't find the account or service you're looking for. Please check your details and try again.";
    else if (status >= 500) finalMessage = "Our servers are experiencing a temporary issue. Please try again in a few moments.";
  }

  return finalMessage;
};
