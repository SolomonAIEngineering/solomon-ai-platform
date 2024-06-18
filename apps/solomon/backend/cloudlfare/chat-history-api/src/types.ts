import { DateTime, Obj, Str } from "@cloudflare/itty-router-openapi";

export const Task = {
	name: new Str({ example: "lorem" }),
	slug: String,
	description: new Str({ required: false }),
	completed: Boolean,
	due_date: new DateTime(),
};

export const ConversationMessage = {
	userId: new Str({ required: false }),
	role: new Str({ required: false }), // Change the type to string
	message: new Obj({ required: false }),
	sessionId: new Str({ required: false }), // Optional session ID if managing sessions
	title: new Str({ required: false }), // Optional title if managing sessions
	createdAt: new DateTime(),
	path: new Str({ required: false }),
	sharePath: new Str({ required: false }),
};


export const LLMConversationRecord = {
	role: new Str({ required: false }), // Change the type to string
	message: new Str({ required: false })
};
