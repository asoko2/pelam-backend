import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Sku extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pemohonId: number

  @column()
  public nama_usaha: string

  @column()
  public jenis_usaha: string

  @column()
  public alamat_usaha: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
