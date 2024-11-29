import bcrypt from 'bcrypt';
import prisma from '~/lib/prisma';
import { createSignedTokenFromPayload } from '~/utils';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username
      }
    })
    console.log("found a user for login:", user)

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = await createSignedTokenFromPayload({ id: user.id });
      setCookie(event, 'auth-cookie', token)

      return 'ok'
    }
  } catch (e) {
    console.error("failed to create user:", e)
  }

  setResponseStatus(event, 401, "Unauthorized")
  return "Invalid creadentials"
})

