import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Pemohon from "App/Models/Pemohon";

export default class PemohonsController {
    public async index({ request }: HttpContextContract) {
        const perPage = request.input('limit', 5)
        const pageInput = request.input('page', 1)
        const search = request.input('search')
        // const offset = params.offset
        const pemohons = search ? await Pemohon.query()
            .where('nama', 'like', `%${search}%`).paginate((parseInt(pageInput) + 1), perPage)
            : await Pemohon.query().paginate((parseInt(pageInput) + 1), perPage)

        return pemohons
    }

    public async store({ request, response }: HttpContextContract) {
        const pemohonSchema = schema.create({
            nama: schema.string(),
            tempat_lahir: schema.string(),
            tanggal_lahir: schema.string(),
            jenis_kelamin: schema.string(),
            kewarganegaraan: schema.string(),
            nik: schema.string({}, [rules.unique({ table: 'pemohons', column: 'nik' })]),
            agama: schema.string(),
            pekerjaan: schema.string(),
            telpon: schema.string(),
            alamat: schema.string(),
            kk: schema.string()
        })

        const data = await request.validate({ schema: pemohonSchema })

        try {
            await Pemohon.create(data)
            return response.created()
        } catch (error) {
            return response.badRequest(error)
        }
    }

    public async show({ params }: HttpContextContract) {
        const pemohon = await Pemohon.find(params.id)
        return pemohon
    }
}
