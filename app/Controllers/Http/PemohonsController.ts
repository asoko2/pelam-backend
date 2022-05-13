import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
import fs from 'fs'
// import * as Helpers from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import Pemohon from "App/Models/Pemohon";
import Application from '@ioc:Adonis/Core/Application'

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
        // const pemohonSchema = schema.create({
        //     nama: schema.string(),
        //     tempat_lahir: schema.string(),
        //     tanggal_lahir: schema.string(),
        //     jenis_kelamin: schema.string(),
        //     kewarganegaraan: schema.string(),
        //     nik: schema.string({}, [rules.unique({ table: 'pemohons', column: 'nik' })]),
        //     agama: schema.string(),
        //     pekerjaan: schema.string(),
        //     telpon: schema.string(),
        //     alamat: schema.string(),
        //     kk: schema.file()
        // })

        // const data = await request.validate({ schema: pemohonSchema })

        const kk = request.file('kk', {
            size: '2mb'
        })

        const name = kk?.clientName
        const ext = name?.split('.')[1]
        const ts = new Date().valueOf()
        const fileName = ts + '.' + ext

        const data = {
            'nik' : request.input('nik'),
            'tempat_lahir' : request.input('tempat_lahir'),
            'tanggal_lahir' : request.input('tanggal_lahir'),
            'jenis_kelamin' : request.input('jenis_kelamin'),
            'kewarganegaraan' : request.input('kewarganegaraan'),
            'agama' : request.input('agama'),
            'pekerjaan' : request.input('pekerjaan'),
            'telpon' : request.input('telpon'),
            'alamat' : request.input('alamat'),
            'nama' : request.input('nama'),
            'kk' : fileName,
        }

        fs.mkdirSync(Application.publicPath('/uploads'), {recursive: true})
        await kk?.moveToDisk(Application.publicPath('/uploads'), {name: fileName})
        if(kk?.state == 'moved'){
            console.log('upload berhasil')
        }else{
            
            console.log(kk?.errors)
        }
        try {

            await Pemohon.create(data)
            return response.created()
        } catch (error) {
            return response.badRequest(error)
        }
    }

    public async show({ params }: HttpContextContract) {
        const data = await Pemohon.find(params.id)
        const url = Application.publicPath('uploads/'+data?.kk)
        // const fileUrl = Drive.get(url)

        return url

        const pemohon = {
            'nik' : data?.nik,
            'nama' : data?.nama,
            'jenis_kelamin' : data?.jenis_kelamin,
            'tempat_lahir' : data?.tempat_lahir,
            'tanggal_lahir' : data?.tanggal_lahir,
            'kewarganegaraan' : data?.kewarganegaraan,
            'agama' : data?.agama,
            'alamat' : data?.alamat,
            'telpon' : data?.telpon,
            'pekerjaan' : data?.pekerjaan,
            'kk' : data?.kk,
            'kk_link' : kk_link,
            
        }
        return pemohon
    }
}

