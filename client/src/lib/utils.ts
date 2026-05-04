import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

/* ---------------------------------- */
/* Classname Utility */
/* ---------------------------------- */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/* ---------------------------------- */
/* String & Formatting Helpers */
/* ---------------------------------- */

/** Converts "HighSpeedInternet" → "High Speed Internet" */
export function formatEnumString(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

/** Formats price values for filter UI */
export function formatPriceValue(value: number | null, isMin: boolean): string {
  if (!value) return isMin ? "Any Min Price" : "Any Max Price";

  if (value >= 1000) {
    const k = value / 1000;
    return isMin ? `$${k}k+` : `<$${k}k`;
  }

  return isMin ? `$${value}+` : `<$${value}`;
}

/* ---------------------------------- */
/* URL / Query Helpers */
/* ---------------------------------- */

type CleanableValue =
  | string
  | number
  | null
  | undefined
  | Array<string | number | null>;

export function cleanParams<T extends Record<string, CleanableValue>>(
  params: T
): Partial<T> {
  const cleaned: Partial<T> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "any"
    )
      return;

    if (Array.isArray(value)) {
      const filtered = value.filter((v) => v !== null && v !== undefined);
      if (filtered.length === 0) return;
      cleaned[key as keyof T] = filtered as T[keyof T];
      return;
    }

    cleaned[key as keyof T] = value as T[keyof T];
  });

  return cleaned;
}

/* ---------------------------------- */
/* Toast Helpers */
/* ---------------------------------- */

type ToastMessages = {
  success?: string;
  error?: string;
};

export async function withToast<T>(
  promise: Promise<T>,
  messages: ToastMessages
): Promise<T> {
  try {
    const result = await promise;
    if (messages.success) toast.success(messages.success);
    return result;
  } catch (err) {
    if (messages.error) toast.error(messages.error);
    throw err;
  }
}

/* ---------------------------------- */
/* API Helpers */
/* ---------------------------------- */

interface CognitoUser {
  userId: string;
  username?: string;
}

interface IdTokenPayload {
  payload?: {
    email?: string;
  };
}

interface FetchWithBaseQuery {
  (args: { url: string; method?: string; body?: unknown }): Promise<{
    data?: unknown;
    error?: unknown;
  }>;
}

/**
 * Ensures a user record exists in backend DB.
 * Creates tenant or manager if missing.
 */
export async function createNewUserInDatabase(
  user: CognitoUser,
  idToken: IdTokenPayload,
  userRole: "tenant" | "manager",
  fetchWithBQ: FetchWithBaseQuery
) {
  const endpoint = userRole === "manager" ? "/managers" : "/tenants";

  const response = await fetchWithBQ({
    url: endpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      name: user.username ?? "",
      email: idToken.payload?.email ?? "",
      phoneNumber: "",
    },
  });

  if (response.error) {
    throw new Error("Failed to create user record");
  }

  return response.data;
}
