import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const { inviteCode } = getQuery(event);
    console.log("Received inviteCode:", inviteCode);

    if (!inviteCode) {
      throw Error("Invite code is required");
    }

    const channel = await prisma.channel.findUnique({
      where: { inviteCode: String(inviteCode) },
    });

    console.log("Fetched channel from DB:", channel);

    if (!channel) {
      setResponseStatus(event, 404, "Channel not found");
      console.log("Channel not found");
      return { err: "Channel not found" };
    }

    return { channel };
  } catch (err) {
    console.error("Error in endpoint:", err);
    return { err: (err as Error).message };
  }
});