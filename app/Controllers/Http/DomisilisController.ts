import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Domisili from 'App/Models/Domisili'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DomisilisController {
  public async index({ request }: HttpContextContract) {
    const perPage = request.input('limit', 5)
    const pageInput = request.input('page', 0)
    const search = request.input('search')
    // const offset = params.offset
    const domisilis = search
      ? await Database.from('domisilis')
          .join('pemohons', 'domisilis.pemohon_nik', 'pemohons.nik')
          .select('domisilis.*', 'pemohons.nik', 'pemohons.nama')
          .where('nama', 'like', `%${search}%`)
          .orWhere('nik', 'like', `%${search}%`)
          .orderBy('domisilis.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)
      : await Database.from('domisilis')
          .join('pemohons', 'domisilis.pemohon_nik', 'pemohons.nik')
          .select('domisilis.*', 'pemohons.nik', 'pemohons.nama')
          .orderBy('domisilis.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)

    return domisilis
  }

  public async store({ request, response }: HttpContextContract) {
    const domisiliSchema = schema.create({
      pemohonNik: schema.string(),
      keterangan: schema.string(),
      keperluan: schema.string(),
    })

    const data = await request.validate({
      schema: domisiliSchema,
      messages: {},
    })
    try {
      await Domisili.create(data)
      return response.created()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ params }: HttpContextContract) {
    const data = await Database.from('domisilis')
      .join('pemohons', 'domisilis.pemohon_nik', 'pemohons.nik')
      .select('domisilis.*', 'pemohons.*')
      .where('domisilis.id', params.id)
    const fileUrl = await Drive.getUrl('' + data[0].kk)
    const url = Env.get('APP_URL') + fileUrl
    const domisili = {
      domisili: data,
      kk_link: url,
    }
    return domisili
  }

  public async destroy({ params, response }: HttpContextContract) {
    const domisili = await Domisili.findByOrFail('id', params.id)
    try {
      await domisili.delete()
      return response.status(200)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
