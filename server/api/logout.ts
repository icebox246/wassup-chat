export default defineEventHandler(async (event) => {
  setCookie(event, 'auth-cookie', '', {
    expires: new Date()
  })
})
