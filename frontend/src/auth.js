import axios from 'axios'
import { LocalStorage, Notify } from 'quasar'

const urlApiUser = 'http://localhost:3030/users'
const accessToken = LocalStorage.getItem('accessToken')
const headers = {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}

export default {
    user: {
        authentication: false
    },
    getAuthUser () {
        const accessToken = LocalStorage.getItem('access_token')
        
        axios.get('http://localhost:3030/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
          .then((response) => {
            LocalStorage.set('user', response.data)
            Notify.create({
              message: 'success login',
              color: 'green'
            })
          }).catch((err) => {
            Notify.create({
              message: err,
              color: 'red'
            })
          })
    }

}