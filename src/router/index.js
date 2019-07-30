import Login from '@/Login'
import Index from '@/Index'
import User from '@/views/user/User'
import Orga from '@/views/org/Orga'

let routes = [
  {
    path: '/index',
    name: 'Index',
    component: Index
  }, {
    path: '/',
    name: 'Login',
    component: Login
  }, {
    path: '/user',
    name: 'User',
    component: User
  }, {
    path: '/orga',
    name: 'Orga',
    component: Orga
  }
]
export default routes
