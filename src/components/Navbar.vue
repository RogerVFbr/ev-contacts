<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
        <a class="navbar-brand" href="#">
            <img src="../assets/ev-logo-round.png" class="navbar-logo" height="50" width="70"/>
            EV Contacts
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">People</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/log">Log</router-link>
                </li>
            </ul>
            <div class="my-2 my-lg-0">
                <span v-if="isLogged" class="username">{{userEmail}}</span>
                <button v-if="!isLogged" class="btn btn-success my-2 my-sm-0" type="submit" @click="$router.push('login')">Login/Register</button>
                <button v-if="isLogged" class="btn btn-secondary my-2 my-sm-0" type="submit" @click="logout">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script>

    import { auth } from '../sensitivedata/firebase';

    export default {
        name: "navbar",

        created() {
            if (auth.currentUser) {
                this.isLogged = true;
                this.userEmail = auth.currentUser.email;
            }
        },
        data() {
            return {
                isLogged: false,
                userEmail: ''
            }
        },
        methods: {
            logout: function () {
                auth.signOut().then(() => {
                    this.$router.go({path: this.$router.path});
                })
            }
        }
    }
</script>

<style scoped>
    .navbar-custom {
        background: rgba(99, 202, 193, 1) !important;
        text-color: white !important;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, .25)
    }
    .username {
        margin-right: 10px;
    }
</style>