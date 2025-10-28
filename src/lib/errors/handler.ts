export class AppError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Map Supabase error codes to user-friendly messages
const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  "user_already_exists": "An account with this email already exists",

  // Database errors (Postgres codes)
  "42501": "You do not have permission to perform this action",
  "42P01": "Database error - please try again later",
  "23505": "Slug is already in use by one of your components.",

  // Network errors
  "NETWORK_ERROR": "Network error - please check your connection",
  "TIMEOUT": "Request timed out - please try again",

  // RLS policy violations
  "PGRST301": "You do not have permission to view this component",
  "PGRST204": "Component not found",
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function handleSupabaseError(error: any): AppError {
  // Already an AppError (our custom error)
  if (error instanceof AppError) {
    return error;
  }

  // Network/timeout errors
  if (error.message?.includes("fetch")) {
    return new AppError(
      error.message,
      SUPABASE_ERROR_MESSAGES["NETWORK_ERROR"],
      "NETWORK_ERROR",
    );
  }

  // Supabase auth errors
  if (error.message) {
    const lowerMessage = error.message.toLowerCase();

    if (lowerMessage.includes("user already registered")) {
      return new AppError(
        error.message,
        SUPABASE_ERROR_MESSAGES["user_already_exists"],
        "user_already_exists",
      );
    }
  }

  // Postgres error codes
  if (error.code && SUPABASE_ERROR_MESSAGES[error.code]) {
    return new AppError(
      error.message,
      SUPABASE_ERROR_MESSAGES[error.code],
      error.code,
    );
  }

  // PostgREST error codes (RLS violations)
  if (error.code?.startsWith("PGRST") && SUPABASE_ERROR_MESSAGES[error.code]) {
    return new AppError(
      error.message,
      SUPABASE_ERROR_MESSAGES[error.code],
      error.code,
    );
  }

  // Generic Postgres errors
  if (error.code?.startsWith("23")) {
    return new AppError(
      error.message,
      "Unable to save - please check your input",
      error.code,
    );
  }

  // Default fallback
  return new AppError(
    error.message || "Unknown error",
    DEFAULT_ERROR_MESSAGE,
    error.code,
  );
}
