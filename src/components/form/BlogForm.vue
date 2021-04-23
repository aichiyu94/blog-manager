<template>
  <v-card :loading="loading" tile>
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col>
            <img :src="article.coverImage" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              ref="cover"
              outlined
              v-model="article.coverImageFile"
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
              :ishljs="true"
              :shortCut="true"
              @change="editorChange"
              @imgAdd="editorImage"
              @imgDel="delImage"
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
    valid: true,
    loading: false,
    article: {
      firstTitle: null,
      secondTitle: null,
      body: null,
      tags: [],
      imageNames: [],
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
        this.getItemById(id)
      },
      immediate: true,
    },
  },
  methods: {
    editorImage(pos, f) {
      let that = this
      this.$store.dispatch('uploadArticleImage', f).then(({ data }) => {
        that.$refs.editor.$img2Url(pos, 'img/' + data)
      })
    },
    delImage(f) {
      let fid = f[0].split('/')[1]
      this.$store.dispatch('deleteImage', { folder: 'ArticleImages', resourceId: fid })
    },
    inputTags(e) {
      if (e.code !== 'Enter' || this.article.tags.find((c) => c.tag === this.tagStr) != undefined) return
      this.article.tags.push({ tag: this.tagStr, visibility: true })
      this.tagStr = ''
    },
    async uploadCoverImage(file) {
      if (file === null) return
      if (this.article.id) {
        let updatedResult = await this.$store.dispatch('uploadImage', {
          file: file,
          resourceId: this.article.id,
        })
        this.article.coverImage = updatedResult.data
        this.$toasted.success('UI.imgLoadSuccessful', { duration: 1500 })
      }
    },
    getItemById(id) {
      if (id) {
        this.loading = true
        this.$store
          .dispatch('getArticleById', { resourceId: id })
          .then(({ data }) => {
            data.tags = data.tags.map((t) => {
              return { tag: t, visibility: true }
            })

            this.article = data
            this.article.articleId = id
            this.loading = false
          })
          .catch((e) => {
            console.log(e)
          })
      }
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
      let coverImageFile = this.article.coverImageFile
      this.article.tags = this.article.tags
        .filter((c) => c.visibility)
        .map((t) => {
          return t.tag
        })
      delete this.article.coverImageFile
      let updatedResult = await this.$store.dispatch('updateArticle', this.article)
      this.article.id = updatedResult.data
      if (!this.article.id && coverImageFile !== null) {
        //没有上传过图片
        let uploadResult = await this.$store.dispatch('uploadCoverImage', {
          file: coverImageFile,
          resourceId: updatedResult.data,
        })
      }
      this.$toasted.success('UI.successful', { duration: 1500 })
      this.$router.push('/blog/list')
    },
  },
}
</script>
