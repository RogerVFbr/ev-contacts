<template>
    <div class="responsive-table">
        <table class="table contacts-div-layout hideTable">
            <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Distance</th>
                <th scope="col">Weather</th>
                <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!dataFetched">
                <td colspan="7">
                    <font-awesome-icon icon="spinner" spin /><span class="contacts-table-loading-data">Loading data...</span>
                </td>
            </tr>
            <tr v-for="(item, itemKey) in contacts">
                <th scope="row">{{ item.name }}</th>
                <td>{{item.address}}</td>
                <td>{{item.city}}</td>
                <td>{{item.state}}</td>
                <td v-if="browserLatitude == 'na' || item.latitude ==''"><em>N.A.</em></td>
                <td v-else-if="browserLatitude == ''"><font-awesome-icon icon="spinner" spin /></td>
                <td v-else>{{ getHaversine(item.latitude, item.longitude)}}</td>
                <td v-if="item.city == ''"><em>N.A.</em></td>
                <td v-else-if="item.weather">
                    <img :src="item.weather" height="35" width="35" class="contacts-table-weather-icon"/>
                </td>
                <td v-else><font-awesome-icon icon="spinner" spin /></td>
                <td>
                    <contacts-table-action-buttons :item=item
                                                   :itemKey=itemKey
                                                   :callback="updateTableContent"
                                                   :clientLat=browserLatitude
                                                   :clientLon=browserLongitude
                                                   :key="$route.fullPath">

                    </contacts-table-action-buttons>
                </td>
            </tr>
            </tbody>
        </table>

        <div class="evcards-container showCards">
            <div class="card evcard"  v-for="(item, itemKey) in contacts">
                <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <small class="form-text text-muted">Address</small>
                    <p class="card-text">{{item.address}} - {{item.city}} - {{item.state}}</p>
                    <small class="form-text text-muted">Distance</small>
                    <p class="card-text" v-if="browserLatitude == 'na' || item.latitude ==''"><em>N.A.</em></p>
                    <p class="card-text" v-else-if="browserLatitude == ''"><font-awesome-icon icon="spinner" spin /></p>
                    <p class="card-text" v-else>{{ getHaversine(item.latitude, item.longitude)}}</p>
                    <small class="form-text text-muted">Weather</small>
                    <p class="card-text" v-if="item.city == ''"><em>N.A.</em></p>
                    <p class="card-text" v-else-if="item.weather">
                        <img :src="item.weather" height="35" width="35" class="contacts-table-weather-icon"/>
                    </p>
                    <p class="card-text" v-else><font-awesome-icon icon="spinner" spin /></p>
                    <small class="form-text text-muted actions-title-responsive">Actions</small>
                    <contacts-table-action-buttons :item=item
                                                   :itemKey=itemKey
                                                   :callback="updateTableContent"
                                                   :clientLat=browserLatitude
                                                   :clientLon=browserLongitude
                                                   :key="$route.fullPath">

                    </contacts-table-action-buttons>
                </div>
            </div>

        </div>
    </div>

</template>

<script>

    import { db } from '../sensitivedata/firebase'
    import { apixuKey } from "../sensitivedata/apixu";
    import ContactsTableActionButtons from '@/components/ContactsTableActionButtons.vue'

    export default {
        name: "contacts-table",
        components: {
            ContactsTableActionButtons
        },
        data() {
            return {
                contacts: {},
                dataFetched: false,
                browserLatitude: '',
                browserLongitude: ''
            }

        },
        created() {
            this.getBrowserPosition();
            this.updateTableContent()

        },
        methods: {
            updateTableContent: function () {
                db.ref('contacts').once('value', snapshot => {
                    this.contacts = snapshot.val();
                    this.dataFetched = true;
                    let i;
                    for (var key in this.contacts) {
                        this.getWeatherIcon(key);
                    }
                })
            },
            getBrowserPosition: function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.saveBrowserPosition);

                } else {
                    console.log("Geolocation is not supported by this browser.");
                    this.browserLatitude = 'na';
                    this.browserLongitude = 'na';
                }
            },
            saveBrowserPosition: function(position) {
                this.browserLatitude = position.coords.latitude;
                this.browserLongitude = position.coords.longitude;
            },
            getWeatherIcon: function(i) {
                let currentCity = this.contacts[i].city
                    .split('ã').join('a')
                    .split('á').join('a')
                    .split('â').join('a')
                    .split('é').join('e')
                    .split('ê').join('e')
                    .split('í').join('i')
                    .split('õ').join('o')
                    .split('ó').join('o')
                    .split('ô').join('o')
                    .split('ú').join('u')
                    .split('ç').join('c');
                let url = 'https://api.apixu.com/v1/current.json?key=' + apixuKey + '&q='
                    + (currentCity.split(' ').join('+'));
                fetch(url)
                    .then(response => response.json() )
                    .then(data => {
                        this.contacts[i].weather = 'http:' + data.current.condition.icon;
                    })
                    .catch(err => {
                        console.error('Failed retrieving weather at ' + currentCity + ' : ' + err);
                    })
            },
            getHaversine: function (lat1, lon1) {
                if (this.browserLatitude =="" || this.browserLongitude =="") return '';
                let lat2 = this.browserLatitude;
                let lon2 = this.browserLongitude;
                var R = 6371; // Radius of the earth in km
                var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
                var dLon = this.deg2rad(lon2-lon1);
                var a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2)
                ;
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c; // Distance in km
                return d.toFixed(2) + 'km';
                // return 'test';
            },
            deg2rad: function (deg) {
                return deg * (Math.PI/180)
            },
        },
    }

</script>

<style scoped>

    .contacts-table-loading-data {
        margin-left: 10px;
    }

    .contacts-table-weather-icon {
        margin-bottom: -10px;
    }

    .contacts-div-layout {
        border: 1px solid rgba(0,0,0,.3);
        border-radius: 5px;
        background: rgba(250,250,250,0.8);
        box-shadow: 5px 5px 30px rgba(0, 0, 0, .4);

    }

    .evcards-container {
        display:none;
    }

    .evcard {
        width: 15rem;
        display: inline-block;
        margin: 5px;
        border: 1px solid rgba(0,0,0,.3);
        border-radius: 5px;
        background: rgba(250,250,250,0.8);
        box-shadow: 5px 5px 20px rgba(0, 0, 0, .2);
    }

    .actions-title-responsive {
        margin-top: 30px;
    }

    @media only screen and (max-width: 768px) {
        .hideTable {
            display: none;
        }
        .showCards {
            display: block !important;
        }
    }


</style>