import axios from '../../components/interceptor'

export default {
  createUser: async (userform) => {
    let rest = await axios.post('/api/users', userform)
    return rest.data
  },
  deleteUser: async (id) => {
    let resp = await axios.delete(`/api/users/${id}`)
    return resp.data
  },
  logout: async () => {
    let rest = await axios.delete(`/api/users/actions/logout`)
    return rest.data
  },
  modifyUser: async (user) => {
    let rest = await axios.put(`/api/users/` + user.userId, user)
    return rest.data
  },
  updatePassword: async (user) => {
    let rest = await axios.put(`/api/users/actions/modify-password`, user)
    return rest.data
  },
  login: async (param) => {
    let rest = await axios.post(`/api/users/actions/login`, param)
    return rest.data
  },
  queryUsers: async (param) => {
    let rest = await axios.get(`/api/users` + param)
    return rest.data
  }
}
