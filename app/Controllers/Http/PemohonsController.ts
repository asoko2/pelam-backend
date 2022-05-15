import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import fs from 'fs'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import Pemohon from "App/Models/Pemohon";
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon';

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
        
        const userSchema = schema.create({
            nik: schema.string({},[rules.unique({table: 'pemohons', column: 'nik'})]),
            tempat_lahir: schema.string(),
            tanggal_lahir: schema.date(),
            jenis_kelamin: schema.string(),
            kewarganegaraan: schema.string(),
            agama: schema.string(),
            pekerjaan: schema.string(),
            telpon: schema.string(),
            nama: schema.string(),
            alamat: schema.string(),
            kk: schema.file({size: '2mb'})
        })

        const dataValidated = await request.validate({schema: userSchema, messages:{
            'nik.unique' : 'NIK sudah terdaftar',
            'kk.file.size' : 'File KK lebih dari 2Mb',
        }})

        const kk = request.file('kk')

        const name = kk?.clientName
        const ext = name?.split('.')[1]
        const ts = new Date().valueOf()
        const fileName = ts + '.' + ext


        const data = {
            'nik' : dataValidated.nik,
            'tempat_lahir' : dataValidated.tempat_lahir,
            'tanggal_lahir' : dataValidated.tanggal_lahir,
            'jenis_kelamin' : dataValidated.jenis_kelamin,
            'kewarganegaraan' : dataValidated.kewarganegaraan,
            'agama' : dataValidated.agama,
            'pekerjaan' : dataValidated.pekerjaan,
            'telpon' : dataValidated.telpon,
            'alamat' : dataValidated.alamat,
            'nama' : dataValidated.nama,
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
            console.log('input berhasil')
            return response.created()
        } catch (error) {
            console.log('input gagal')
            console.log(error)
            return response.badRequest(error)
        }
    }

    public async show({ params }: HttpContextContract) {
        console.log(params)
        const data = await Pemohon.findBy('nik', params.nik)
        const fileUrl = await Drive.getUrl(''+data?.kk)
        const url = Env.get('APP_URL') + fileUrl

        const date = new Date(data!.tanggal_lahir.toString())

        const tanggal = DateTime.fromJSDate(date).toFormat('yyyy-LL-dd')

        const pemohon = {
            'nik' : data?.nik,
            'nama' : data?.nama,
            'jenis_kelamin' : data?.jenis_kelamin,
            'tempat_lahir' : data?.tempat_lahir,
            'tanggal_lahir' : tanggal,
            'kewarganegaraan' : data?.kewarganegaraan,
            'agama' : data?.agama,
            'alamat' : data?.alamat,
            'telpon' : data?.telpon,
            'pekerjaan' : data?.pekerjaan,
            'kk' : data?.kk,
            'kk_link' : url,
            
        }
        return pemohon
    }

    public async update({params, request, response}:HttpContextContract){

        const pemohon = await Pemohon.findByOrFail('nik', params.nik)
        const userSchema = schema.create({
            nama: schema.string(),
            jenis_kelamin: schema.string(),
            tempat_lahir: schema.string(),
            tanggal_lahir: schema.date(),
            agama: schema.string(),
            kewarganegaraan: schema.string(),
            alamat: schema.string(),
            telpon: schema.string(),
            pekerjaan: schema.string(),
        })

        const data = await request.validate({schema: userSchema, })
        try {
            pemohon.nama = data.nama
            pemohon.jenis_kelamin = data.jenis_kelamin
            pemohon.tempat_lahir = data.tempat_lahir
            pemohon.tanggal_lahir = data.tanggal_lahir
            pemohon.agama = data.agama
            pemohon.kewarganegaraan = data.kewarganegaraan
            pemohon.alamat = data.alamat
            pemohon.telpon = data.telpon
            pemohon.pekerjaan = data.pekerjaan
            
            await pemohon.save()
            return response.status(200)
        } catch (error) {
            return response.badRequest(error)
        }
    }
}

