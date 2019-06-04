<template>
    <div class="add-contacts-container">

        <div id="cep" class="center_div newcontacts-div-layout" v-if="showInputCep">
            <form>
                <div class="form-group">
                    <label for="inputCep">Type your CEP:</label>
                    <input type="email"
                           class="form-control cep-input fillDivWidth"
                           id="inputCep"
                           aria-describedby="cepHelp"
                           placeholder="Enter CEP"
                           v-model="valorCep"
                           @input="onCEPchange"
                           :disabled="showFetchingCep">
                </div>
                <div id="invalidCEPwarning" class="alert alert-danger fillDivWidth" role="alert"
                     v-if="showErrorCep">
                    Invalid CEP.
                </div>
                <small id="emailHelp" class="form-text text-muted" v-if="!showFetchingCep">
                    Or if you dont know your CEP...</small>
                <button id="CEPunknown" type="submit" class="btn btn-danger fillDivWidth"
                        v-if="!showFetchingCep" v-on:click="goWithoutCEPfunction">I don't know my CEP.</button>
                <div class="alert alert-primary fillDivWidth" role="alert" v-if="showFetchingCep">
                    <font-awesome-icon icon="spinner" spin /> Checking CEP...
                </div>

            </form>
        </div>


        <div id="confirmCEPdata" class="center_div newcontacts-div-layout" v-if="showValidCep">
            <div class="formColumns floatleft">
                <div class="alert alert-secondary" role="alert">
                    <small class="form-text text-muted">
                        CEP</small>
                    {{valorCep}}</div>
                <div class="alert alert-secondary" role="alert">
                    <small class="form-text text-muted">
                        Street</small>
                    {{street}}</div>
                <div class="alert alert-secondary" role="alert">
                    <small class="form-text text-muted">
                        Neighbourhood</small>
                    {{neighbourhood}}</div>
            </div>

            <div class="formColumns floatright">
                <div class="alert alert-secondary" role="alert">
                    <small class="form-text text-muted">
                        City</small>
                    {{city}}</div>
                <div class="alert alert-secondary" role="alert">
                    <small class="form-text text-muted">
                        State</small>
                    {{state}}</div>
            </div>

            <button id="confirmCEPdataButton" type="submit" class="btn btn-success fillDivWidth"
                    v-on:click="showInputRemainingData">Information is correct!</button>
            <button id="rejectCEPdataButton" type="submit" class="btn btn-danger fillDivWidth"
                    v-on:click="clearData">That's wrong.</button>
        </div>


        <div id="inputRemainingData" class="center_div newcontacts-div-layout"
             v-if="showRemainingData || goWithoutCEP">
            <div class="formColumns floatleft">
                <form>
                    <div class="form-group">
                        <label for="formName">Name</label>
                        <input v-model="name" type="text" class="form-control" id="formName"
                               aria-describedby="formName" placeholder="Enter name" @input="allFieldsFilled"
                               :disabled="showFetchingCoordinates">
                    </div>
                    <div class="form-group">
                        <label for="formCEP">CEP</label>
                        <input v-model="valorCep" type="text" class="form-control" id="formCEP"
                               aria-describedby="formCEP" placeholder="Enter CEP" @input="allFieldsFilled"
                               :disabled="(showRemainingData || showFetchingCoordinates) || goWithoutCEP">
                    </div>
                    <div class="form-group">
                        <label for="formRua">Street</label>
                        <input v-model="street" type="text" class="form-control" id="formRua"
                               aria-describedby="formRua" placeholder="Enter street name"
                               @input="allFieldsFilled"
                               :disabled="(showRemainingData || showFetchingCoordinates) && !goWithoutCEP">
                    </div>
                    <div class="form-group">
                        <label for="formNumber">Building number</label>
                        <input v-model="number" type="number" class="form-control" id="formNumber"
                               aria-describedby="formNumber" placeholder="Enter building number"
                               @input="allFieldsFilled" :disabled="showFetchingCoordinates">
                    </div>
                </form>

            </div>

            <div class="formColumns floatright">

                <form>
                    <div class="form-group">
                        <label for="formExtra">Extras</label>
                        <input v-model="extra" type="text" class="form-control" id="formExtra"
                               aria-describedby="formExtra" placeholder="Enter extras" @input="allFieldsFilled"
                               :disabled="showFetchingCoordinates">
                    </div>
                    <div class="form-group">
                        <label for="formNeighbourhood">Neighbourhood</label>
                        <input v-model="neighbourhood" type="text" class="form-control" id="formNeighbourhood"
                               aria-describedby="formExtra" placeholder="Enter neighbourhood"
                               :disabled="(showRemainingData || showFetchingCoordinates) && !goWithoutCEP"
                               @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formCity">City</label>
                        <input v-model="city" type="text" class="form-control" id="formCity"
                               aria-describedby="formCity" placeholder="Enter city"
                               :disabled="(showRemainingData || showFetchingCoordinates) && !goWithoutCEP"
                               @input="allFieldsFilled">
                    </div>
                    <div class="form-group">
                        <label for="formState">State</label>
                        <input v-model="state" type="text" class="form-control" id="formState"
                               aria-describedby="formState" placeholder="Enter state"
                               v-bind:disabled="(showRemainingData || showFetchingCoordinates) && !goWithoutCEP"
                               @input="allFieldsFilled">
                    </div>

                </form>
            </div>
            <div class="clearboth"></div>
            <div id="databaseerror" class="alert alert-danger fillDivWidth" role="alert"
                 v-if="showDatabaseError">
                Error. Please try again.
            </div>
            <button id="saveNewContactButton" type="submit" class="btn btn-primary fillDivWidth"
                    :disabled="!allFieldsGood" v-on:click="getGeocodingData"
                    v-if="!showFetchingCoordinates">Save new contact</button>
            <button id="restartButton" type="submit" class="btn btn-warning fillDivWidth"
                    v-on:click="restart" v-if="!showFetchingCoordinates && !goWithoutCEP">Restart</button>
            <div id="validatingaddress" class="alert alert-primary fillDivWidth" role="alert"
                 v-if="showFetchingCoordinates">
                <font-awesome-icon icon="spinner" spin />  Validating address ...
            </div>

        </div>


    </div>
