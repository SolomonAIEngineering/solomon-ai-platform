# Chat Application Storage Model and API Documentation

## Overview
This document provides an overview of the chat application's storage model and API endpoints implemented using Cloudflare Workers and Cloudflare Workers KV. The application handles storing, retrieving, and managing chat sessions and messages efficiently, allowing for scalable and fast real-time chat functionalities.

## Storage Model

### Data Storage
- **Cloudflare Workers KV**: Utilized for its high performance and low-latency characteristics, ideal for real-time applications.
- **Data Structure**:
  - **Chat Sessions**: Stored as key-value pairs where each key represents a user session and the value is an array of chat entries.
  - **Chat Entries**: Each chat entry is stored as a structured object containing details such as the session ID, timestamp, and the chat message itself.

### Key Definitions
- **`user:chat:{userId}`**: This key points to all chat sessions associated with a specific user. The value is an array containing session objects.
- **`chat:{sessionId}:{chatId}`**: Represents individual chat messages within a session, where `{sessionId}` ties the message to its session and `{chatId}` is a unique identifier for the message.

## API Endpoints

### 1. Store Chat Message
- **Endpoint**: `/storeChatMessage`
- **Method**: POST
- **Description**: Stores a chat message in a specified session or creates a new session if it does not exist.
- **Parameters**:
  - `userId` (required): The user's identifier.
  - `sessionId` (optional): The session identifier. If not provided, a new session is created.

### 2. Get Chat History
- **Endpoint**: `/getChatHistory`
- **Method**: GET
- **Description**: Retrieves the chat history for a specified session and user.
- **Parameters**:
  - `userId` (required): The user's identifier.
  - `sessionId` (required): The session identifier.

### 3. Get All Sessions
- **Endpoint**: `/getAllSessions`
- **Method**: GET
- **Description**: Retrieves all session IDs associated with a user.
- **Parameters**:
  - `userId` (required): The user's identifier.

### 4. Delete Chat History
- **Endpoint**: `/deleteChatHistory`
- **Method**: DELETE
- **Description**: Deletes a specific chat session for a user.
- **Parameters**:
  - `userId` (required): The user's identifier.
  - `sessionId` (required): The session identifier to be deleted.

## Security Considerations
- Authentication and authorization mechanisms should be implemented to ensure that users can only access their data.
- Rate limiting and monitoring to prevent abuse and ensure service availability.

## Usage Examples
Each endpoint is designed to be straightforward, requiring minimal parameters to perform operations effectively. Users can store messages, retrieve chat histories, view all their chat sessions, and delete specific chat histories.

For further implementation details or to report issues, please refer to the provided contact methods or issue trackers associated with this project repository.
