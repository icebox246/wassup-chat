import { getUserFromToken } from "~/utils"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-cookie')
  if (!token) {
    setResponseStatus(event, 403, "Forbidden");
    return "Not signed in";
  }
  const user = await getUserFromToken(token)
  if (!user) {
    setResponseStatus(event, 403, "Forbidden");
    return "Invalid token";
  }

  const { id, username, registeredDate } = user;
  return { id, username, registeredDate };
})
