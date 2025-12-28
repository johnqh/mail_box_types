/**
 * WildDuck WebSocket API Type Definitions
 *
 * Type definitions for real-time WebSocket communication with WildDuck mail server.
 * Reuses existing WildDuck types where possible for consistency.
 */

import type {
  WildduckMailbox,
  WildduckUserResponse,
  WildduckFilterListItem,
  WildduckAutoreplyResponse,
  WildduckMessageListItem,
  WildduckObjectId,
} from './wildduck-types';

// ============================================================================
// WebSocket Channel Types
// ============================================================================

/**
 * Available WebSocket channels
 */
export type WildduckWebSocketChannel =
  | 'mailboxes'
  | 'settings'
  | 'filters'
  | 'autoreply'
  | 'messages';

/**
 * WebSocket message types
 */
export type WildduckWebSocketMessageType =
  | 'subscribe' // Subscribe to a channel
  | 'unsubscribe' // Unsubscribe from a channel
  | 'fetch' // Fetch more data (for pagination)
  | 'data' // Data response (initial or fetched data)
  | 'update' // Real-time update notification
  | 'disconnect'; // Server disconnect notification

// ============================================================================
// Base WebSocket Message Structure
// ============================================================================

/**
 * Base WebSocket message envelope
 */
export interface WildduckWebSocketMessage<T = unknown> {
  type: WildduckWebSocketMessageType;
  channel: WildduckWebSocketChannel | 'system';
  data: T;
}

// ============================================================================
// Client Request Messages
// ============================================================================

/**
 * Base authentication data for channel subscriptions
 */
export interface WildduckWebSocketAuthData {
  userId: WildduckObjectId;
  token: string; // 40-character hex access token
}

/**
 * Subscribe to mailboxes channel
 */
export interface WildduckSubscribeMailboxesRequest
  extends WildduckWebSocketMessage<WildduckWebSocketAuthData> {
  type: 'subscribe';
  channel: 'mailboxes';
}

/**
 * Subscribe to settings channel
 */
export interface WildduckSubscribeSettingsRequest
  extends WildduckWebSocketMessage<WildduckWebSocketAuthData> {
  type: 'subscribe';
  channel: 'settings';
}

/**
 * Subscribe to filters channel
 */
export interface WildduckSubscribeFiltersRequest
  extends WildduckWebSocketMessage<WildduckWebSocketAuthData> {
  type: 'subscribe';
  channel: 'filters';
}

/**
 * Subscribe to autoreply channel
 */
export interface WildduckSubscribeAutoreplyRequest
  extends WildduckWebSocketMessage<WildduckWebSocketAuthData> {
  type: 'subscribe';
  channel: 'autoreply';
}

/**
 * Subscribe to messages channel
 */
export interface WildduckSubscribeMessagesRequest
  extends WildduckWebSocketMessage<
    WildduckWebSocketAuthData & {
      mailboxId: WildduckObjectId;
    }
  > {
  type: 'subscribe';
  channel: 'messages';
}

/**
 * Union type for all subscribe requests
 */
export type WildduckSubscribeRequest =
  | WildduckSubscribeMailboxesRequest
  | WildduckSubscribeSettingsRequest
  | WildduckSubscribeFiltersRequest
  | WildduckSubscribeAutoreplyRequest
  | WildduckSubscribeMessagesRequest;

/**
 * Unsubscribe from a channel
 */
export interface WildduckUnsubscribeRequest
  extends WildduckWebSocketMessage<object> {
  type: 'unsubscribe';
  channel: WildduckWebSocketChannel;
  data: object; // Empty object
}

/**
 * Fetch more data for messages channel (pagination)
 */
export interface WildduckFetchMessagesRequest
  extends WildduckWebSocketMessage<{
    mailboxId: WildduckObjectId;
    cursor?: string;
  }> {
  type: 'fetch';
  channel: 'messages';
}

/**
 * Union type for all client request messages
 */
export type WildduckWebSocketClientMessage =
  | WildduckSubscribeRequest
  | WildduckUnsubscribeRequest
  | WildduckFetchMessagesRequest;

// ============================================================================
// Server Response Data Structures
// ============================================================================

/**
 * Standard WebSocket response wrapper
 */
export interface WildduckWebSocketResponseData<T = unknown> {
  code: number; // HTTP-style status code
  response: T;
}

/**
 * Success response base
 */
export interface WildduckWebSocketSuccessResponse {
  success: true;
}

/**
 * Error response
 */
export interface WildduckWebSocketErrorResponse {
  success: false;
  error: string; // Error name (e.g., "Bad Request", "Unauthorized")
  message: string; // Detailed error message
}

/**
 * Mailboxes channel initial data response
 */
export interface WildduckMailboxesDataResponse
  extends WildduckWebSocketSuccessResponse {
  mailboxes: WildduckMailbox[];
}

/**
 * Settings channel initial data response (reuses WildduckUserResponse)
 */
export type WildduckSettingsDataResponse = WildduckUserResponse;

/**
 * Filters channel initial data response
 */
