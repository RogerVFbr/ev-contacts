<template>
    <div class="container contacts-container">
        <contacts-table :key="$route.fullPath" />
        <floating-action-button :show="isLogged"
                                :onclick="navigateToAdd"/>

    </div>
</template>

<script>
    import ContactsTable from '@/components/ContactsTable.vue'
    import FloatingActionButton from '@/components/FloatingActionButton.vue'
    import { auth } from '../sensitivedata/firebase';

    export default {
        name: 'home',
        data () {
          return {
              isLogged: (auth.currentUser) ? true : false
          }
        },
        components: {
            ContactsTable,
            FloatingActionButton
        },
        methods: {
            navigateToAdd: function () {
                this.$router.push('add');
            }
        }

    }
</script>

<style>
    .contacts-container {
        margin-top: 40px;
        padding-bottom: 30px;
    }
</style>
