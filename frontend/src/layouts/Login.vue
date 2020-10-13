<template>
  <q-layout>
      <q-page-container>
        <q-page
            class="window-width row justify-center items-center bg-blue-5"
        >
            <div class="column q-pa-lg">
                <div class="row">
                    <q-card square class="shadow-24" style="width:300px;height:485px;">
                        <q-card-section class="bg-blue-8">
                            <h4 class="text-h5 text-white q-my-md">Login</h4>
                            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
                            </div>
                        </q-card-section>
                        <q-card-section>
                            <q-form class="q-px-sm q-pt-xl">
                            <q-input square clearable v-model="credentials.email" type="email" label="Email">
                                <template v-slot:prepend>
                                <q-icon name="email" />
                                </template>
                            </q-input>
                            <q-input square clearable v-model="credentials.password" type="password" label="Password">
                                <template v-slot:prepend>
                                <q-icon name="lock" />
                                </template>
                            </q-input>
                            </q-form>
                        </q-card-section>
                        <q-card-actions>
                            <q-btn unelevated size="lg" color="blue-6" @click="submitLogin()" class="full-width text-white" label="Sign In" />
                        </q-card-actions>
                    </q-card>
                </div>
            </div>
        </q-page>
      </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
import { LocalStorage, Notify } from 'quasar'
import auth from '../auth'

const urlApiLogin = 'http://localhost:3030/authentication'


export default {
    name: 'Login',
    data (){
      return {
        credentials:
         {
            strategy: 'local',
            email: '',
            password: ''  
         }
      }
    },
    methods:{
      submitLogin () {
          console.log(this.credentials)
          axios
            .post(urlApiLogin, this.credentials)
            .then((res) => {
              LocalStorage.set('accessToken', res.data.accessToken)
              LocalStorage.set('userId', res.data.user._id)

              auth.user.authentication = true

              auth.getAuthUser()

              this.$router.push('/')
            })
            .catch((err) => {
              Notify.create({
                message: err.response.data.message,
                color: 'red'
              })
            })
      }
    }
}
</script>