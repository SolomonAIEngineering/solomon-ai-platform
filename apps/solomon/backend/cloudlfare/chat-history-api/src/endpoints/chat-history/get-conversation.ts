import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path
} from "@cloudflare/itty-router-openapi";
import { Env } from "index";
import { generateUserChatKey } from "lib/chat";
import { ConversationMessage } from "types"; // Ensure this type is defined as expected

export class GetConversation extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chat"],
		summary: "Retrieve conversation history for a user",
		parameters: {
			userId: Path(String, {
				description: "User Id, used to identify user's chat sessions",
			}),
			sessionId: Path(String, {
				description: "Session Id, used to retrieve specific chat session history",
			}),
		},
		responses: {
			"200": {
				description: "Returns the conversation history",
				schema: {
					success: Boolean,
					history: [ConversationMessage],
				},
			},
			"400": {
				description: "Invalid request parameters",
			},
			"404": {
				description: "No conversation history found for the provided IDs",
			},
			"500": {
				description: "Internal server error",
			}
		},
	};

	async handle(
		request: Request,
		env: Env,
		context: any,
		data: Record<string, any>
	) {
		const { userId, sessionId, message } = data.params;

		if (!userId || !sessionId) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Missing userId or sessionId'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		try {
			const userChatKey = generateUserChatKey(userId);
			const sessionsData = await env.production.get(userChatKey);

			if (!sessionsData) {
				return new Response(JSON.stringify({
					success: false,
					message: 'No conversation history found'
				}), { status: 404, headers: { 'Content-Type': 'application/json' } });
			}

			const sessions = JSON.parse(sessionsData);
			const sessionChats = sessions.filter(session => session.sessionId === sessionId);

			if (sessionChats.length === 0) {
				return new Response(JSON.stringify({
					success: false,
					message: 'No chats found for the specified session'
				}), { status: 404, headers: { 'Content-Type': 'application/json' } });
			}

			// Retrieve individual chat messages
			const chatHistory = await Promise.all(sessionChats.map(async (chat) => {
				const chatData = await env.production.get(chat.chatKey);
				return chatData ? JSON.parse(chatData) : null;
			}));

			return new Response(JSON.stringify({
				success: true,
				history: chatHistory.filter(chat => chat !== null)
			}), { status: 200, headers: { 'Content-Type': 'application/json' } });
		} catch (error) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Failed to retrieve conversation history'
			}), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}
	}
}
