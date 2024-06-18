import { generateTimeBasedIdentifier } from "utils";

/**
 * Generates a session ID based on the provided user ID and optional session ID.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} [sessionId] - The optional session ID. If not provided, a new session ID will be generated.
 * @return {string} The generated session ID.
 */

const generateSessionId = (userId: string, sessionId?: string): string => {
	return sessionId ?? `session:${userId}:${generateTimeBasedIdentifier()}`;
};

export default generateSessionId;
