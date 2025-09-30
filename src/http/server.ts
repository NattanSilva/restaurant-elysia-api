import { env } from '@/env'
import kleur from 'kleur'
import { app } from './app'

const port = env.PORT

app.listen(port)

console.log(
  kleur.green(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  )
)
console.log(
  kleur.blue(
    `📖 Elysia Docs is running at http://${app.server?.hostname}:${app.server?.port}/openapi`
  )
)
