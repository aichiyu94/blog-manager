<template>
  <v-card :loading="loading" tile>
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col>
            <img v-if="article.coverImageBlob" :src="article.coverImageBlob" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              ref="cover"
              outlined
              v-model="article.coverImage"
              label="cover image"
              dense
              @change="uploadCoverImage"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" md="3">
            <v-text-field outlined required label="一级标题" v-model="article.firstTitle" dense />
          </v-col>
          <v-col :cols="12" md="8">
            <v-text-field outlined required label="二级标题" v-model="article.secondTitle" dense />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" md="4">
            <v-text-field @keydown="inputTags" v-model="tagStr" dense outlined label="标签"> </v-text-field>
          </v-col>
          <v-col :cols="12" md="8">
            <span v-for="(tag, idx) in article.tags" :key="idx">
              <v-chip class="md-2" v-if="tag.visibility" close color="secondary" @click:close="tag.visibility = false">
                {{ tag.tag }}
              </v-chip>
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <mavon-editor
              v-model="article.body"
              ref="editor"
              @change="editorChange"
              @imgAdd="editorImage"
              style="min-height: 400px; width: 90%"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-btn @click="handleCancelForm" text>Cancel</v-btn>
      <v-spacer />
      <v-btn :loaidng="loading" tile color="primary" @click="handleSubmitForm">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    articleId: [String],
  },
  data: () => ({
    genders: ['male', 'female', 'other'],
    valid: true,
    loading: false,
    article: {
      firstTitle: null,
      secondTitle: null,
      body: null,
      tags: [],
      articleId: null,
    },
    tagStr: null,
    articleHtml: null,
    form: {
      title: {
        label: 'Username',
        placeholder: 'Tookit',
        rules: [(v) => !!v || 'This field is required'],
      },
    },

    formHasErrors: false,
  }),
  computed: {
    formTitle() {
      return !this.articleId ? 'Create Article' : 'Edit Article'
    },
  },
  watch: {
    articleId: {
      handler(id) {
        if (id) {
          this.getItemById(id)
        }
      },
      immediate: true,
    },
  },
  methods: {
    editorImage() {
      debugger
    },
    inputTags(e) {
      if (e.code !== 'Enter' || this.article.tags.find((c) => c.tag === this.tagStr) != undefined) return
      this.article.tags.push({ tag: this.tagStr, visibility: true })
      this.tagStr = ''
    },
    uploadCoverImage(file) {
      if (file === null) return
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      let that = this
      fileReader.onload = function () {
        that.article.coverImageBlob = fileReader.result
      }
      fileReader.onerror = function () {
        alert(fileReader.error)
      }
    },
    getItemById(id) {
      this.loading = true
      this.$store
        .dispatch('getArticleById', { articleId: id })
        .then(({ data }) => {
          data.tags = data.tags.map((t) => {
            return { tag: t, visibility: true }
          })
          data.coverImageBlob = data.coverImage
          data.coverImage = null
          this.article = data
          this.article.articleId = id
          this.loading = false
        })
        .catch((e) => {
          console.log(e)
        })
    },
    editorChange(text, html) {
      this.articleHtml = text
    },
    handleCancelForm() {
      this.$router.go(-1)
    },
    async handleSubmitForm() {
      this.loading = true
      this.article.body = this.articleHtml
      let coverImage = this.article.coverImage
      this.article.tags = this.article.tags
        .filter((c) => c.visibility)
        .map((t) => {
          return t.tag
        })
      delete this.article.coverImage
      let updatedResult = await this.$store.dispatch('updateArticle', this.article)
      if (updatedResult.data) {
        if (!coverImage && coverImage !== null) {
          let uploadResult = await this.$store.dispatch('uploadImage', {
            file: coverImage,
            resourceId: updatedResult.data,
          })
        }
        this.$toasted.success('UI.successful', { duration: 1500 })
        this.$router.push('/blog/list')
      }
    },
  },
}
</script>
