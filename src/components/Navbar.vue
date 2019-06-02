<template>
    <nav>

        <v-toolbar class="primary lighten-1" dark flat app>
            <v-toolbar-side-icon class="black--text" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>
                <span class="black--text front-weight-light">Veranstaltungen</span>
                <span>JKU</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat color="black" @click="Logout">
                <span>Sign out</span>
                <v-icon right>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>

        <v-navigation-drawer v-model="drawer" app class="primary lighten-1">
            <v-list>
                <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-tile-content>
                        <v-list-tile-title class="black--text">{{ link.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

    </nav>
</template>

<script>
    export default {
        name: "Navbar",
        data() {
            return {
                drawer: false,
                links: [
                    { icon: 'login', text: 'Login', route: '/login'},
                    { icon: 'registration', text: 'Registration', route: '/registration'},
                    { icon: 'dashboard', text: 'Dashboard', route: '/dashboard'},
                    { icon: 'events', text: 'New Event', route: '/events'},
                ]
            }
        },
        methods: {
            Logout(){
                localStorage.setItem('sessionkey', '')
                this.$router.replace('/login')
            }
        }
    }
</script>

<style scoped>

</style>