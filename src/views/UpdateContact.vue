<template>
    <div class="update-contacts-container">

        <div id="updateDiv" class="center_div update-contacts-div-layout">
            <div class="formColumns floatleft" v-if="!showUpdatingMessage">
                <form>
                    <div class="form-group">
                        <label for="formName">Name</label>
                        <input v-model="name" type="text" class="form-control" id="formName"
                               aria-describedby="formName" placeholder="Enter name" @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formCEP">CEP</label>
                        <input v-model="valorCep" type="text" class="form-control" id="formCEP"
                               aria-describedby="formCEP" placeholder="Enter CEP" @input="onUpdateCEP">
                    </div>
                    <div class="form-group">
                        <label for="formRua">Street</label>
                        <input v-model="street" type="text" class="form-control" id="formRua"
                               aria-describedby="formRua" placeholder="Enter street name">
                    </div>
                    <div class="form-group">
                        <label for="formNumber">Building number</label>
                        <input v-model="number" type="number" class="form-control" id="formNumber"
                               aria-describedby="formNumber" placeholder="Enter building number">
                    </div>
                </form>

            </div>

            <div class="formColumns floatright" v-if="!showUpdatingMessage">

                <form>
                    <div class="form-group">
                        <label for="formExtra">Extras</label>
                        <input v-model="extra" type="text" class="form-control" id="formExtra"
                               aria-describedby="formExtra" placeholder="Enter extras" @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formNeighbourhood">Neighbourhood</label>
                        <input v-model="neighbourhood" type="text" class="form-control" id="formNeighbourhood"
                               aria-describedby="formExtra" placeholder="Enter neighbourhood"
                               @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formCity">City</label>
                        <input v-model="city" type="text" class="form-control" id="formCity"
                               aria-describedby="formCity" placeholder="Enter city" @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formState">State</label>
                        <input v-model="state" type="text" class="form-control" id="formState"
                               aria-describedby="formState" placeholder="Enter state"
                               @input="allFieldsFilled">
                    </div>

                </form>
            </div>
            <div class="clearboth"></div>
            <div id="databaseerror" class="alert alert-danger fillDivWidth" role="alert"
                 v-if="showDatabaseError">
                Error. Please try again.
            </div>
            <button id="updateContactButton" type="submit" class="btn btn-warning fillDivWidth"
                    :disabled="!allFieldsGood" v-on:click="getGeocodingData"
                    v-if="!showUpdatingMessage">Save changes</button>
            <div id="updating-message" class="alert alert-primary fillDivWidth" role="alert"
                 v-if="showUpdatingMessage">
                <font-awesome-icon icon="spinner" spin />  Saving changes ...
            </div>

        </div>

    </div>
</template>

