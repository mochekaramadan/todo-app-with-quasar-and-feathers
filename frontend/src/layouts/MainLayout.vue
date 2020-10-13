<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h3">TODO</div>
        <div class="text-subtitle1">{{ todaysDate }}</div>
      </div>
      <q-img
        src="../../public/mountains.jpg"
        class="header-image absolute-top"
      />
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="300"
        :breakpoint="600"
      >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item 
            to="/"
            exact
            clickable 
            v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>

            <q-item-section>
              Todo
            </q-item-section>
          </q-item>

          <q-item
            to="/help"
            exact 
            clickable 
            v-ripple>
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>
              Help
            </q-item-section>
          </q-item>

          <q-item
            to="/help"
            exact 
            clickable
            @click="logout()" 
            v-ripple>
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="../../public/mountains.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{ users.username }}</div>
          <div>{{ users.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
  import { LocalStorage, Notify, date } from 'quasar'
  import auth from '../auth'
  import axios from 'axios'

  const urlApi = 'http://localhost:3030/users'
  const userId = LocalStorage.getItem('userId')
  const accessToken = LocalStorage.getItem('accessToken')
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }

  export default {
    name: 'MainLayout',
    data () {
      return {
        leftDrawerOpen: false,
        users: []
      }
    },
    methods: {
      logout() {
        LocalStorage.clear()
        auth.user.authenticated = false

        Notify.create({
          message: 'You\'ve been logged out successfully.',
          color: 'green'
        })

        setTimeout(() => this.$router.push({ name: 'login' }), 700)
      }
    },
    computed: {
      todaysDate(){
        let timeStamp = Date.now()
        return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
      }
    },
    mounted () {
      axios
       .get(urlApi+'/'+userId, headers)
       .then((res) => {
         this.users = res.data
       })
       .catch((err) => {
         console.log(err)
       })
    }
  }
</script>

<style lang="scss">
  .header-image{
    height: 100%;
    z-index: -1;
    opacity: 0.2;
    filter: grayscale(100%);
  }
</style>
