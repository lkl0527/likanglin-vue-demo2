import axios from '../../components/interceptor'

export default {
  createOrga: async (orga) => {
    let rest = await axios.post('/api/orgas/', orga)
    return rest.data
  },
  deleteOrga: async (id) => {
    let resp = await axios.delete(`/api/orgas/${id}`)
    return resp.data
  },
  updateOrga: async (orga) => {
    let rest = await axios.put('/api/orgas/'+orga.orgaId, orga)
    return rest.data
  },
  queryOrgas: async () => {
    let rest = await axios.get(`/api/orgas/`)
    return rest.data
  },
  nestedOrga: async () => {
    let rest = await axios.get(`/api/orgas/actions/nested`)
    return rest.data
  }
}
