import { BadRequestException } from '@nestjs/common';
import { DocumentType, Prisma } from '@prisma/client';
import {
  DocumentValidationError,
  encryptDocument,
  hashDocument,
  maskFromLast4,
  validateAndClassifyDocument,
} from './document-crypto';
import { normalizePhone } from './phone-normalizer';

export interface AddressInput {
  cep: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  uf: string;
  country?: string;
  complement?: string | null;
  ibgeCode?: string | null;
}

export function protectedDocumentData(raw: string) {
  try {
    const document = validateAndClassifyDocument(raw);
    const encrypted = encryptDocument(document.normalized);

    return {
      documentType: document.type,
      documentHash: hashDocument(document.normalized),
      documentEncrypted: encrypted.encrypted,
      documentLast4: document.last4,
      documentKeyVersion: encrypted.keyVersion,
    };
  } catch (error) {
    if (error instanceof DocumentValidationError) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}

export function clearProtectedDocumentData() {
  return {
    documentType: null,
    documentHash: null,
    documentEncrypted: null,
    documentLast4: null,
    documentKeyVersion: null,
  };
}

export function normalizeOptionalPhone(phone: string | null | undefined) {
  if (phone === undefined) return undefined;
  if (phone === null || phone.trim() === '') return null;

  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw new BadRequestException('Telefone deve conter DDD e 10 ou 11 dígitos.');
  }
  return normalized;
}

export function normalizeAddress(
  address: AddressInput,
): Prisma.UserAddressUncheckedCreateWithoutUserInput {
  const cep = address.cep.replace(/\D/g, '');
  if (cep.length !== 8) {
    throw new BadRequestException('CEP deve conter 8 dígitos.');
  }

  return {
    cep,
    street: address.street.trim(),
    streetNumber: address.streetNumber.trim(),
    neighborhood: address.neighborhood.trim(),
    city: address.city.trim(),
    uf: address.uf.trim().toUpperCase(),
    country: address.country?.trim() || 'Brasil',
    complement: address.complement?.trim() || null,
    ibgeCode: address.ibgeCode?.replace(/\D/g, '') || null,
    mainAddress: true,
  };
}

export function documentPreview(user: {
  documentType: DocumentType | null;
  documentLast4: string | null;
}) {
  if (!user.documentType || !user.documentLast4) return null;
  return {
    type: user.documentType,
    masked: maskFromLast4(user.documentLast4, user.documentType),
  };
}
