import prisma from '~/lib/prisma';
import { createSignedTokenFromPayload, getUserFromToken } from '~/utils';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-cookie')
  if (!token) {
    setResponseStatus(event, 403, "Forbidden");
    return { err: Error("Not signed in") };
  }
  const user = await getUserFromToken(token)
  if (!user) {
    setResponseStatus(event, 401, "Forbidden");
    return { err: Error("Invalid token") };
  }

  const { name, topic } = await readBody(event);

  try {
    const channel = await prisma.channel.create({
      data: {
        name, topic,
        admin: {
          connect: user
        },
        members: {
          connect: user
        }
      }
    })
    console.log("created a channel:", channel)

    return 'ok'
  } catch (e) {
    console.error("failed to create user:", e)
    return e
  }
})
