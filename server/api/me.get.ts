import { getCurrentUser } from "~/utils"

interface MeResponse {
  me?: {
    id: number,
    username: string,
    registeredDate: Date,
    inviteCode: string | null,
  }
  err?: Error,
}

export default defineEventHandler(async (event): Promise<MeResponse> => {
  try {
    const user = await getCurrentUser(event);
    const { id, username, registeredDate, inviteCode } = user;
    return { me: { id, username, registeredDate, inviteCode } };
  } catch (err) {
    return { err: err as Error };
  }
})
