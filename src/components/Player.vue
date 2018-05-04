<template>
    <div>
        {{isPlaying}}
    </div>
</template>

<script>
export default {
 computed:{
     isPlaying(){
         return this.$store.state.isPlaying;
     }
 }
};
</script>

<style lang="scss">

</style>
