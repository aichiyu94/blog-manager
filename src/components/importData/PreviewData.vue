<template>
  <!-- Preview Data -->
  <v-card class="mx-auto" filled>
    <v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">2. Preview Data</v-list-item-title>
          <v-data-table
            :loading="headers.length > 0 && items.length <= 0"
            :headers="headers"
            :items="items"
            :items-per-page-options="[5, 15, 30, 50]"
            :server-items-length="items.length"
            :items-per-page="pagination.pageSize"
            :item-key="itemKey"
          >
            <template v-slot:[`item.text`]="{ item }">
              {{ item.value }}
            </template>
          </v-data-table>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { headers: Array, items: Array },
  data() {
    return {
      pagination: {
        pageIndex: 1,
        pageSize: 5,
      },
      itemKey: '',
    }
  },
  watch: {
    items: {
      handler(s) {
        let firstRow = s.length ? s[0] : {}
        for (const f in firstRow) {
          this.itemKey = f || ''
          break
        }
      },
    },
  },
}
</script>