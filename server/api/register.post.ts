import bcrypt from 'bcrypt';
import prisma from '~/lib/prisma';
import { createSignedTokenFromPayload } from '~/utils';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  const passwordHash = await bcrypt.hash(password, 10);

  const inviteCode = uuidv4();
  try {
    const user = await prisma.user.create({
      data: {
        username, passwordHash, inviteCode
      }
    })
    console.log("created a user:", user)

    const token = await createSignedTokenFromPayload({ id: user.id });
    setCookie(event, 'auth-cookie', token)

    return 'ok'
  } catch (e) {
    console.error("failed to create user:", e)
    return e
  }
})
