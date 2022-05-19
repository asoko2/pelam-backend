import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Skck from 'App/Models/Skck'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import Keterangan from 'App/Models/Keterangan'

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
      // keterangan: schema.string(),
      keperluan: schema.string(),
    })

    const data = await request.validate({
      schema: skckSchema,
      messages: {},
    })
    try {
      const skck = await Skck.create(data)
      console.log(skck)
      request.input('keterangan').forEach(async (element) => {
        await Keterangan.create({
          keterangan: element,
          jenis_permohonan: 'skck',
          permohonanId: skck.id,
        })
      })
      // return response.notFound()
      return response.created()
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ params }: HttpContextContract) {
    const data = await Database.from('skcks')
      .join('pemohons', 'skcks.pemohon_nik', 'pemohons.nik')
      .select(
        'skcks.*',
        'pemohons.nik',
        'pemohons.nama',
        'pemohons.jenis_kelamin',
        'pemohons.tanggal_lahir',
        'pemohons.agama',
        'pemohons.kewarganegaraan',
        'pemohons.alamat',
        'keperluan',
        'kk'
      )
      .where('skcks.id', params.id)

    const keterangan = await Keterangan.query().where('permohonanId', data[0].id)
    const fileUrl = await Drive.getUrl('' + data[0].kk)
    const url = Env.get('APP_URL') + fileUrl
    const skck = {
      skck: data,
      keterangan: keterangan,
      kk_link: url,
    }
    return skck
  }

  public async destroy({ params, response }: HttpContextContract) {
    console.log('start delete')
    const skck = await Skck.findByOrFail('id', params.id)
    try {
      console.log('try delete')
      const keterangan = await Keterangan.query().where('permohonanId', skck.id).delete()
      console.log(keterangan)
      await skck.delete()
      return response.status(200)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
