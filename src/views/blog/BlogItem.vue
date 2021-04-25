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
import { mapGetters } from 'vuex'
export default {
  components: {
    BlogForm,
  },
  data() {
    return {
      id: null,
      ...mapGetters(['getEditedId']),
    }
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.$store.commit('SET_RESOURCE_ID', this.id)
    } else {
      this.id = this.getEditedId()
    }
  },
}
</script>
