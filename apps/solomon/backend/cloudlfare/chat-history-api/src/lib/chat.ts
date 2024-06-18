import { generateTimeBasedIdentifier } from "utils";



/**
 * Generates a chat key based on the provided session ID and user ID.
 *
 * @param {string} sessionId - The ID of the session.
 * @param {string} userId - The ID of the user.
 * @return {string} The generated chat key.
 */
export const generateChatKey = (sessionId: string, userId: string): string => {
	return `chat:${sessionId}:${generateTimeBasedIdentifier()}`;
}

/**
 * Generates a chat key for a specific user.
 *
 * @param {string} userId - The ID of the user.
 * @return {string} The generated chat key in the format "user:chat:{userId}".
 */
export const generateUserChatKey = (userId: string): string => {
	return `user:chat:${userId}`;
}
