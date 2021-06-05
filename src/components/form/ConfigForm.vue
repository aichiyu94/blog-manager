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
              v-model="configuration[field.bind]"
              :item-value="field.itemValue"
            >
            </v-select>
            <v-text-field
              v-else
              :type="field.type"
              :label="field.name"
              v-model="configuration[field.bind]"
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
    configName: [String],
  },
  data() {
    return {
      valid: true,
      loading: false,
      configuration: {},
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
      return !this.configName ? 'Create Config' : 'Edit Config'
    },
    ...mapGetters(['editedBlogId', 'PropertyDefine', 'Users']),
  },
  watch: {
    configName: {
      handler(val) {
        this.getItemByName(val)
      },
      immediate: true,
    },
  },
  methods: {
    async getItemByName(val) {
      if (val) {
        this.loading = true
        const { data } = await this.$store.dispatch('getConfigurationByName', JSON.parse(val))
        this.configuration = data
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
        const { data } = await this.$store.dispatch('modifyConfiguration', this.configuration)
        if (data) {
          this.$router.push('/sys/config/list')
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
        name: this.t('UI.Column.Name'),
        bind: 'name',
        type: 'text',
      },
      {
        name: this.t('UI.Column.PropertyName'),
        type: 'Number',
        bind: 'propertyId',
        items: this.PropertyDefine,
        itemText: 'text',
        itemValue: 'value',
      },
      {
        name: this.t('UI.Column.Value'),
        bind: 'value',
        type: 'text',
      },
      {
        name: this.t('UI.Column.UserName'),
        type: 'text',
        bind: 'userId',
        items: this.Users,
        itemText: 'text',
        itemValue: 'value',
      },
    ]
  },
}
</script>
