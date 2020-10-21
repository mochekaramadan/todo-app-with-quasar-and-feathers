<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input 
        v-model="newTodo" 
        @keyup.enter="addTask()"
        class="col"
        square 
        filled 
        placeholder="Add Task" 
        dense 
        bg-color="white">
        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-input>
    </div>
    <q-list class="bg-white" separator bordered>
      <q-item v-ripple 
              v-for="(todo, index) in todos" 
              v-bind:key="todo._id"
              @click="todo.done = !todo.done; updateStatus(todo._id)"
              clickable
              :class="{ 'done bg-blue-1' : todo.done }">
        <q-item-section avatar>
          <q-checkbox 
            v-model="todo.done"
            class="no-pointer-events"
            color="primary" />
        </q-item-section>
        <q-item-section >
          <q-item-label>{{ todo.text }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            @click.stop="medium = true, detailTodo(todo)"
            flat 
            round 
            dense 
            color="primary" 
            icon="list_alt">
            <q-tooltip>
              Detail Task
            </q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section v-if="todo.done" side>
          <q-btn
            @click.stop="deleteTodo(todo._id, index)"
            flat 
            round 
            dense 
            color="primary" 
            icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <div
      v-if="todos.length == 0"
      class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary">No Task</div>
    </div>

    <!-- MODAL DETAIL -->
    <q-dialog
      v-model="medium"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Detail Task</div>
        </q-card-section>
        <q-card-section class="q-pt-none" flat bordered>
          <q-markup-table :separator="separator">
            <tbody>
              <tr>
                <th class="text-left">Task</th>
                <td class="text-right">{{ details.text }}</td>
              </tr>
              <tr>
                <th class="text-left">Status</th>
                <td class="text-right">
                  <span v-if="details.done">Done</span>
                  <span v-else>On Progress</span>
                </td>
              </tr>
              <tr>
                <th class="text-left">Created At</th>
                <td class="text-right">{{ dateformat(details.createdAt) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import axios from 'axios'
import { LocalStorage } from 'quasar'
import _ from 'lodash'
import moment from "moment";

const urlApi = 'http://localhost:3030/todo'
const accessToken = LocalStorage.getItem('accessToken')
const headers = {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
}

export default {
  data (){
    return{
      newTodo: '',
      todos: [],
      medium: false,
      separator: 'cell',
      details: ''
    }
  },
  methods: {
    deleteTodo(id, index){
      this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to delete this?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        axios
          .delete(urlApi+'/'+id, headers)
          .then((res) => {
            this.todos.splice(index, 1);
            this.$q.notify({
              message: 'Deleted',
              color: 'red'
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    addTask(){
      const data = {
        text: this.newTodo,
        done: false
      }
      axios
       .post(urlApi, data, headers)
       .then((res) => {
          this.todos.push({
            _id: res.data._id,
            text: this.newTodo,
            done: false
          })

          this.newTodo = '';
       })
       .catch((err) => {
         console.log(accessToken)
         this.$q.notify({
           message: err.response.data.message,
           color: 'red'
         })
       })
    },
    updateStatus(id){

      this.todos.done = !this.todos.done

      let data = {
        done: false
      }

      if (this.todos.done) {
        data = {
          done: true
        }
      }

      axios
       .patch(urlApi+'/'+id, data, headers)
       .then((res) => {
         console.log(res)
       })
       .catch((err) => {
         console.log(err)
       })
    },
    detailTodo (todo) {
      this.details = todo
    },
    dateformat (date) {
      return moment(date).format('DD MMMM YYYY');
    },
    test()
    {
      const words = 'lorem ipsum dolor sit amet'
      var users = [
        { 'user': 'barney', 'age': 36, 'active': true },
        { 'user': 'fred',   'age': 40, 'active': false }
      ];

      console.log(_.map(['6', '8', '10'], _.ary(parseInt, 1)));
    }

  },
  mounted (){
    axios
      .get(urlApi, headers)
      .then((res) => {
        console.log(res)
        this.todos = res.data
      })
      .catch((err) => {
        console.log(accessToken)
        this.$q.notify({
          message: err.response.data.message,
          color: 'red'
        })
      })

  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #e0e0e0; 
    }
  }

  .no-tasks{
    opacity: 0.5;
  }
</style>
