import { HzErrorMessage } from '../models';

/**
 * Get the generic error message for a resource
 * @param context The context for the given error message
 */
export function getGenericLoadFailureMessage(context: string): HzErrorMessage {
  return {
    header: `${context} failed to load`,
    body: `The system was unable to retrieve the required data for this section. This may be due to a connectivity issue, timeout, or misconfigured API endpoint. Please verify that the backend service is online and reachable.`,
  };
}

/**
 * Get the error message for a missing resource
 * @param context The context for the given error message
 */
export function getNotFoundMessage(context: string): HzErrorMessage {
  return {
    header: `${context} not found`,
    body: `The requested ${context.toLowerCase()} could not be located. It may have been deleted, renamed, or is no longer available.`,
  };
}

/**
 * Get the error message for unauthorized access
 * @param context The context for the given error message
 */
export function getUnauthorizedMessage(context: string): HzErrorMessage {
  return {
    header: `Access denied`,
    body: `You do not have permission to access this ${context.toLowerCase()}. Please verify your account permissions or contact an administrator.`,
  };
}

/**
 * Get the error message for a server error
 * @param context The context for the given error message
 */
export function getServerErrorMessage(context: string): HzErrorMessage {
  return {
    header: `Server error while loading ${context.toLowerCase()}`,
    body: `An unexpected server error occurred. Please try again later or contact support if the issue persists.`,
  };
}
