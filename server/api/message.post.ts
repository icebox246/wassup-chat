import prisma from '~/lib/prisma';
import { getUserFromToken } from '~/utils';
export default defineEventHandler(async (event) => {
  const {content, channelId, type } = await readBody(event);
  const token = getCookie(event, 'auth-cookie')
  if (!token) {
    setResponseStatus(event, 401, "Forbidden");
    return { err: Error("No token") };
  }
  const user = await getUserFromToken(token);
  if (!user) {
    setResponseStatus(event, 401, "Forbidden");
    return { err: Error("Invalid token") };
  }
  try {
    const message = await prisma.message.create({
      data: {
        content,
        type,
        channelId,
        authorId: user.id,
        sentDate: new Date(),
      },
    })
    console.log("created a user:", user)

    return { body: message };
  } catch (e) {
    console.error("Failed to create message:", e);
    return e
  }
})