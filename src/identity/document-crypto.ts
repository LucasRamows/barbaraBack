import * as crypto from 'crypto';
import { DocumentType } from '@prisma/client';
import { normalizeDocument, isValidDocument } from './identity-audit';

const DEFAULT_KEY_VERSION = 1;

function requiredSecret(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be configured`);
  return value;
}

function configuredKeys(): Record<number, Buffer> {
  const keys: Record<number, Buffer> = {
    1: crypto
      .createHash('sha256')
      .update(requiredSecret('DOCUMENT_ENCRYPTION_KEY'))
      .digest(),
  };
  const versionTwo = process.env.DOCUMENT_ENCRYPTION_KEY_V2?.trim();
  if (versionTwo) {
    keys[2] = crypto.createHash('sha256').update(versionTwo).digest();
  }
  return keys;
}

export class DocumentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentValidationError';
  }
}

/**
 * Validates check digits and determines document type (CPF vs CNPJ).
 */
export function validateAndClassifyDocument(raw: string): {
  normalized: string;
  type: DocumentType;
  last4: string;
} {
  const normalized = normalizeDocument(raw);
  if (!isValidDocument(normalized)) {
    throw new DocumentValidationError('Documento inválido: CPF ou CNPJ com dígitos verificadores incorretos.');
  }

  const type = normalized.length === 11 ? DocumentType.CPF : DocumentType.CNPJ;
  const last4 = normalized.slice(-4);

  return { normalized, type, last4 };
}

/**
 * Generates an HMAC-SHA256 blind-index hash for fast, privacy-preserving uniqueness lookups.
 */
export function hashDocument(
  normalized: string,
  pepper = requiredSecret('DOCUMENT_HASH_PEPPER'),
): string {
  return crypto.createHmac('sha256', pepper).update(normalized).digest('hex');
}

/**
 * Encrypts document using AES-256-GCM with authenticated tag.
 * Returns iv:ciphertext:tag string.
 */
export function encryptDocument(
  normalized: string,
  keyVersion = DEFAULT_KEY_VERSION,
  keys = configuredKeys(),
): { encrypted: string; keyVersion: number } {
  const key = keys[keyVersion];
  if (!key) {
    throw new Error(`Encryption key version ${keyVersion} not configured`);
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(normalized, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const encrypted = `${iv.toString('hex')}:${ciphertext.toString('hex')}:${tag.toString('hex')}`;
  return { encrypted, keyVersion };
}

/**
 * Decrypts an AES-256-GCM ciphertext using the designated key version.
 */
export function decryptDocument(
  encrypted: string,
  keyVersion: number,
  keys = configuredKeys(),
): string {
  const key = keys[keyVersion];
  if (!key) {
    throw new Error(`Decryption key version ${keyVersion} not found`);
  }

  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format');
  }

  const [ivHex, ciphertextHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Rotates an encrypted document to a new key version without exposing plaintext.
 */
export function rotateDocument(
  encrypted: string,
  currentVersion: number,
  newVersion: number,
  keys = configuredKeys(),
): { encrypted: string; keyVersion: number } {
  const plaintext = decryptDocument(encrypted, currentVersion, keys);
  return encryptDocument(plaintext, newVersion, keys);
}

/**
 * Produces a user-facing masked representation of a CPF or CNPJ.
 * CPF: ***.***.890-12
 * CNPJ: **.***.*** / 0001-90
 */
export function maskDocument(normalized: string, type: DocumentType): string {
  if (type === DocumentType.CPF && normalized.length === 11) {
    return `***.***.${normalized.slice(6, 9)}-${normalized.slice(9, 11)}`;
  }
  if (type === DocumentType.CNPJ && normalized.length === 14) {
    return `**.***.***/${normalized.slice(8, 12)}-${normalized.slice(12, 14)}`;
  }
  return `***${normalized.slice(-4)}`;
}

/**
 * Returns a masked preview using only last 4 digits when full doc is not available.
 */
export function maskFromLast4(last4: string, type: DocumentType): string {
  if (type === DocumentType.CPF) {
    return `***.***.${last4.slice(0, 2)}-${last4.slice(2, 4)}`;
  }
  return `**.***.***/${last4.slice(0, 2)}-${last4.slice(2, 4)}`;
}
