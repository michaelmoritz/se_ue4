<template>
  <div class="login">

    <h1 class="black--text">Login</h1>

    <v-card flat class="pa-3">
      <form>

        <v-text-field
                v-model="user.username"
                label="Username"
                required
        ></v-text-field>
        <v-text-field
                v-model="user.password"
                label="Password"
                required
                type="password"
        ></v-text-field>

        <v-btn @click="Login">Login</v-btn>

      </form>
    </v-card>

  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
      }
    },
    methods: {
      async Login() {
        try {
          const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            body: JSON.stringify(this.user),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
          })
          const data = await response.json()
          localStorage.setItem('sessionkey', data.token.toString())
          this.$router.replace('/dashboard')
        } catch (error) {
          //console.error(error)
        }
      },
    },
  }
</script>

<style scoped>
  form {
    margin-bottom: 2rem;
  }

  [class*='-message'] {
    font-weight: 500;
  }
</style>