<script>

    import { geocodingKey } from "../sensitivedata/locationiq-geocoding";
    import { db, auth } from '../sensitivedata/firebase'
    import { Logger } from '../logger/Logger'

    export default {
        name: "update-contact",
        data() {
            return {
                allFieldsGood: true,
                showUpdatingMessage: false,
                showDatabaseError: false,
                name: '',
                valorCep: '',
                street: '',
                number: '',
                extra: '',
                neighbourhood: '',
                city: '',
                state: '',
                latitude: '',
                longitude: '',
                itemKey: '',
                log: ''
            }
        },
        created() {
            this.itemKey = this.$route.params.itemkey;
            var item = this.$route.params.item;
            var address = item.address.split("-");
            var street = address[0].split(',');
            this.name = item.name.trim();
            this.valorCep = address[2].trim() + "-" + address[3].trim();
            this.street = street[0].trim();
            this.number = Number(street[1].trim());
            this.extra = street[2] ? street[2].trim() : '',
            this.neighbourhood = address[1].trim(),
            this.city = item.city.trim(),
            this.state = item.state.trim()
            this.log = new Logger(auth.currentUser.email, "UPDATE");
        },
        methods: {
            onUpdateCEP: function () {
                this.onCEPchange();
                this.allFieldsFilled();
            },
            allFieldsFilled: function () {
                this.showDatabaseError = false;
                if(this.name == '') this.allFieldsGood = false;
                else if(this.street == '') this.allFieldsGood = false;
                else if(this.number == '') this.allFieldsGood = false;
                else if(this.neighbourhood == '') this.allFieldsGood = false;
                else if(this.city == '') this.allFieldsGood = false;
                else if(this.state == '') this.allFieldsGood = false;
                else this.allFieldsGood = true;
            },
            onCEPchange: function () {
                this.showErrorCep = false;
                if (this.checkCEPformat(this.valorCep)) {
                    this.showFetchingCep = true;
                    this.fetchCEPdata();
                }
                else {
                    this.showErrorCep = false;
                };
            },
            checkCEPformat: function (strCEP)
            {
                var objER = /^[0-9]{8}$/;
                strCEP = strCEP + "";
                strCEP = strCEP.trim().split('.').join('').split('/').join('').split('-').join('');
                if(objER.test(strCEP)){
                    this.valorCep = strCEP;
                    return true;
                }
                else
                    return false;
            },
            fetchCEPdata: function () {
                let url = 'https://viacep.com.br/ws/' + this.valorCep + '/json/';
                fetch(url)
                    .then(response => response.json() )
                    .then(data => {
                        if (data.erro) {
                            this.showErrorCep = true;
                            this.showFetchingCep = false;
                            this.valorCep = '';
                            return;
                        }
                        this.valorCep = data.cep;
                        this.street = data.logradouro;
                        this.neighbourhood = data.bairro;
                        this.city = data.localidade;
                        this.state = data.uf;

                        this.showInputCep = false;
                        this.showValidCep = true;
                    })
                    .catch(err => {
                        console.error('Failed retrieving CEP at ' + this.valorCep + ' : ' + err);
                    })
            },
            getGeocodingData: function () {
                this.showDatabaseError = false;
                this.showUpdatingMessage = true;
                let address = (this.street + ',+' + this.number + ',+' + this.neighbourhood + ',+'
                    + this.city).split(" ").join("+");
                let url = 'https://us1.locationiq.com/v1/search.php?key=' + geocodingKey + '&q=' + address
                    + '&format=json';
                fetch(url)
                    .then(response => response.json() )
                    .then(data => {
                        this.latitude = Number(data[0].lat);
                        this.longitude = Number(data[0].lon);
                    })
                    .catch(err => {
                        console.error('Failed retrieving coordinates at ' + address + ' : ' + err);
                    })
                    .finally(data => {
                        this.updateFirebase();
                    })
            },
            updateFirebase: function () {
                let address;
                if (this.extra == '') {
                    address = this.street + ", " + this.number + " - " + this.neighbourhood + " - "
                        + this.valorCep;
                }
                else {
                    address = this.street + ", " + this.number + ", " + this.extra + " - " + this.neighbourhood + " - "
                        + this.valorCep;
                }
                var newContact = {
                    name: this.name,
                    address: address,
                    city: this.city,
                    state: this.state,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    weather: ''
                }
                db.ref('contacts').child(this.itemKey).set(newContact, error => {
                    if (error) {
                        this.showDatabaseError = true;
                        this.showUpdatingMessage = false;
                    } else {
                        this.log.log("Name: " + newContact.name + " | City: " + newContact.city);
                        this.$router.push('/')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .update-contacts-container {
        margin-top: 50px;
        padding-bottom: 30px;
    }

    .floatleft {
        float: left;
    }

    .floatright {
        float: right;
    }

    .clearboth {
        clear:both
    }

    .update-contacts-div-layout {
        border: 1px solid rgba(0,0,0,.3);
        border-radius: 5px;
        background: rgba(250,250,250,0.8);
        box-shadow: 5px 5px 30px rgba(0, 0, 0, .4)
    }

    .center_div{
        margin: 0 auto;
    }

    .formColumns {
        width: 48%;
    }

    #updateDiv {
        width: 600px;
        padding: 20px;
    }

    .fillDivWidth {
        width: 100%;
    }

    #updateContactButton {
        margin-top: 10px;
    }

    #updating-message {
        margin-top: 20px;
    }
</style>