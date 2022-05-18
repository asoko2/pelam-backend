import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Sktm from 'App/Models/Sktm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SktmsController {
  public async index({ request }: HttpContextContract) {
    const perPage = request.input('limit', 5)
    const pageInput = request.input('page', 0)
    const search = request.input('search')
    // const offset = params.offset
    const sktms = search
      ? await Database.from('sktms')
          .join('pemohons', 'sktms.pemohon_nik', 'pemohons.nik')
          .select('sktms.*', 'pemohons.nik', 'pemohons.nama')
          .where('nama', 'like', `%${search}%`)
          .orWhere('nik', 'like', `%${search}%`)
          .orderBy('sktms.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)
      : await Database.from('sktms')
          .join('pemohons', 'sktms.pemohon_nik', 'pemohons.nik')
          .select('sktms.*', 'pemohons.nik', 'pemohons.nama')
          .orderBy('sktms.id', 'asc')
          .paginate(parseInt(pageInput) + 1, perPage)

    return sktms
  }

  public async store({ request, response }: HttpContextContract) {
    const sktmSchema = schema.create({
      pemohonNik: schema.string(),
      keterangan: schema.string(),
      keperluan: schema.string(),
    })

    const data = await request.validate({
      schema: sktmSchema,
      messages: {},
    })
    try {
      await Sktm.create(data)
      return response.created()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ params }: HttpContextContract) {
    const data = await Database.from('sktms')
      .join('pemohons', 'sktms.pemohon_nik', 'pemohons.nik')
      .select('sktms.*', 'pemohons.*')
      .where('sktms.id', params.id)
    const fileUrl = await Drive.getUrl('' + data[0].kk)
    const url = Env.get('APP_URL') + fileUrl
    const sktm = {
      sktm: data,
      kk_link: url,
    }
    return sktm
  }

  public async destroy({ params, response }: HttpContextContract) {
    const sktm = await Sktm.findByOrFail('id', params.id)
    try {
      await sktm.delete()
      return response.status(200)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
