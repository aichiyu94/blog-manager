<template>
  <div class="page-user">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-text-field
                v-model="search['search[username]']"
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
              <v-btn icon @click="handleImport">
                <v-icon>mdi-import</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider />
            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-btn-toggle v-model="search['search[gender]']" tile color="deep-purple accent-3">
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
              <v-data-table :loading="loadingItems" :headers="headers" :items="items" item-key="propertyId" show-select>
                <template v-slot:[`item.Text`]="{ item }">
                  {{ item.value }}
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-menu>
                    <template v-slot:activator="{ on: menu }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
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
import { mapGetters } from 'vuex'

export default {
  components: {},
  mixins: [TooltipMixin],
  data() {
    return {
      search: {
        pageIndex: 1,
        pageSize: 15,
        totalCount: 0,
      },
      loadingItems: false,
      showFilter: false,
      importDialogVisible: false,
      headers: [
        {
          text: this.t('UI.Column.Name'),
          value: 'propertyName',
        },
        {
          text: this.t('UI.Column.Type'),
          value: 'propertyType',
        },
        {
          text: this.t('UI.Column.Description'),
          value: 'description',
        },
        {
          text: 'Action',
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
  computed: {
    ...mapGetters(['FundPropertyDefine', 'StockPropertyDefine']),
  },
  watch: {
    '$route.query': {
      handler(query) {
        const search = this.updateFilterQuery(query)
        this.fetchRecords(search)
      },
      immediate: true,
    },
  },
  methods: {
    updateFilterQuery(query) {
      const search = Object.assign(this.search, query)
      search.pageIndex = parseInt(search.pageIndex)
      return search
    },
    resetFilter() {
      this.search.pageIndex = 1
    },
    async fetchRecords(query) {
      this.loadingItems = true
      const { data } = await this.$store.dispatch('fetchSysProperties')
      this.loadingItems = false
      this.items = data
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: '/sys/property/create',
      })
    },
    handleImport() {},
    handleViewItem() {},
    handleEditItem({ propertyId }) {
      this.$router.push({
        path: `/sys/property/item/${propertyId}`,
      })
    },
    handleSubmit() {},
    handleRefreshItem() {
      this.fetchRecords(this.search)
    },
    handleResetFilter() {
      this.search.pageIndex = 1
      this.$router.replace({
        path: this.$route.path,
      })
    },
    handleApplyFilter() {
      this.$router.replace({
        path: this.$route.path,
        query: this.search,
      })
    },
    handleClear() {
      this.resetFilter()
      this.$router.replace({
        path: this.$route.path,
        query: this.search,
      })
    },
  },
  mounted() {},
}
</script>