export interface WildduckFiltersDataResponse
  extends WildduckWebSocketSuccessResponse {
  limits: {
    allowed: number;
    used: number;
  };
  filters: WildduckFilterListItem[];
}

/**
 * Autoreply channel initial data response (reuses WildduckAutoreplyResponse)
 */
export type WildduckAutoreplyDataResponse = WildduckAutoreplyResponse;

/**
 * Messages channel initial data response
 */
export interface WildduckMessagesDataResponse
  extends WildduckWebSocketSuccessResponse {
  mailboxId: WildduckObjectId;
  specialUse: string | null;
  messages: WildduckMessageListItem[];
  hasMore: boolean;
}

/**
 * Messages fetch response (for pagination)
 */
export interface WildduckMessagesFetchResponse
  extends WildduckWebSocketSuccessResponse {
  mailboxId: WildduckObjectId;
  messages: WildduckMessageListItem[];
  hasMore: boolean;
}

/**
 * Unsubscribe success response
 */
export interface WildduckUnsubscribeResponse
  extends WildduckWebSocketSuccessResponse {
  unsubscribed: true;
}

// ============================================================================
// Server Data Response Messages
// ============================================================================

/**
 * Mailboxes channel data response
 */
export interface WildduckMailboxesDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckMailboxesDataResponse>
  > {
  type: 'data';
  channel: 'mailboxes';
}

/**
 * Settings channel data response
 */
export interface WildduckSettingsDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckSettingsDataResponse>
  > {
  type: 'data';
  channel: 'settings';
}

/**
 * Filters channel data response
 */
export interface WildduckFiltersDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckFiltersDataResponse>
  > {
  type: 'data';
  channel: 'filters';
}

/**
 * Autoreply channel data response
 */
export interface WildduckAutoreplyDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckAutoreplyDataResponse>
  > {
  type: 'data';
  channel: 'autoreply';
}

/**
 * Messages channel data response
 */
export interface WildduckMessagesDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<
      WildduckMessagesDataResponse | WildduckMessagesFetchResponse
    >
  > {
  type: 'data';
  channel: 'messages';
}

/**
 * Error response message (can be on any channel)
 */
export interface WildduckErrorDataMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckWebSocketErrorResponse>
  > {
  type: 'data';
  channel: WildduckWebSocketChannel | 'system';
}

/**
 * Union type for all data response messages
 */
export type WildduckWebSocketDataMessage =
  | WildduckMailboxesDataMessage
  | WildduckSettingsDataMessage
  | WildduckFiltersDataMessage
  | WildduckAutoreplyDataMessage
  | WildduckMessagesDataMessage
  | WildduckErrorDataMessage;

// ============================================================================
// Real-time Update Events
// ============================================================================

/**
 * Event type for mailbox updates
 */
export type WildduckMailboxUpdateEventType =
  | 'mailbox.created'
  | 'mailbox.renamed'
  | 'mailbox.deleted';

/**
 * Event type for message updates
 */
export type WildduckMessageUpdateEventType =
  | 'message.added'
  | 'message.flags.changed'
  | 'message.moved'
  | 'message.deleted';

/**
 * Event type for settings updates
 */
export type WildduckSettingsUpdateEventType = 'settings.updated';

/**
 * Event type for filter updates
 */
export type WildduckFilterUpdateEventType =
  | 'filter.created'
  | 'filter.deleted';

/**
 * Event type for autoreply updates
 */
export type WildduckAutoreplyUpdateEventType =
  | 'autoreply.user.enabled'
  | 'autoreply.user.disabled';

/**
 * Mailbox update event
 */
export interface WildduckMailboxUpdateEvent {
  type: WildduckMailboxUpdateEventType;
  mailbox?: WildduckObjectId;
  path?: string;
  oldPath?: string;
  newPath?: string;
  time: number;
}

/**
 * Message update event
 */
export interface WildduckMessageUpdateEvent {
  type: WildduckMessageUpdateEventType;
  mailbox: WildduckObjectId;
  message?: number; // Message UID
  uid?: number;
  flags?: string[];
  time: number;
}

/**
 * Settings update event
 */
export interface WildduckSettingsUpdateEvent {
  type: WildduckSettingsUpdateEventType;
  data: Partial<WildduckSettingsDataResponse>;
  time: number;
}

/**
 * Filter update event
 */
export interface WildduckFilterUpdateEvent {
  type: WildduckFilterUpdateEventType;
  filter?: WildduckObjectId;
  time: number;
}

/**
 * Autoreply update event
 */
export interface WildduckAutoreplyUpdateEvent {
  type: WildduckAutoreplyUpdateEventType;
  time: number;
}

/**
 * Union type for all update events
 */
export type WildduckWebSocketUpdateEvent =
  | WildduckMailboxUpdateEvent
  | WildduckMessageUpdateEvent
  | WildduckSettingsUpdateEvent
  | WildduckFilterUpdateEvent
  | WildduckAutoreplyUpdateEvent;

// ============================================================================
// Server Update Messages
// ============================================================================

