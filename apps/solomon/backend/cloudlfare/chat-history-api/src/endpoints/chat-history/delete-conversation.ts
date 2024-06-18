import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path
} from "@cloudflare/itty-router-openapi";
import { Env } from "index";
import { generateUserChatKey } from "lib/chat";

export class DeleteConversation extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chat"],
		summary: "Delete a specific chat session for a user",
		parameters: {
			userId: Path(String, {
				description: "User Id to identify the user's chat sessions",
			}),
			sessionId: Path(String, {
				description: "Session Id to specify the chat session to be deleted",
			}),
		},
		responses: {
			"200": {
				description: "Chat session successfully deleted",
				schema: {
					success: Boolean,
					message: String,
				},
			},
			"400": {
				description: "Invalid or missing parameters",
			},
			"404": {
				description: "No session found to delete",
			},
			"500": {
				description: "Internal server error during deletion process",
			}
		},
	};

	async handle(
		request: Request,
		env: Env,
		context: any
	) {
		const { userId, sessionId } = this.extractQueryParameters(request) as { userId: string, sessionId: string };

		if (!userId || !sessionId) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Both userId and sessionId are required'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		try {
			const userChatKey = generateUserChatKey(userId);
			const sessionsData = await env.production.get(userChatKey);

			if (!sessionsData) {
				return new Response(JSON.stringify({
					success: false,
					message: 'No sessions found for this user'
				}), { status: 404, headers: { 'Content-Type': 'application/json' } });
			}

			let sessions = JSON.parse(sessionsData);
			const filteredSessions = sessions.filter(session => session.sessionId !== sessionId);

			if (filteredSessions.length === sessions.length) {
				return new Response(JSON.stringify({
					success: false,
					message: 'Session not found for deletion'
				}), { status: 404, headers: { 'Content-Type': 'application/json' } });
			}

			// Update or delete the sessions data based on remaining sessions
			if (filteredSessions.length > 0) {
				await env.production.put(userChatKey, JSON.stringify(filteredSessions));
			} else {
				await env.production.delete(userChatKey);
			}

			return new Response(JSON.stringify({
				success: true,
				message: 'Chat session successfully deleted'
			}), { status: 200, headers: { 'Content-Type': 'application/json' } });
		} catch (error) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Failed to delete chat session due to an internal error'
			}), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}
	}
}
