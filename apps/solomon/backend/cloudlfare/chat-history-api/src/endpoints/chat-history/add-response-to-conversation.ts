import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path
} from "@cloudflare/itty-router-openapi";
import { ConversationMessage } from "../../types";
import { Env } from "index";
import generateSessionId from "lib/session";
import { generateChatKey, generateUserChatKey } from "lib/chat";

export class AddResponseToConversation extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chat"],
		summary: "Store a chat message in the session",
		parameters: {
			userId: Path(String, {
				description: "User Id of the sender",
			}),
			sessionId: Path(String, {
				description: "Unique identifier for the chat session",
			}),
		},
		requestBody: ConversationMessage,
		responses: {
			"200": {
				description: "Chat message successfully stored",
				schema: {
					success: Boolean,
					message: String,
				},
			},
			"400": {
				description: "Bad request due to missing parameters or invalid data",
			},
			"500": {
				description: "Internal server error occurred while storing the message",
			}
		},
	};

	async handle(
		request: Request,
		env: Env,
		context: any,
		data: Record<string, any>
	) {
		const { userId, sessionId } = data.params;
		if (!userId) {
			console.log('Missing userId');

			return new Response(JSON.stringify({
				success: false,
				message: 'Missing userId'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		const chatSessionId = generateSessionId(userId, sessionId);
		const chatKey = generateChatKey(chatSessionId, userId);
		const createdAt = new Date().toISOString();
		const chatMessage: typeof ConversationMessage = data.body as typeof ConversationMessage;

		chatMessage.sessionId = chatSessionId;
		chatMessage.createdAt = createdAt;

		try {
			await this.storeChatMessage(env, chatKey, chatMessage);
			await this.updateSessionList(env, userId, chatSessionId, createdAt, chatKey);
			return new Response(JSON.stringify({ success: true, message: 'Chat message stored successfully' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} catch (error) {
			console.error('Failed to store chat message:', error);
			return new Response(JSON.stringify({
				success: false,
				message: 'Failed to store chat message'
			}), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}
	}

	async storeChatMessage(env: Env, chatKey: string, chatMessage: typeof ConversationMessage) {
		console.log('Storing chat message:', chatMessage);
		return await env.production.put(chatKey, JSON.stringify(chatMessage));
	}

	async updateSessionList(env: Env, userId: string, sessionId: string, createdAt: string, chatKey: string) {
		const userChatKey = generateUserChatKey(userId);
		const sessionData = await env.production.get(userChatKey);
		let sessions = sessionData ? JSON.parse(sessionData) : [];
		sessions.push({ sessionId, timestamp: createdAt, chatKey });
		await env.production.put(userChatKey, JSON.stringify(sessions));
	}
}
