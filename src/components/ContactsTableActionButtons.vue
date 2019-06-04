<template>
    <div class="btn-group ev-button-group">
        <button type="button"class="btn btn-info btn-sm action-button" @click="openMap"
                :disabled="item.latitude == '' || item.longitude == '' || clientLat == '' || clientLon == ''">
            <font-awesome-icon icon="info" />
        </button>
        <button type="button" class="btn btn-warning btn-sm action-button"
                @click="$router.push({name: 'update', params: {item:item, itemkey: itemKey}})"
                :disabled="!isLogged">
            <font-awesome-icon icon="edit" />
        </button>
        <button type="button" class="btn btn-danger btn-sm action-button ev-delete-button" data-toggle="modal"
                :data-target="'#deleteConfirm' + itemKey"
                :disabled="!isLogged">
            <font-awesome-icon icon="trash" />
        </button>

        <div :id="'deleteConfirm' + itemKey" class="modal fade slide-up bd-example-modal-sm" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm delete</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you wish to delete {{item.name}}?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" v-on:click="deleteContact" data-dismiss="modal">
                            Delete</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { db, auth } from '../sensitivedata/firebase'
    import { Logger } from '../logger/Logger'

    export default {
        name: "contacts-table-action-buttons",
        props: {
            item: {
                type: Object,
            },
            itemKey: {},
            callback: {},
            clientLat: {},
            clientLon: {},
        },
        created() {
            if (auth.currentUser) {
                this.isLogged = true;
                this.log = new Logger(auth.currentUser.email, "DELETE");
            }
        },
        data() {
            return {
                isLogged: false,
                log: ''
            }
        },
        methods: {
            deleteContact: function () {
                db.ref('contacts').child(this.itemKey).remove(error => {
                    this.log.log("Name: " + this.item.name + " | City: " + this.item.city);
                    this.callback();
                });
            },
            openMap: function () {
                var address = this.item.address.split("-");
                var streetAndNumber = address[0].split(",")[0].trim() + ", " + address[0].split(",")[1].trim()
                var neighbourhood = address[1].trim();
                var finalAddress = (streetAndNumber + ",+" + neighbourhood + ",+" + this.item.city).split(" ").join("+");
                let url = 'https://www.google.com/maps/dir/?api=1&origin=' + this.clientLat + "," + this.clientLon
                    + "&destination=" + finalAddress;
                window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes');
            }
        }
    }
</script>

<style scoped>

    .action-button {
        width: 32px;
        color: white;
    }

    .ev-button-group {
        box-shadow: 2px 2px 3px rgba(0, 0, 0, .1);
        border-radius: 3px !important;
    }

    .ev-delete-button {
        border-radius: 0px 3px 3px 0px !important;
    }

</style>