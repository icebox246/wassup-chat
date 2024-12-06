import prisma from '~/lib/prisma';
import { getCurrentUser } from '~/utils';

export default defineEventHandler(async (event) => {
  try {
    const channelId = Number.parseInt(getRouterParam(event, 'channelId') ?? 'nan');
    if (isNaN(channelId)) {
      throw Error("Invalid channel Id")
    }

    const { content, type } = await readBody(event);
    const user = await getCurrentUser(event);

    const message = await prisma.message.create({
      data: {
        content: content as string,
        type: type as string,
        channelId,
        sentDate: new Date(),
        authorId: user.id,
      },
    })
    console.log("created a message:", user)

    return { body: message };
  } catch (e) {
    console.error("Failed to create message:", e);
    return { err: e as Error }
  }
})