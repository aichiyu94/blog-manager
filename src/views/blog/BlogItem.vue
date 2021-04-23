<template>
  <div class="page-user__item">
    <v-container>
      <v-row>
        <v-col>
          <blog-form :article-id="id" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlogForm from '@/components/form/BlogForm'
export default {
  components: {
    BlogForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    }
  },
}
</script>
