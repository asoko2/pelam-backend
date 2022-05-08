import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {

    public async register({ request, auth, response }: HttpContextContract) {
        const userSchema = schema.create({
            username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
            password: schema.string({}, [rules.minLength(8)]),
            level: schema.number(),

        })

        const data = await request.validate({ schema: userSchema })

        try {
            const user = await User.create(data)

            const token = await auth.login(user)

            return token
        } catch (error) {
            return response.badRequest(error)
        }
    }

    public async login({ request, auth }) {

        const username = request.input('username')
        const password = request.input('password')

        const token = await auth.attempt(username, password)

        return token

    }
}