</template>

<script>

    import { geocodingKey } from "../sensitivedata/locationiq-geocoding";
    import { db, auth } from '../sensitivedata/firebase'
    import { Logger } from '../logger/Logger'

    export default {
        name: "new-contact",
        data() {
            return {
                showInputCep: true,
                showFetchingCep: false,
                showErrorCep: false,
                showAcceptedCep: false,
                showValidCep: false,
                showRemainingData: false,
                showFetchingCoordinates: false,
                showInvalidAddress: false,
                allFieldsGood: false,
                showDatabaseError: false,
                goWithoutCEP: false,
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
                log: ''
            }

        },
        created() {
            this.log = new Logger(auth.currentUser.email, "NEW");
        },
        methods: {
            goWithoutCEPfunction: function () {
                this.showInputCep = false;
                this.goWithoutCEP = true;
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
            clearData: function (event) {
                this.valorCep = '';
                this.street = '';
                this.neighbourhood = '';
                this.city = '';
                this.state = '';
                this.showInputCep = true;
                this.showValidCep = false;
                this.showFetchingCep = false;
            },
            showInputRemainingData: function () {
                this.showRemainingData = true;
                this.showValidCep = false;
            },
            restart: function () {
                this.name = '';
                this.valorCep = '';
                this.street = '';
                this.number = '';
                this.extras = '';
                this.neighbourhood = '';
                this.city = '';
                this.state = '';
                this.showInputCep = true,
                    this.showFetchingCep = false,
                    this.showErrorCep = false,
                    this.showAcceptedCep = false,
                    this.showValidCep = false,
                    this.showRemainingData = false,
                    this.goWithoutCEP = false
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
            getGeocodingData: function () {
                this.showDatabaseError = false;
                this.showFetchingCoordinates = true;
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
                        this.saveNewContactToFirebase();
                    })
            },
            saveNewContactToFirebase() {
                let address;
                if (this.extra == '') {
                    address = this.street + ", " + this.number + " - " + this.neighbourhood + " - "
                        + this.valorCep;
                }
                else {
                    address = this.street + ", " + this.number + ", " + this.extra + " - " + this.neighbourhood + " - "
                        + this.valorCep;
                }
                var newKey = db.ref('contacts').push();
                var newContact = {
                    name: this.name,
                    address: address,
                    city: this.city,
                    state: this.state,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    weather: ''
                }
                newKey.set(newContact, error => {
                    if (error) {
                        this.showDatabaseError = true;
                        this.showFetchingCoordinates = false;
                        console.log(error);
                    } else {
                        this.log.log("Name: " + newContact.name + " | Address: " + newContact.address
                            + " | City: " + newContact.city);
                        this.$router.push('/')
                    }
                })
            }
        }
    }
</script>


<style scoped>

    .add-contacts-container {
        margin-top: 50px;
        padding-bottom: 30px;
    }

    #cep {
        width: 230px;
        padding: 20px;
    }

    #confirmCEPdata {
        width: 600px;
        padding: 20px;
    }

    #inputRemainingData {
        width: 600px;
        padding: 20px;
    }

    #confirmCEPdataButton{
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .fillDivWidth {
        width: 100%;
    }

    .center_div{
        margin: 0 auto;
    }

    .cep-input{
        text-align: center;
        margin-bottom: 50px;
        width: 100%;
    }

    #invalidCEPwarning {
        margin-top: -40px;
    }

    .formColumns {
        width: 48%;
        /*border: 1px solid red;*/
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

    #saveNewContactButton {
        margin-top: 10px;
    }

    #restartButton {
        margin-top: 15px;
    }

    #validatingaddress {
        margin-top: 20px;
    }

    .newcontacts-div-layout {
        border: 1px solid rgba(0,0,0,.3);
        border-radius: 5px;
        background: rgba(250,250,250,0.8);
        box-shadow: 5px 5px 30px rgba(0, 0, 0, .4)
    }

</style>