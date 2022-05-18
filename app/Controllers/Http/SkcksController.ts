import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Skck from 'App/Models/Skck'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SkcksController {
  public async index({ request }: HttpContextContract) {
    const perPage = request.input('limit', 5)
    const pageInput = request.input('page', 0)
    const search = request.input('search')
    // const offset = params.offset
    const skcks = search
      ? await Database.from('skcks')
          .join('pemohons', 'skcks.pemohon_nik', 'pemohons.nik')
          .select('skcks.*', 'pemohons.nik', 'pemohons.nama')
          .where('nama', 'like', `%${search}%`)
          .orWhere('nik', 'like', `%${search}%`)
          .orderBy('skcks.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)
      : await Database.from('skcks')
          .join('pemohons', 'skcks.pemohon_nik', 'pemohons.nik')
          .select('skcks.*', 'pemohons.nik', 'pemohons.nama')
          .orderBy('skcks.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)

    return skcks
  }

  public async store({ request, response }: HttpContextContract) {
    const skckSchema = schema.create({
      pemohonNik: schema.string(),
      keterangan: schema.string(),
      keperluan: schema.string(),
    })

    const data = await request.validate({
      schema: skckSchema,
      messages: {},
    })
    try {
      await Skck.create(data)
      return response.created()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ params }: HttpContextContract) {
    const data = await Database.from('skcks')
      .join('pemohons', 'skcks.pemohon_nik', 'pemohons.nik')
      .select('skcks.*', 'pemohons.*')
      .where('skcks.id', params.id)
    const fileUrl = await Drive.getUrl('' + data[0].kk)
    const url = Env.get('APP_URL') + fileUrl
    const skck = {
      skck: data,
      kk_link: url,
    }
    return skck
  }

  public async destroy({ params, response }: HttpContextContract) {
    const skck = await Skck.findByOrFail('id', params.id)
    try {
      await skck.delete()
      return response.status(200)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
