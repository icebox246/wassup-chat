import { sendStream } from 'h3'
import { statSync, createReadStream } from 'node:fs'

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename');
  if (!filename) {
    throw createError({ status: 400, statusMessage: "Invalid request" });
  }

  const config = useRuntimeConfig();
  const filepath = config.public.fileStorage.mount + filename;

  try {
    statSync(filepath)
  } catch {
    throw createError({ status: 404, statusMessage: "Not found" });
  }

  return sendStream(event, createReadStream(filepath))
})
