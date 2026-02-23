import { describe, it, expect } from 'vitest';
import {
  isWildduckSubscribeRequest,
  isWildduckUnsubscribeRequest,
  isWildduckFetchRequest,
  isWildduckDataMessage,
  isWildduckUpdateMessage,
  isWildduckDisconnectMessage,
  isWildduckWebSocketErrorResponse,
  createWildduckSubscribeRequest,
  createWildduckUnsubscribeRequest,
  createWildduckFetchMessagesRequest,
} from './wildduck-websocket-types';
import type { WildduckWebSocketChannel } from './wildduck-websocket-types';

describe('WildDuck WebSocket Type Guards', () => {
  describe('isWildduckSubscribeRequest', () => {
    it('returns true for valid subscribe request', () => {
      const request = {
        type: 'subscribe',
        channel: 'mailboxes',
        data: { userId: 'user123', token: 'token123' },
      };
      expect(isWildduckSubscribeRequest(request)).toBe(true);
    });

    it('returns true for messages channel subscribe request', () => {
      const request = {
        type: 'subscribe',
        channel: 'messages',
        data: {
          userId: 'user123',
          token: 'token123',
          mailboxId: 'mailbox123',
        },
      };
      expect(isWildduckSubscribeRequest(request)).toBe(true);
    });

    it('returns false for wrong type', () => {
      const request = {
        type: 'unsubscribe',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckSubscribeRequest(request)).toBe(false);
    });

    it('returns false for missing channel', () => {
      const request = { type: 'subscribe', data: {} };
      expect(isWildduckSubscribeRequest(request)).toBe(false);
    });

    it('returns false for missing data', () => {
      const request = { type: 'subscribe', channel: 'mailboxes' };
      expect(isWildduckSubscribeRequest(request)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckSubscribeRequest(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckSubscribeRequest(undefined)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckSubscribeRequest('string')).toBe(false);
      expect(isWildduckSubscribeRequest(123)).toBe(false);
      expect(isWildduckSubscribeRequest(true)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckSubscribeRequest({})).toBe(false);
    });

    it('returns false for type as number', () => {
      expect(
        isWildduckSubscribeRequest({
          type: 1,
          channel: 'mailboxes',
          data: {},
        })
      ).toBe(false);
    });
  });

  describe('isWildduckUnsubscribeRequest', () => {
    it('returns true for valid unsubscribe request', () => {
      const request = {
        type: 'unsubscribe',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckUnsubscribeRequest(request)).toBe(true);
    });

    it('returns false for subscribe type', () => {
      const request = {
        type: 'subscribe',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckUnsubscribeRequest(request)).toBe(false);
    });

    it('returns false for missing channel', () => {
      const request = { type: 'unsubscribe' };
      expect(isWildduckUnsubscribeRequest(request)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckUnsubscribeRequest(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckUnsubscribeRequest(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckUnsubscribeRequest({})).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckUnsubscribeRequest('string')).toBe(false);
      expect(isWildduckUnsubscribeRequest(42)).toBe(false);
    });
  });

  describe('isWildduckFetchRequest', () => {
    it('returns true for valid fetch request', () => {
      const request = {
        type: 'fetch',
        channel: 'messages',
        data: { mailboxId: 'mailbox123' },
      };
      expect(isWildduckFetchRequest(request)).toBe(true);
    });

    it('returns true for fetch request with cursor', () => {
      const request = {
        type: 'fetch',
        channel: 'messages',
        data: { mailboxId: 'mailbox123', cursor: 'next-page' },
      };
      expect(isWildduckFetchRequest(request)).toBe(true);
    });

    it('returns false for wrong channel', () => {
      const request = {
        type: 'fetch',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckFetchRequest(request)).toBe(false);
    });

    it('returns false for wrong type', () => {
      const request = {
        type: 'subscribe',
        channel: 'messages',
        data: {},
      };
      expect(isWildduckFetchRequest(request)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckFetchRequest(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckFetchRequest(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckFetchRequest({})).toBe(false);
    });

    it('returns false for missing type', () => {
      expect(
        isWildduckFetchRequest({
          channel: 'messages',
          data: {},
        })
      ).toBe(false);
    });
  });

  describe('isWildduckDataMessage', () => {
    it('returns true for valid data message', () => {
      const message = {
        type: 'data',
        channel: 'mailboxes',
        data: {
          code: 200,
          response: { success: true, mailboxes: [] },
        },
      };
      expect(isWildduckDataMessage(message)).toBe(true);
    });

    it('returns true for settings data message', () => {
      const message = {
        type: 'data',
        channel: 'settings',
        data: { code: 200, response: { success: true } },
      };
      expect(isWildduckDataMessage(message)).toBe(true);
    });

    it('returns false for update type', () => {
      const message = {
        type: 'update',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckDataMessage(message)).toBe(false);
    });

    it('returns false for missing data', () => {
      const message = { type: 'data', channel: 'mailboxes' };
      expect(isWildduckDataMessage(message)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckDataMessage(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckDataMessage(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckDataMessage({})).toBe(false);
    });

    it('returns false for missing channel', () => {
      expect(
        isWildduckDataMessage({ type: 'data', data: {} })
      ).toBe(false);
    });
  });

  describe('isWildduckUpdateMessage', () => {
    it('returns true for valid update message', () => {
      const message = {
        type: 'update',
        channel: 'mailboxes',
        data: {
          code: 200,
          response: { success: true, updates: [] },
        },
      };
      expect(isWildduckUpdateMessage(message)).toBe(true);
    });

    it('returns true for messages update', () => {
      const message = {
        type: 'update',
        channel: 'messages',
        data: {
          code: 200,
          response: { success: true, updates: [] },
        },
      };
      expect(isWildduckUpdateMessage(message)).toBe(true);
    });

    it('returns false for data type', () => {
      const message = {
        type: 'data',
        channel: 'mailboxes',
        data: {},
      };
      expect(isWildduckUpdateMessage(message)).toBe(false);
    });

    it('returns false for missing data', () => {
      const message = { type: 'update', channel: 'mailboxes' };
      expect(isWildduckUpdateMessage(message)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckUpdateMessage(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckUpdateMessage(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckUpdateMessage({})).toBe(false);
    });
  });

  describe('isWildduckDisconnectMessage', () => {
    it('returns true for valid disconnect message', () => {
      const message = {
        type: 'disconnect',
        channel: 'system',
        data: { reason: 'Server shutdown' },
      };
      expect(isWildduckDisconnectMessage(message)).toBe(true);
    });

    it('returns false for wrong channel', () => {
      const message = {
        type: 'disconnect',
        channel: 'mailboxes',
        data: { reason: 'Test' },
      };
      expect(isWildduckDisconnectMessage(message)).toBe(false);
    });

    it('returns false for wrong type', () => {
      const message = {
        type: 'data',
        channel: 'system',
        data: {},
      };
      expect(isWildduckDisconnectMessage(message)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckDisconnectMessage(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckDisconnectMessage(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckDisconnectMessage({})).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckDisconnectMessage('string')).toBe(false);
      expect(isWildduckDisconnectMessage(123)).toBe(false);
    });
  });

  describe('isWildduckWebSocketErrorResponse', () => {
    it('returns true for valid error response', () => {
      const response = {
        success: false,
        error: 'Bad Request',
        message: 'Invalid data provided',
      };
      expect(isWildduckWebSocketErrorResponse(response)).toBe(true);
    });

    it('returns false for success response', () => {
      const response = { success: true, data: {} };
      expect(isWildduckWebSocketErrorResponse(response)).toBe(false);
    });

    it('returns false for missing error field', () => {
      const response = { success: false, message: 'Error message' };
      expect(isWildduckWebSocketErrorResponse(response)).toBe(false);
    });

    it('returns false for missing message field', () => {
      const response = { success: false, error: 'Error' };
      expect(isWildduckWebSocketErrorResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWildduckWebSocketErrorResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckWebSocketErrorResponse(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isWildduckWebSocketErrorResponse({})).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckWebSocketErrorResponse('string')).toBe(false);
      expect(isWildduckWebSocketErrorResponse(123)).toBe(false);
    });

    it('returns false for success as string "false"', () => {
      expect(
        isWildduckWebSocketErrorResponse({
          success: 'false',
          error: 'err',
          message: 'msg',
        })
      ).toBe(false);
    });
  });
});

describe('WildDuck WebSocket Helper Functions', () => {
  describe('createWildduckSubscribeRequest', () => {
    it('creates a mailboxes subscribe request', () => {
      const request = createWildduckSubscribeRequest('mailboxes', {
        userId: 'user123',
        token: 'token456',
      });
      expect(request).toEqual({
        type: 'subscribe',
        channel: 'mailboxes',
        data: { userId: 'user123', token: 'token456' },
      });
    });

    it('creates a settings subscribe request', () => {
      const request = createWildduckSubscribeRequest('settings', {
        userId: 'user123',
        token: 'token456',
      });
      expect(request).toEqual({
        type: 'subscribe',
        channel: 'settings',
        data: { userId: 'user123', token: 'token456' },
      });
    });

    it('creates a filters subscribe request', () => {
      const request = createWildduckSubscribeRequest('filters', {
        userId: 'user123',
        token: 'token456',
      });
      expect(request).toEqual({
        type: 'subscribe',
        channel: 'filters',
        data: { userId: 'user123', token: 'token456' },
      });
    });

    it('creates an autoreply subscribe request', () => {
      const request = createWildduckSubscribeRequest('autoreply', {
        userId: 'user123',
        token: 'token456',
      });
      expect(request).toEqual({
        type: 'subscribe',
        channel: 'autoreply',
        data: { userId: 'user123', token: 'token456' },
      });
    });

    it('creates a messages subscribe request with mailboxId', () => {
      const request = createWildduckSubscribeRequest('messages', {
        userId: 'user123',
        token: 'token456',
        mailboxId: 'inbox789',
      });
      expect(request).toEqual({
        type: 'subscribe',
        channel: 'messages',
        data: {
          userId: 'user123',
          token: 'token456',
          mailboxId: 'inbox789',
        },
      });
    });

    it('throws for invalid channel', () => {
      expect(() =>
        createWildduckSubscribeRequest(
          'invalid' as WildduckWebSocketChannel,
          {
            userId: 'user123',
            token: 'token456',
          }
        )
      ).toThrow('channel must be one of');
    });

    it('throws for empty channel', () => {
      expect(() =>
        createWildduckSubscribeRequest(
          '' as WildduckWebSocketChannel,
          {
            userId: 'user123',
            token: 'token456',
          }
        )
      ).toThrow('channel must be one of');
    });

    it('throws for empty userId', () => {
      expect(() =>
        createWildduckSubscribeRequest('mailboxes', {
          userId: '',
          token: 'token456',
        })
      ).toThrow('data.userId must be a non-empty string');
    });

    it('throws for empty token', () => {
      expect(() =>
        createWildduckSubscribeRequest('mailboxes', {
          userId: 'user123',
          token: '',
        })
      ).toThrow('data.token must be a non-empty string');
    });

    it('throws for null data', () => {
      expect(() =>
        createWildduckSubscribeRequest(
          'mailboxes',
          null as unknown as { userId: string; token: string }
        )
      ).toThrow('data must be a non-null object');
    });

    it('throws for messages channel with empty mailboxId', () => {
      expect(() =>
        createWildduckSubscribeRequest('messages', {
          userId: 'user123',
          token: 'token456',
          mailboxId: '',
        })
      ).toThrow(
        'data.mailboxId must be a non-empty string for messages channel'
      );
    });
  });

  describe('createWildduckUnsubscribeRequest', () => {
    it('creates an unsubscribe request for mailboxes', () => {
      const request =
        createWildduckUnsubscribeRequest('mailboxes');
      expect(request).toEqual({
        type: 'unsubscribe',
        channel: 'mailboxes',
        data: {},
      });
    });

    it('creates an unsubscribe request for settings', () => {
      const request =
        createWildduckUnsubscribeRequest('settings');
      expect(request).toEqual({
        type: 'unsubscribe',
        channel: 'settings',
        data: {},
      });
    });

    it('creates an unsubscribe request for filters', () => {
      const request =
        createWildduckUnsubscribeRequest('filters');
      expect(request).toEqual({
        type: 'unsubscribe',
        channel: 'filters',
        data: {},
      });
    });

    it('creates an unsubscribe request for autoreply', () => {
      const request =
        createWildduckUnsubscribeRequest('autoreply');
      expect(request).toEqual({
        type: 'unsubscribe',
        channel: 'autoreply',
        data: {},
      });
    });

    it('creates an unsubscribe request for messages', () => {
      const request =
        createWildduckUnsubscribeRequest('messages');
      expect(request).toEqual({
        type: 'unsubscribe',
        channel: 'messages',
        data: {},
      });
    });

    it('throws for invalid channel', () => {
      expect(() =>
        createWildduckUnsubscribeRequest(
          'invalid' as WildduckWebSocketChannel
        )
      ).toThrow('channel must be one of');
    });

    it('throws for empty channel', () => {
      expect(() =>
        createWildduckUnsubscribeRequest(
          '' as WildduckWebSocketChannel
        )
      ).toThrow('channel must be one of');
    });

    it('throws for null channel', () => {
      expect(() =>
        createWildduckUnsubscribeRequest(
          null as unknown as WildduckWebSocketChannel
        )
      ).toThrow('channel must be one of');
    });
  });

  describe('createWildduckFetchMessagesRequest', () => {
    it('creates a fetch request without cursor', () => {
      const request =
        createWildduckFetchMessagesRequest('mailbox123');
      expect(request).toEqual({
        type: 'fetch',
        channel: 'messages',
        data: { mailboxId: 'mailbox123' },
      });
    });

    it('creates a fetch request with cursor', () => {
      const request = createWildduckFetchMessagesRequest(
        'mailbox123',
        'cursor456'
      );
      expect(request).toEqual({
        type: 'fetch',
        channel: 'messages',
        data: { mailboxId: 'mailbox123', cursor: 'cursor456' },
      });
    });

    it('does not include cursor when undefined', () => {
      const request = createWildduckFetchMessagesRequest(
        'mailbox123',
        undefined
      );
      expect(request.data).not.toHaveProperty('cursor');
    });

    it('does not include cursor when empty string', () => {
      const request = createWildduckFetchMessagesRequest(
        'mailbox123',
        ''
      );
      expect(request.data).not.toHaveProperty('cursor');
    });

    it('throws for empty mailboxId', () => {
      expect(() =>
        createWildduckFetchMessagesRequest('')
      ).toThrow('mailboxId must be a non-empty string');
    });

    it('throws for non-string mailboxId', () => {
      expect(() =>
        createWildduckFetchMessagesRequest(
          123 as unknown as string
        )
      ).toThrow('mailboxId must be a non-empty string');
    });

    it('throws for null mailboxId', () => {
      expect(() =>
        createWildduckFetchMessagesRequest(
          null as unknown as string
        )
      ).toThrow('mailboxId must be a non-empty string');
    });

    it('throws for undefined mailboxId', () => {
      expect(() =>
        createWildduckFetchMessagesRequest(
          undefined as unknown as string
        )
      ).toThrow('mailboxId must be a non-empty string');
    });
  });
});
