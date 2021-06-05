<template>
  <div class="page-user__item">
    <v-container>
      <v-row>
        <v-col>
          <blog-form :article-id="blogId" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlogForm from '@/components/form/BlogForm'
import { mapGetters } from 'vuex'
export default {
  components: {
    BlogForm,
  },
  data() {
    return {
      blogId: '',
    }
  },
  computed: {
    ...mapGetters(['editedBlogId']),
  },
  mounted() {
    this.blogId = this.editedBlogId
  },
}
</script>
