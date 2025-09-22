import { env } from '@/env'
import { app } from './app'

const port = env.PORT

app.listen(port)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
console.log(
  `📎 Elysia Docs is running at http://${app.server?.hostname}:${app.server?.port}/openapi`
)
