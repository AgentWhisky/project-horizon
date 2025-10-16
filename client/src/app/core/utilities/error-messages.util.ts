import { HzErrorMessage } from '../models';

/**
 * Get the generic bad request (400) error message for a resource
 * @param context The context for the given error message
 * @param isAdmin Whether to return the admin-friendly message
 */
export function getBadRequestMessage(context: string, isAdmin = false): HzErrorMessage {
  return isAdmin
    ? {
        header: `${context} request invalid`,
        body: `The request payload was invalid or improperly formatted. One or more required fields are missing, contain invalid values, or failed validation. Verify input data and schema alignment before retrying.`,
      }
    : {
        header: `Something went wrong`,
        body: `We couldn't process your request. Please check your information and try again.`,
      };
}

/**
 * Get the generic error message for a resource load failure
 * @param context The context for the given error message
 * @param isAdmin Whether to return the admin-friendly message
 */
export function getGenericLoadFailureMessage(context: string, isAdmin = false): HzErrorMessage {
  return isAdmin
    ? {
        header: `${context} failed to load`,
        body: `The system could not retrieve data for ${context.toLowerCase()}. This may be due to network latency, API timeout, or an unreachable backend endpoint. Check the service logs or network connectivity.`,
      }
    : {
        header: `${context} couldn't be loaded`,
        body: `We're having trouble loading this right now. Please try again in a moment.`,
      };
}

/**
 * Get the error message for a missing resource (404)
 * @param context The context for the given error message
 * @param isAdmin Whether to return the admin-friendly message
 */
export function getNotFoundMessage(context: string, isAdmin = false): HzErrorMessage {
  return isAdmin
    ? {
        header: `${context} not found`,
        body: `The requested ${context.toLowerCase()} was not located in the database or API. It may have been deleted, renamed, or filtered out by access restrictions.`,
      }
    : {
        header: `Not found`,
        body: `We couldn't find the ${context.toLowerCase()} you're looking for. It might have been moved or removed.`,
      };
}

/**
 * Get the error message for unauthorized access (403/401)
 * @param context The context for the given error message
 * @param isAdmin Whether to return the admin-friendly message
 */
export function getUnauthorizedMessage(context: string, isAdmin = false): HzErrorMessage {
  return isAdmin
    ? {
        header: `Access denied`,
        body: `The user attempted to access ${context.toLowerCase()} without sufficient privileges. Check role assignments, authentication tokens, or API access rights.`,
      }
    : {
        header: `Access denied`,
        body: `You don't have permission to view this ${context.toLowerCase()}. Please contact your administrator if you believe this is a mistake.`,
      };
}

/**
 * Get the error message for server error (500)
 * @param context The context for the given error message
 * @param isAdmin Whether to return the admin-friendly message
 */
export function getServerErrorMessage(context: string, isAdmin = false): HzErrorMessage {
  return isAdmin
    ? {
        header: `Server error while loading ${context.toLowerCase()}`,
        body: `An unhandled exception occurred on the server while processing ${context.toLowerCase()}. Check logs for stack traces or service interruptions.`,
      }
    : {
        header: `Server error`,
        body: `Something went wrong on our end. Please try again later.`,
      };
}
