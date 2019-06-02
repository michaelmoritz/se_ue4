<template>
    <div class="registration">

        <h1 class="black--text">Registration</h1>

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

                <v-btn @click="Registration">Registration</v-btn>

            </form>
        </v-card>

    </div>
</template>

<script>
    export default {
        name: "registration",
        data() {
            return {
                user: {
                    username: '',
                    password: '',
                },
                resRegistration: ''
            }
        },
        methods: {
            async Registration() {
                try {
                    const response = await fetch('http://localhost:3000/user', {
                        method: 'POST',
                        body: JSON.stringify(this.user),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    })
                    const data = await response.json()
                    this.$router.replace('/dashboard')
                    this.resRegistration = data
                } catch (error) {
                    //console.error(error)
                }
            },
        }
    }
</script>

<style scoped>

</style>