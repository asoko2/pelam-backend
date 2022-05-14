import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Sktm from 'App/Models/Sktm'
import Sku from './Sku'
import Skck from './Skck'
import Domisili from './Domisili'
import KehilanganKk from './KehilanganKk'
import SuratKetarangan from './SuratKetarangan'

export default class Pemohon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public tempat_lahir: string

  @column.date({
    serialize: (value) => value.toFormat('dd LLL yyyy')
  })
  public tanggal_lahir: DateTime

  @column()
  public jenis_kelamin: string

  @column()
  public kewarganegaraan: string

  @column()
  public nik: string

  @column()
  public agama: string

  @column()
  public pekerjaan: string

  @column()
  public telpon: string

  @column()
  public alamat: string

  @column()
  public kk: string

  @column.date({ autoCreate: true })
  public createdAt: DateTime

  @column.date({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Sktm)
  public sktm: HasMany<typeof Sktm>

  @hasMany(() => Sku)
  public sku: HasMany<typeof Sku>

  @hasMany(() => Skck)
  public skck: HasMany<typeof Skck>

  @hasMany(() => Domisili)
  public domisili: HasMany<typeof Domisili>

  @hasMany(() => KehilanganKk)
  public kehilangan_kk: HasMany<typeof KehilanganKk>

  @hasMany(() => SuratKetarangan)
  public surat_keterangan: HasMany<typeof SuratKetarangan>
}
