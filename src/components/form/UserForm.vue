<template>
  <v-card :loading="loading" tile>
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid" class="justify-center">
        <v-row>
          <v-col>
            <v-text-field
              outlined
              :label="formModel.nickname.label"
              :placeholder="formModel.nickname.placeholder"
              v-model="form[formModel.nickname.bind]"
              required
              :append-icon="'mdi-account-check'"
              :rules="formModel.nickname.rules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="!userWxOpenId">
            <v-text-field
              outlined
              :label="formModel.password.label"
              :placeholder="formModel.password.placeholder"
              v-model="form[formModel.password.bind]"
              required
              :append-icon="'mdi-account-check'"
              :rules="formModel.password.rules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              :label="formModel.email.label"
              :placeholder="formModel.email.placeholder"
              v-model="form[formModel.email.bind]"
              required
              :append-icon="'mdi-email'"
              :rules="formModel.email.rules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              :label="formModel.phone.label"
              :placeholder="formModel.phone.placeholder"
              v-model="form[formModel.phone.bind]"
              required
              :append-icon="'mdi-phone'"
              :rules="formModel.phone.rules"
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
// import { EMAIL } from '@/util/regex'
export default {
  props: {
    userWxOpenId: [Number, String],
  },
  data: () => ({
    valid: true,
    loading: false,
    form: {},
    formModel: {
      nickname: {
        label: 'Nickname',
        bind: 'nickname',
        placeholder: 'luke',
        rules: [(v) => !!v || 'This Nickname is required'],
      },
      password: {
        label: 'Password',
        bind: 'password',
        placeholder: 'The password',
        rules: [(v) => !!v || 'This Password is required'],
      },
      email: {
        label: 'Email',
        bind: 'email',
        placeholder: 'aichiyu94@gmail.com',
        rules: [],
      },
      phone: {
        label: 'phone',
        bind: 'phone',
        placeholder: 'phone',
        rules: [(v) => !!v || 'This phone is required'],
      },
    },

    formHasErrors: false,
  }),
  computed: {
    formTitle() {
      return !this.userWxOpenId ? 'Create User' : 'Edit User'
    },
  },
  watch: {
    userWxOpenId: {
      handler(id) {
        if (id) {
          this.getItemById(id)
        }
      },
      immediate: true,
    },
  },
  methods: {
    getItemById(id) {
      this.loading = true
      this.$store
        .dispatch('getUserById', { wxOpenId: id })
        .then(({ data }) => {
          this.form = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCancelForm() {
      this.$refs.form.reset()
      window.history.go(-1)
    },
    async handleSubmitForm() {
      if (this.$refs.form.validate()) {
        if (this.userWxOpenId) {
          this.loading = true
          const { data } = await this.$store.dispatch('updateUser', {
            wxOpenId: this.userWxOpenId,
            nickname: this.form.nickname,
            phone: this.form.phone,
            email: this.form.email,
          })

          window.history.go(-1)
          this.Toast.info('Updated ' + (data ? 'successful' : 'failed'))
        }
      }
    },
  },
}
</script>
