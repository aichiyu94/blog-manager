<template>
  <v-select hide-details label="Apps" :items="items" @change="handleChange"></v-select>
</template>

<script>
export default {
  data() {
    return {
      default: '/dashboard',
      items: [
        {
          text: 'Dashboard',
          value: '/dashboard',
        },
        {
          text: 'Chat',
          value: '/chat',
        },
        {
          text: 'Media',
          value: '/Media',
        },
        {
          text: 'Blog',
          value: '/blog',
        },
      ],
    }
  },
  methods: {
    handleChange(val) {
      const { href } = this.$router.resolve({
        path: val,
      })
      window.open(href, '_blank')
    },
  },
}
</script>

<style></style>
