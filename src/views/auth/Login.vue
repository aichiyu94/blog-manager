<template>
  <v-container class="page_login" fill-height>
    <v-row>
      <v-col>
        <v-card class="pa-3 page_login__card" tile>
          <v-card-title>
            <img :src="getSysInfo().logo" :alt="getSysInfo().name" height="48" contain />
            <h1 class="primary--text display-1 page-login_title">{{ getSysInfo().name }}</h1>
          </v-card-title>
          <v-card-text>
            <!-- <v-alert type="info"> {{ t('login_account') }} : admin/admin </v-alert> -->
            <v-form ref="form" v-model="formValid" class="my-10" lazy-validation>
              <v-text-field
                v-model="formModel.username"
                append-icon="mdi-account"
                autocomplete="off"
                name="login"
                :label="t('username')"
                :placeholder="t('username')"
                type="text"
                required
                outlined
                :rules="formRule.username"
              />
              <v-text-field
                v-model="formModel.phone"
                append-icon="mdi-phone"
                autocomplete="off"
                name="phone"
                :label="t('phone')"
                :placeholder="t('phone')"
                type="text"
                :rules="formRule.phone"
                required
                outlined
                @keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <!-- <v-tooltip v-for="item in socialIcons" :key="item.text" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon v-bind="attrs" v-on="on" @click="handleSocialLogin">
                  <v-icon v-text="item.icon" />
                </v-btn>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip> -->
            <v-spacer />
            <!-- <v-btn large text @click="login">
              {{ __('register') }}
            </v-btn> -->
            <v-btn large tile color="primary" :loading="loading" @click="login">
              {{ t('login') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PageLogin',
  data() {
    return {
      ...mapGetters(['getSysInfo']),
      loading: false,
      formValid: false,
      formModel: {
        username: '',
        phone: '',
      },
      formRule: {
        username: [(v) => !!v || this.t('rule.required', ['username'])],
        phone: [(v) => !!v || this.t('rule.required', ['phone'])],
      },
      socialIcons: [
        {
          text: 'Google',
          icon: 'mdi-google',
        },
        {
          text: 'Facebook',
          icon: 'mdi-facebook',
        },
        {
          text: 'Twitter',
          icon: 'mdi-twitter',
        },
      ],
    }
  },
  computed: {
    prefix() {
      return ''
    },
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$store
          .dispatch('login', this.formModel)
          .then(() => {
            this.loading = false
            this.$router.push('/dashboard')
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleSocialLogin() {},
  },
}
</script>

<style lang="sass" scoped>
.page_login
  &__card
    max-width: 600px
    margin: 0 auto
</style>
