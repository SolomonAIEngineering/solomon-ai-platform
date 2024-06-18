import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { AddResponseToConversation } from "endpoints/chat-history/add-response-to-conversation";
import { GetConversation } from "endpoints/chat-history/get-conversation";
import { DeleteConversation } from "endpoints/chat-history/delete-conversation";
import { ExecuteQuestion } from "endpoints/chat-history/execute-question";
import { D1Database, KVNamespace, R2Bucket } from "@cloudflare/workers-types/experimental";
import { OpenAIStreamingEndpoint } from "endpoints/chat-history/openai-streaming-endpoint";

export interface Env {
	production: KVNamespace;
	ENVIRONMENT: "production";
	OPENAI_API_KEY: "";
	GATEWAY_URL: "https://gateway.ai.cloudflare.com/v1/de345701e5dc7e14d3c079da3e637448/solomon-ai-gateway-production";
	bucket: R2Bucket;
	db: D1Database;
	AI: unknown;
	OPEN_AI_MODEL: "gpt-3.5-turbo";

	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.get("/api/tasks/", TaskList);
router.post("/api/tasks/", TaskCreate);
router.get("/api/tasks/:taskSlug/", TaskFetch);
router.delete("/api/tasks/:taskSlug/", TaskDelete);
router.post("/api/chat/:userId/:sessionId", AddResponseToConversation);
router.get("/api/chat/:userId/:sessionId", GetConversation);
router.delete("/api/chat/:userId/:sessionId", DeleteConversation);
router.post("/api/chat/:userId/:sessionId/:message", ExecuteQuestion);
router.post("/api/chat/query", OpenAIStreamingEndpoint);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: router.handle,
};