/**
 * Batched updates response
 */
export interface WildduckBatchedUpdatesResponse
  extends WildduckWebSocketSuccessResponse {
  updates: WildduckWebSocketUpdateEvent[];
}

/**
 * Mailboxes channel update message
 */
export interface WildduckMailboxesUpdateMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckBatchedUpdatesResponse>
  > {
  type: 'update';
  channel: 'mailboxes';
}

/**
 * Settings channel update message
 */
export interface WildduckSettingsUpdateMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckBatchedUpdatesResponse>
  > {
  type: 'update';
  channel: 'settings';
}

/**
 * Filters channel update message
 */
export interface WildduckFiltersUpdateMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckBatchedUpdatesResponse>
  > {
  type: 'update';
  channel: 'filters';
}

/**
 * Autoreply channel update message
 */
export interface WildduckAutoreplyUpdateMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckBatchedUpdatesResponse>
  > {
  type: 'update';
  channel: 'autoreply';
}

/**
 * Messages channel update message
 */
export interface WildduckMessagesUpdateMessage
  extends WildduckWebSocketMessage<
    WildduckWebSocketResponseData<WildduckBatchedUpdatesResponse>
  > {
  type: 'update';
  channel: 'messages';
}

/**
 * Union type for all update messages
 */
export type WildduckWebSocketUpdateMessage =
  | WildduckMailboxesUpdateMessage
  | WildduckSettingsUpdateMessage
  | WildduckFiltersUpdateMessage
  | WildduckAutoreplyUpdateMessage
  | WildduckMessagesUpdateMessage;

// ============================================================================
// Disconnect Messages
// ============================================================================

/**
 * Disconnect notification from server
 */
export interface WildduckDisconnectMessage
  extends WildduckWebSocketMessage<{
    reason: string;
  }> {
  type: 'disconnect';
  channel: 'system';
}

// ============================================================================
// Union Types for All Messages
// ============================================================================

/**
 * All server response messages
 */
export type WildduckWebSocketServerMessage =
  | WildduckWebSocketDataMessage
  | WildduckWebSocketUpdateMessage
  | WildduckDisconnectMessage;

/**
 * All WebSocket messages (client and server)
 */
export type WildduckAnyWebSocketMessage =
  | WildduckWebSocketClientMessage
  | WildduckWebSocketServerMessage;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for subscribe requests
 */
export const isWildduckSubscribeRequest = (
  msg: unknown
): msg is WildduckSubscribeRequest => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'subscribe' &&
    'channel' in msg &&
    'data' in msg
  );
};

/**
 * Type guard for unsubscribe requests
 */
export const isWildduckUnsubscribeRequest = (
  msg: unknown
): msg is WildduckUnsubscribeRequest => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'unsubscribe' &&
    'channel' in msg
  );
};

/**
 * Type guard for fetch requests
 */
export const isWildduckFetchRequest = (
  msg: unknown
): msg is WildduckFetchMessagesRequest => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'fetch' &&
    'channel' in msg &&
    msg.channel === 'messages'
  );
};

/**
 * Type guard for data messages
 */
export const isWildduckDataMessage = (
  msg: unknown
): msg is WildduckWebSocketDataMessage => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'data' &&
    'channel' in msg &&
    'data' in msg
  );
};

/**
 * Type guard for update messages
 */
export const isWildduckUpdateMessage = (
  msg: unknown
): msg is WildduckWebSocketUpdateMessage => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'update' &&
    'channel' in msg &&
    'data' in msg
  );
};

/**
 * Type guard for disconnect messages
 */
export const isWildduckDisconnectMessage = (
  msg: unknown
): msg is WildduckDisconnectMessage => {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    msg.type === 'disconnect' &&
    'channel' in msg &&
    msg.channel === 'system'
  );
};

/**
 * Type guard for WebSocket error responses
 */
export const isWildduckWebSocketErrorResponse = (
  response: unknown
): response is WildduckWebSocketErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response &&
    'message' in response
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a subscribe request message
 */
export function createWildduckSubscribeRequest<T extends WildduckWebSocketChannel>(
  channel: T,
  data: T extends 'messages'
    ? WildduckWebSocketAuthData & { mailboxId: WildduckObjectId }
    : WildduckWebSocketAuthData
): WildduckSubscribeRequest {
  return {
    type: 'subscribe',
    channel,
    data,
  } as WildduckSubscribeRequest;
}

/**
 * Create an unsubscribe request message
 */
export function createWildduckUnsubscribeRequest(
  channel: WildduckWebSocketChannel
): WildduckUnsubscribeRequest {
  return {
    type: 'unsubscribe',
    channel,
    data: {},
  };
}

/**
 * Create a fetch request message for messages channel
 */
export function createWildduckFetchMessagesRequest(
  mailboxId: WildduckObjectId,
  cursor?: string
): WildduckFetchMessagesRequest {
  return {
    type: 'fetch',
    channel: 'messages',
    data: {
      mailboxId,
      ...(cursor && { cursor }),
    },
  };
}
