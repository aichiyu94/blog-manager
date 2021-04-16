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
                :server-items-length="serverItemsLength"
                :items-per-page="pagination.pageSize"
                :page.sync="filter['page']"
                item-key="id"
                show-select
                @update:page="handlePageChanged"
                :footer-props="{
                  showFirstLastPage: true,
                  firstIcon: 'mdi-arrow-collapse-left',
                  lastIcon: 'mdi-arrow-collapse-right',
                  prevIcon: 'mdi-minus',
                  nextIcon: 'mdi-plus',
                }"
              >
                <template v-slot:[`item.value`]="{ item }">
                  {{ item.value }}
                </template>
                <template v-slot:[`item.coverImage`]="{ item }"> <img :src="item.coverImage" width="100" /> </template>
                <template v-slot:[`item.firstTitle`]="{ item }">
                  <span @click="handleEditItem(item)">{{ item.firstTitle }}</span>
                </template>

                <template #[`item.action`]="{ item }">
                  <v-menu>
                    <template #activator="{ on: menu }">
                      <v-tooltip bottom>
                        <template #activator="{ on: tooltip }">
                          <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <span>Action</span>
                      </v-tooltip>
                    </template>
                    <v-list class="pa-0" dense>
                      <v-list-item v-for="action in actions" :key="action.text" @click="action.click(item)">
                        <v-list-item-icon class="mr-2">
                          <v-icon small>{{ action.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ action.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
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

export default {
  components: {},
  mixins: [TooltipMixin],
  data() {
    return {
      search: '',
      loadingItems: false,
      serverItemsLength: 0,
      showFilter: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
      },
      filter: {
        page: 1,
        'filter[username]': null,
        'filter[gender]': null,
      },
      headers: [
        {
          text: '标题',
          value: 'firstTitle',
        },
        {
          text: '封面',
          value: 'coverImage',
        },
        {
          text: '作者',
          value: 'authorNickname',
        },
        {
          text: '浏览数',
          value: 'browserCount',
        },
        {
          text: '点赞数',
          value: 'thumbupCount',
        },
        {
          text: '修改时间',
          value: 'modifyTime',
        },
        {
          text: '操作',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: 'View Item',
          icon: 'mdi-eye',
          click: this.handleViewItem,
        },
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
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
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchArticles', this.pagination)
        .then((res) => {
          const { data, pagination } = res.data
          console.log(data[0])
          this.items = data
          this.serverItemsLength = pagination.totalCount
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: '/acl/user/create',
      })
    },
    handleViewItem() {},
    handleEditItem({ id }) {
      this.$router.push({
        path: `/blog/item/${id}`,
      })
    },
    handleDeleteItem() {},
    handleSubmit() {},
    handleRefreshItem() {
      this.fetchRecords(this.pagination)
    },
    // filter
    async handlePageChanged(page) {
      this.pagination.pageIndex = page
      await this.fetchRecords(this.pagination)
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
}
</script>
