import { describe, it, expect } from 'vitest';
import {
  isWildduckAuthResponse,
  isWildduckMessage,
  createPreAuthRequest,
  createAuthenticateRequest,
} from './wildduck-types';

describe('WildDuck Type Guards', () => {
  describe('isWildduckAuthResponse', () => {
    it('returns true for valid auth response with success true', () => {
      const response = {
        success: true,
        id: 'user123',
        username: 'testuser',
        address: 'test@example.com',
      };
      expect(isWildduckAuthResponse(response)).toBe(true);
    });

    it('returns true for valid auth response with success false', () => {
      const response = {
        success: false,
        error: 'Invalid credentials',
      };
      expect(isWildduckAuthResponse(response)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isWildduckAuthResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckAuthResponse(undefined)).toBe(false);
    });

    it('returns false for object without success field', () => {
      const response = { id: 'user123', username: 'testuser' };
      expect(isWildduckAuthResponse(response)).toBe(false);
    });

    it('returns false for non-boolean success field', () => {
      const response = { success: 'true' };
      expect(isWildduckAuthResponse(response)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckAuthResponse('string')).toBe(false);
      expect(isWildduckAuthResponse(123)).toBe(false);
      expect(isWildduckAuthResponse(true)).toBe(false);
    });
  });

  describe('isWildduckMessage', () => {
    it('returns true for valid message object', () => {
      const message = {
        id: 1,
        mailbox: 'inbox123',
        thread: 'thread456',
        subject: 'Test Subject',
        from: { name: 'Sender', address: 'sender@example.com' },
        to: [{ name: 'Recipient', address: 'recipient@example.com' }],
        cc: [],
        bcc: [],
        messageId: '<msg-id@example.com>',
        date: '2024-01-01T00:00:00Z',
        intro: 'Hello...',
        attachments: false,
        size: 1024,
        seen: false,
        deleted: false,
        flagged: false,
        draft: false,
        answered: false,
        forwarded: false,
        references: [],
        contentType: { value: 'text/plain', params: {} },
      };
      expect(isWildduckMessage(message)).toBe(true);
    });

    it('returns true for minimal message with id and subject', () => {
      const message = { id: 1, subject: 'Test' };
      expect(isWildduckMessage(message)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isWildduckMessage(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWildduckMessage(undefined)).toBe(false);
    });

    it('returns false for missing id', () => {
      const message = { subject: 'Test Subject' };
      expect(isWildduckMessage(message)).toBe(false);
    });

    it('returns false for missing subject', () => {
      const message = { id: 1 };
      expect(isWildduckMessage(message)).toBe(false);
    });

    it('returns false for non-number id', () => {
      const message = { id: '1', subject: 'Test' };
      expect(isWildduckMessage(message)).toBe(false);
    });

    it('returns false for non-string subject', () => {
      const message = { id: 1, subject: 123 };
      expect(isWildduckMessage(message)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isWildduckMessage('string')).toBe(false);
      expect(isWildduckMessage(123)).toBe(false);
      expect(isWildduckMessage(true)).toBe(false);
    });
  });
});

describe('WildDuck Helper Functions', () => {
  describe('createPreAuthRequest', () => {
    it('creates a pre-auth request with default scope', () => {
      const request = createPreAuthRequest('testuser');
      expect(request).toEqual({
        username: 'testuser',
        scope: 'master',
      });
    });

    it('creates a pre-auth request with custom options', () => {
      const request = createPreAuthRequest('testuser', {
        scope: 'imap',
        sess: 'session123',
        ip: '192.168.1.1',
      });
      expect(request).toEqual({
        username: 'testuser',
        scope: 'imap',
        sess: 'session123',
        ip: '192.168.1.1',
      });
    });

    it('allows overriding default scope', () => {
      const request = createPreAuthRequest('testuser', { scope: 'pop3' });
      expect(request.scope).toBe('pop3');
    });
  });

  describe('createAuthenticateRequest', () => {
    it('creates an authenticate request with just username', () => {
      const request = createAuthenticateRequest('testuser');
      expect(request).toEqual({
        username: 'testuser',
        protocol: 'API',
        scope: 'master',
        token: false,
      });
    });

    it('creates an authenticate request with signature and message', () => {
      const request = createAuthenticateRequest(
        'testuser',
        '0xsignature123',
        'Sign this message'
      );
      expect(request).toEqual({
        username: 'testuser',
        signature: '0xsignature123',
        message: 'Sign this message',
        protocol: 'API',
        scope: 'master',
        token: false,
      });
    });

    it('creates an authenticate request with custom options', () => {
      const request = createAuthenticateRequest('testuser', undefined, undefined, {
        referralCode: 'REF123',
        sess: 'session456',
        ip: '10.0.0.1',
      });
      expect(request).toEqual({
        username: 'testuser',
        protocol: 'API',
        scope: 'master',
        token: false,
        referralCode: 'REF123',
        sess: 'session456',
        ip: '10.0.0.1',
      });
    });

    it('creates an authenticate request with all parameters', () => {
      const request = createAuthenticateRequest(
        'testuser',
        '0xsig',
        'message',
        {
          referralCode: 'ABC',
          password: 'secret123',
          token: true,
        }
      );
      expect(request.username).toBe('testuser');
      expect(request.signature).toBe('0xsig');
      expect(request.message).toBe('message');
      expect(request.referralCode).toBe('ABC');
      expect(request.password).toBe('secret123');
      expect(request.token).toBe(true); // overridden by options
    });

    it('does not include signature if undefined but includes message if provided', () => {
      const request = createAuthenticateRequest('testuser', undefined, 'message');
      expect(request).not.toHaveProperty('signature');
      // message is included independently of signature
      expect(request).toHaveProperty('message', 'message');
    });

    it('does not include message if signature is undefined', () => {
      const request = createAuthenticateRequest('testuser');
      expect(request).not.toHaveProperty('signature');
      expect(request).not.toHaveProperty('message');
    });
  });
});
