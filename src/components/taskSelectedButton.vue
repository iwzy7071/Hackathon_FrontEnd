<template>
    <a-button type="dashed" @click="showTaskSelected" icon="menu-fold" style="position:fixed; bottom:10px; right:0;"/>
</template>
<script>
    export default {
        data() {
            return {};
        },
        methods: {
            showTaskSelected() {
                this.$store.commit("setTaskSelectedVisible", true);
            },
        }
    };
</script>
