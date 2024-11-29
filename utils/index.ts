import { createSecretKey } from 'crypto';
import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import { env } from 'process'
import prisma from '~/lib/prisma';
import type { User } from '@prisma/client'

const secretKey = createSecretKey(env.JWT_SECRET!, 'utf-8');

export async function createSignedTokenFromPayload(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(env.JWT_ISSUER!)
    .setAudience(env.JWT_AUDIENCE!)
    .setIssuedAt()
    .sign(secretKey);
  return token;
}

export async function extractPayloadFromSignedToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });
  return payload;
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = await extractPayloadFromSignedToken(token) as { id: number };
  return await prisma.user.findUnique({ where: { id: payload.id } })
}
