import {
	Obj,
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path
} from "@cloudflare/itty-router-openapi";
import { Env } from "index";
import { generateChatKey } from "lib/chat";
import generateSessionId from "lib/session";
import { OpenAI } from 'openai'; // Make sure to import or install an appropriate OpenAI client
import { ConversationMessage } from "types";
import { z } from 'zod';


export class ExecuteQuestion extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chat"],
		summary: "Handle chat messages with OpenAI in a streaming fashion and store the session",
		parameters: {
			userId: Path(String, {
				description: "User ID to identify the user",
			}),
			sessionId: Path(String, {
				description: "Session ID to identify the chat session",
			}),
			message: Path(String, {
				description: "Message content to be sent to OpenAI",
			}),
		},
		responses: {
			"200": {
				description: "Streams back the AI's response and stores it",
			},
			"400": {
				description: "Missing or invalid parameters",
			},
			"500": {
				description: "Internal server error",
			},
		},
	};

	/**
	 * Handles the request to execute a question and stream the AI's response.
	 *
	 * @param {Request} request - The incoming request object.
	 * @param {Env} env - The environment object containing configuration settings.
	 * @param {any} context - The context object.
	 * @param {Record<string, any>} data - The data object containing the request parameters.
	 * @return {Promise<Response>} A promise that resolves to the response object.
	 * ref: https://stackoverflow.com/questions/77118020/how-can-i-make-a-cloudflare-worker-stream-an-openai-response-back-to-the-front-e
	 */
	async handle(
		request: Request,
		env: Env,
		context: any,
		data: Record<string, any>
	) {
		const { userId, sessionId, message } = data.params;

		// Validate parameters
		if (!userId || !sessionId || !message) {
			return new Response(JSON.stringify({
				success: false,
				error: 'Missing userId, sessionId, or message'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			// ref: https://developers.cloudflare.com/ai-gateway/get-started/connecting-applications/
			baseURL: `${env.GATEWAY_URL}/openai`,
		});

		const chatSessionId = generateSessionId(userId, sessionId);
		const chatKey = generateChatKey(chatSessionId, userId);

		// Create a TransformStream to handle streaming data
		// let { readable, writable } = new TransformStream();
		// let writer = writable.getWriter();
		// const textEncoder = new TextEncoder();

		// Stream from OpenAI and store in KV
		// context.waitUntil((async () => {
		// 	try {
		// 		const stream = await openai.chat.completions.create({
		// 			model: env.OPEN_AI_MODEL,
		// 			messages: [{ role: 'user', content: message }],
		// 			stream: true,
		// 			max_tokens: 4000,
		// 		});

		// 		for await (const part of stream) {
		// 			const content = part.choices[0]?.delta?.content || '';
		// 			writer.write(textEncoder.encode(content));
		// 		}
		// 	} catch (error) {
		// 		writer.write(textEncoder.encode('Error processing your request: ' + error.message));
		// 	}
		// 	writer.close();
		// })());

		const stream = await openai.chat.completions.create({
			model: env.OPEN_AI_MODEL,
			messages: [{ role: 'user', content: message }],
			stream: true,
			max_tokens: 4000,
		});

		const readableStream = new ReadableStream({
			async start(controller) {
				for await (const part of stream) {
					if (part.choices[0]?.delta?.content) {
						const textEncoder = new TextEncoder();
						const formattedData = `data: ${part.choices[0].delta.content}\n\n`;
						controller.enqueue(textEncoder.encode(formattedData));
					}
				}
				controller.close();
			},
		});

		const responseToStore: typeof ConversationMessage = {
			message: message,
			sessionId: chatSessionId,
			userId: userId,
			role: 'user',
			createdAt: new Date().toISOString(),
			path: `/${chatKey}`,
			sharePath: `/share${chatKey}`,
			title: '',
		};

		// Store each response in KV
		await env.production.put(chatKey, JSON.stringify({
			userId,
			chatSessionId,
			message: responseToStore,
			timestamp: new Date().toISOString()
		}));

		// NOTE: because we stream the response, there is no way for us to have access to the response data object to cache hence, we only store the original
		// message provided to us by the end user

		// Return the readable stream to the client
		return new Response(readableStream, {
			headers: {
				'content-type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
			},
		});
	}
}
