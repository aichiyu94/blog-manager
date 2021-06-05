<template>
  <v-card :loading="loading" tile>
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col md="3" v-for="(field, idx) in fields" :key="idx">
            <v-select
              v-if="field.items && field.items.length > 0"
              :label="field.name"
              :items="field.items"
              :item-text="field.itemText"
              v-model="sysProperty[field.bind]"
              :item-value="field.itemValue"
            >
            </v-select>
            <v-text-field
              v-else
              :type="field.type"
              :label="field.name"
              v-model="sysProperty[field.bind]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-btn @click="handleCancelForm" text>Cancel</v-btn>
      <v-spacer />
      <v-btn tile color="primary" @click="handleSubmitForm">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    propertyId: [Number, String],
  },
  data() {
    return {
      valid: true,
      loading: false,
      sysProperty: {},
      fields: [],
      form: {
        title: {
          label: 'Nickname',
          placeholder: 'luke',
          rules: [(v) => !!v || 'This Nickname is required'],
        },
      },
      formHasErrors: false,
    }
  },
  computed: {
    formTitle() {
      return !this.articleId ? 'Create Property' : 'Edit Property'
    },
    ...mapGetters(['editedBlogId', 'PropertyTypes', 'WhetherDefine']),
  },
  watch: {
    propertyId: {
      handler(id) {
        this.getItemById(parseInt(id))
      },
      immediate: true,
    },
  },
  methods: {
    async getItemById(id) {
      if (id) {
        this.loading = true
        const { data } = await this.$store.dispatch('getSysPropertyById', id)
        this.sysProperty = data
        this.loading = false
      }
    },
    handleCancelForm() {
      this.$router.go(-1)
    },
    async handleSubmitForm() {
      const validation = this.$refs.form.validate()
      if (validation) {
        this.loading = true
        const { data } = await this.$store.dispatch('modifyProperty', this.sysProperty)
        if (data) {
          this.$router.push('/sys/property/list')
          this.Toast.success(this.t('UI.successful'))
        } else {
          this.Toast.warning(this.t('UI.failed'))
        }
      }
    },
  },
  mounted() {
    this.fields = [
      {
        name: '属性数据类型',
        bind: 'propertyType',
        type: 'Number',
        items: this.PropertyTypes,
        itemText: 'text',
        itemValue: 'value',
      },
      {
        name: '属性名称',
        type: 'text',
        bind: 'propertyName',
      },
      {
        name: '描述',
        type: 'text',
        bind: 'description',
      },
    ]
  },
}
</script>
