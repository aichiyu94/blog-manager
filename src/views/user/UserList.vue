<template>
  <div class="page-user">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-text-field
                v-model="filter['filter[username]']"
                text
                solo
                flat
                :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
                append-icon="mdi-magnify"
                placeholder="Type something"
                hide-details
                clearable
                @keyup.enter="handleApplyFilter"
                @click:append="handleApplyFilter"
                @click:prepend="showFilter = !showFilter"
                @click:clear="handleClear"
              />
              <v-btn icon @click="handleRefreshItem">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon @click="handleCreateItem">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider />
            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-btn-toggle v-model="filter['filter[gender]']" tile color="deep-purple accent-3">
                  <v-btn value="male" icon>
                    <v-icon>mdi-gender-male</v-icon>
                  </v-btn>
                  <v-btn value="female">
                    <v-icon>mdi-gender-female</v-icon>
                  </v-btn>
                  <v-btn value="other">
                    <v-icon>mdi-gender-non-binary</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="handleResetFilter">Reset</v-btn>
                <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
              </v-card-actions>
            </v-card>
            <v-card-text class="pa-0">
              <v-data-table
                :loading="loadingItems"
                :headers="headers"
                :items="items"
                :items-per-page-options="[15, 30, 50]"
                :server-items-length="pagination.totalCount"
                :items-per-page="pagination.pageSize"
                :page.sync="filter['page']"
                item-key="wxOpenId"
                show-select
                @update:page="handlePageChanged"
              >
                <template v-slot:[`item.Text`]="{ item }">
                  {{ item.value }}
                </template>
                <template v-slot:[`item.avatar`]="{ item }">
                  <c-avatar :size="36" :src="item.avatar" />
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-btn
                    color="primary"
                    outlined
                    v-for="action in actions"
                    :key="action.text"
                    @click="action.click(item)"
                  >
                    <v-icon small>{{ action.icon }}</v-icon>
                    {{ action.text }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import CAvatar from '@/components/avatar/CAvatar'

export default {
  components: {
    CAvatar,
  },
  mixins: [TooltipMixin],
  data() {
    return {
      search: '',
      loadingItems: false,
      showFilter: false,
      pagination: {
        pageIndex: 1,
        pageSize: 15,
        totalCount: 0,
      },
      filter: {
        page: 1,
        'filter[loginName]': null,
      },
      headers: [],
      items: [],
      actions: [
        {
          text: this.t('UI.function.Edit'),
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
      ],
    }
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true,
    },
  },
  methods: {
    //
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      filter.page = parseInt(filter.page)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        'filter[username]': null,
      }
    },
    async fetchRecords() {
      this.loadingItems = true
      this.items = []
      const res = await this.$store.dispatch('fetchUser', this.pagination)
      const { data, pagination } = res.data
      this.loadingItems = false
      this.items = data
      this.pagination.totalCount = pagination.totalCount
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: '/sys/user/create',
      })
    },
    handleEditItem({ wxOpenId }) {
      this.$router.push({
        path: `/sys/user/item/${wxOpenId}`,
      })
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    // filter
    handlePageChanged(page) {
      this.filter.page = page
    },
    handleResetFilter() {
      this.filter = {
        page: 1,
        'filter[username]': null,
        'filter[gender]': null,
      }
      this.$router.replace({
        path: this.$route.path,
      })
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
  },
  mounted() {
    this.headers = [
      {
        text: this.t('UI.Column.Avatar'),
        value: 'avatar',
      },
      {
        text: this.t('UI.Column.Name'),
        value: 'loginName',
      },
      {
        text: this.t('UI.Column.Email'),
        value: 'email',
      },
      {
        text: this.t('UI.Column.Phone'),
        value: 'phone',
      },
      {
        text: this.t('UI.Column.Action'),
        value: 'action',
      },
    ]
  },
}
</script>
