<template>
  <div class="userview">
    <v-app class="grey lighten-4">
      <v-content class="mx-4 mb-4">
        <Navbar/>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>

  import Navbar from "./components/Navbar";
  export default {
    name: 'userview',
    components: {
      Navbar

    },
    data() {
      return {
        events: [],
        authorization: localStorage.sessionkey,
        resAddEvent: '',
      }
    },
    methods: {
      async deleteEvent(id) {
        try {
          await fetch(`http://localhost:3000/events/${id}`, {
            method: "DELETE",
            headers: { 'Content-type': 'application/json; charset=UTF-8', 'Authorization': localStorage.sessionkey },
          });
          this.events = this.events.filter(event => event.id !== id);
        } catch (error) {
          //console.error(error);
        }
      },
      async editEvent(id, updatedEvent) {
        try {
          const response = await fetch(`http://localhost:3000/events/${id}`, {
            method: 'POST',
            body: JSON.stringify(updatedEvent),
            headers: { 'Content-type': 'application/json; charset=UTF-8', 'Authorization': localStorage.sessionkey },
          })
          const data = await response.json()
          this.events = this.events.map(event => (event.id === id ? data : event))
        } catch (error) {
          //console.warn(error)
        }
      },
    }
  }
</script>
