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
        axios.get(urlApiUser, headers)
          .then((response) => {
            LocalStorage.set('user', response.data)
            Notify.create({
              message: 'success login',
              color: 'green'
            })
          }).catch((err) => {
            Notify.create({
              message: err.response.data.message,
              color: 'red'
            })
          })
    }

}