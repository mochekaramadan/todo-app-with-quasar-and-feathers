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
      v-if="!todos.length"
      class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary">No Tasks</div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { LocalStorage } from 'quasar'

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
      todos: []
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

      console.log(data)

      axios
       .patch(urlApi+'/'+id, data, headers)
       .then((res) => {
         console.log(res)
       })
       .catch((err) => {
         console.log(err)
       })
    }

  },
  mounted (){
    axios
      .get(urlApi, headers)
      .then((res) => {
        this.todos = res.data.data
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
