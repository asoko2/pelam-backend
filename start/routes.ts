/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import CheckRole from 'App/Middleware/CheckRole'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/auth/register', 'UsersController.register')
Route.post('/auth/login', 'UsersController.login')
Route.post('/auth/logout', 'UsersController.logout')
Route.get('/auth/user', 'UsersController.me')

Route.get('/check', async () => {
  return 'berhasil'
}).middleware(['auth', 'checkRole'])

Route.group(() => {
  Route.resource('pemohon', 'PemohonsController').except(['update', 'show', 'destroy']).apiOnly()
  Route.get('/pemohon/all', 'PemohonsController.getAll')
  Route.get('/pemohon/:nik', 'PemohonsController.show')
  Route.put('/pemohon/:nik', 'PemohonsController.update')
  Route.delete('/pemohon/:nik', 'PemohonsController.destroy')
  Route.resource('sktm', 'SktmsController').apiOnly()
  Route.get('/sktm/all', 'SktmsController.getAll')
  Route.resource('domisili', 'DomisilisController').apiOnly()
  Route.get('/domisili/all', 'DomisilisController.getAll')
  Route.resource('sku', 'SkusController').apiOnly()
  Route.resource('skck', 'SkcksController').apiOnly()
  Route.resource('surat-keterangan', 'SuratKeterangansController').apiOnly()
  Route.resource('kehilangan-kk', 'KehilanganKksController').apiOnly()
}).middleware('auth')

Route.get('/testApi', 'TestsController.testGet')
Route.post('/testPost', 'TestsController.testPost')
