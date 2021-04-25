<template>
  <div class="page-blog">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-text-field
                v-model="condition.keywords"
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
                @click:clear="handleResetFilter"
              />
              <v-btn icon @click="handleRefreshItem">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon @click="handleEditItem">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider />
            <!-- <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-btn-toggle v-model="condition.keywords" tile color="deep-purple accent-3">
                  <v-btn value="male" icon>
                    <v-icon>mdi-gender-male</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="handleResetFilter">Reset</v-btn>
                <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
              </v-card-actions>
            </v-card> -->
            <v-card-text class="pa-0">
              <v-data-table
                :loading="loadingItems"
                :headers="headers"
                :items="items"
                :items-per-page-options="[5, 10, 15, 30]"
                :server-items-length="serverItemsLength"
                :items-per-page="condition.pageSize"
                :page.sync="condition.pageIndex"
                item-key="id"
                show-select
                @update:page="handlePageChanged"
                @update:items-per-page="handlePageSizeChanged"
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
                <template v-slot:[`item.coverImage`]="{ item }">
                  <img v-if="item.coverImage.length > 4" :src="item.coverImage" width="100" />
                </template>
                <template v-slot:[`item.firstTitle`]="{ item }">
                  <span @click="handleEditItem(item)"><v-icon>mdi-eye</v-icon> {{ item.firstTitle }}</span>
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
import { timeFormat } from '../../util/timeUtil'

export default {
  components: {},
  mixins: [TooltipMixin],
  data() {
    return {
      search: '',
      loadingItems: false,
      serverItemsLength: 0,
      showFilter: false,
      condition: {
        keywords: '',
        pageIndex: 1,
        pageSize: 5,
        totalCount: 0,
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
  watch: {},
  mounted() {
    this.fetchRecords()
  },
  methods: {
    fetchRecords() {
      this.loadingItems = true
      this.items = []
      this.$store
        .dispatch('fetchArticles', this.condition)
        .then((res) => {
          const { data, pagination } = res.data
          for (let d of data) {
            d.modifyTime = timeFormat(new Date(d.modifyTime))
          }
          this.items = data
          this.serverItemsLength = pagination.totalCount
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleEditItem({ id }) {
      this.$router.push({
        name: 'blog.item.edit',
        params: { id: id },
      })
    },
    async handleDeleteItem({ id }) {
      await this.$store.dispatch('delArticle',{resourceId: id})
      this.$toasted.success('successful');
      await this.fetchRecords();
    },
    handleRefreshItem() {
      this.fetchRecords(this.pagination)
    },
    // filter
    async handlePageChanged(page) {
      this.condition.pageIndex = page
      await this.fetchRecords(this.condition)
    },
    async handlePageSizeChanged(size) {
      this.condition.pageSize = size === -1 ? this.serverItemsLength : size
      await this.fetchRecords(this.condition)
    },
    handleResetFilter() {
      this.condition.keywords = null
    },
    async handleApplyFilter() {
      await this.fetchRecords(this.condition)
    },
    handleClear() {
      this.resetFilter()
    },
  },
}
</script>
