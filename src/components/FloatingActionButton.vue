<template>
    <div id="fab-button" v-if="show" class="floating-button" @click="triggerOnclick">
        <font-awesome-icon icon="plus" class="floating-button-icon"/>
    </div>
</template>

<script>
    export default {
        name: "floating-action-button",
        props: {
            show: {},
            onclick: {},
        },
        methods: {
            triggerOnclick: function() {
                $("#fab-button").hide()
                this.onclick();
            }
        }
    }
</script>

<style scoped>

    .floating-button {
        position:fixed;
        width:60px;
        height:60px;
        bottom:40px;
        right:40px;
        background-color:#17A2B8;
        color:#FFF;
        border-radius:50px;
        text-align:center;
        box-shadow: 5px 5px 30px rgba(0, 0, 0, .4);
        animation-name: fadeIn;
        animation-duration: 1.7s;
        animation-delay: .7s;
        animation-fill-mode: forwards;
        opacity: 0;
    }

    .floating-button-icon {
        margin-top: 22px;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            bottom: 30px;
            right: 30px;
            transform: scale(.8);
            -webkit-transform: scale(.8);
        }
        to {
            opacity: 1;
            bottom: 40px;
            right: 40px;
            transform: scale(1);
            -webkit-transform: scale(1);
        }
    }

</style>