<template>
  <button @click="pause">Pause</button>
</template>

<script>
export default {
  methods: {
    pause() {
      this.$store.state.player.pause();
    }
  }
};
</script>