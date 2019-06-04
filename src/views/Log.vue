<template>
    <div class="about container log-container">
        <table class="table contacts-div-layout">
            <thead>
            <tr>
                <th scope="col">Time</th>
                <th scope="col">User</th>
                <th scope="col">Type</th>
                <th scope="col">Message</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="logData.length == 0">
                <td colspan="4">No logs yet. Add, update or delete to generate logs.</td>
            </tr>
            <tr v-for="log in logData">
                <th>{{ log.time }}</th>
                <td>{{ log.name }}</td>
                <td>{{ log.type}}</td>
                <td>{{ log.message }}</td>
            </tr>
            </tbody>
        </table>
        <button id="clearLogBtn" class="btn btn-info" @click="clear" v-if="logData.length != 0">Clear log</button>
    </div>
</template>

<script>

    import { Logger } from '../logger/Logger'

    export default {
        name: "log",

        created() {
            this.log = new Logger('', '');
            this.logData = this.log.getLog();
        },
        data() {
            return {
                logData: [],
                log: ''
            }
        },
        methods: {
            clear: function () {
                this.log.clearLog();
                this.logData = this.log.getLog();
            }
        }
    }

</script>


<style scoped>

  .log-container {
    margin-top: 50px;
    padding-bottom: 50px;
  }

  .contacts-div-layout {
    border: 1px solid rgba(0,0,0,.3);
    border-radius: 5px;
    background: rgba(250,250,250,0.8);
    box-shadow: 5px 5px 30px rgba(0, 0, 0, .4)
  }

  #clearLogBtn {
    margin-top: 20px;
  }

</style>
