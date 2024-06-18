import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path
} from "@cloudflare/itty-router-openapi";
import { Env } from "index";
import { OpenAI } from 'openai'; // Make sure to import or install an appropriate OpenAI client
import { LLMConversationRecord } from "types";

export class OpenAIStreamingEndpoint extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Chat"],
		summary: "Handle chat messages with OpenAI in a streaming fashion",
		requestBody: {
			userId: String,
			conversation: [LLMConversationRecord],
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
		if (!data.body.userId) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Missing userId'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		if (!data.body.conversation) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Missing conversation'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// get the reuqest body
		const conversation = data.body.conversation as typeof LLMConversationRecord[];

		// iterate over conversation and convert to openai format
		const messages = conversation.map((record) => {
			return {
				role: record.role as 'system' | 'user' | 'assistant',
				content: record.message as string
			}
		});

		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			// ref: https://developers.cloudflare.com/ai-gateway/get-started/connecting-applications/
			baseURL: `${env.GATEWAY_URL}/openai`,
		});

		const stream = await openai.chat.completions.create({
			model: env.OPEN_AI_MODEL,
			messages: messages,
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
