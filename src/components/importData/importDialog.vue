 <template>
  <v-form>
    <v-card>
      <v-card class="mx-auto" outlined style="border: none">
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <hr style="background-color: rgb(57, 33, 107); height: 3px" />
      </v-card>

      <v-card>
        <v-card-text>
          <!-- Choose Data File -->
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">1. Choose Data File</v-list-item-title>
              <v-row>
                <v-col cols="12" md="3">
                  <v-file-input
                    v-model="editedItem.importedDocument"
                    @change="pickedFile"
                    dense
                    color="primary"
                    accept=".xls,.xlsx"
                    label="Data File"
                    @click:clear="resetFile"
                    outlined
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>

      <preview-data :headers="previewHeaders" :items="previewItems" />
      <!-- Mode of Import -->
      <v-card class="mx-auto" style="border: none" outlined>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">3. Mode of Import</v-list-item-title>
              <v-radio-group style="padding-left: 15px" :mandatory="false" v-model="editedItem.importModel" row>
                <v-radio color="primary" label="Rewrite" value="Rewrite"></v-radio>
                <v-radio color="primary" label="Trace Change" value="Trace Change"></v-radio>
              </v-radio-group>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="cancel" text="Cancel"></v-btn>
        >
        <v-btn @click.native="confirm" text="CONFIRM"></v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import PreviewData from './PreviewData.vue'
import XLSX from 'xlsx'
export default {
  components: { PreviewData, EMButton },
  props: {
    title: String,
    editedItem: Object,
    importColumnRules: Array,
    FieldsNameNeedBeConvert: Array,
  },
  data() {
    return {
      previewHeaders: [],
      previewItems: [],
      validation: true,
    }
  },
  watch: {
    validation: {
      handler(val) {
        if (!val) {
          this.previewHeaders = []
          this.editedItem.importedDocument = null
        }
      },
      immediate: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      if (!this.validation) {
        this.Toast('Format validated failed, Please check it', false)
        return
      }
      if (this.previewItems.length > 0) {
        if (this.FieldsNameNeedBeConvert.length > 0) {
          //tag import
          //convert tag properties from name to value
          const copiedItems = JSON.parse(JSON.stringify(this.previewItems))
          for (let item of copiedItems) {
            for (const p in item) {
              const convertItem = this.FieldsNameNeedBeConvert.find((s) => s.field === p)

              if (convertItem) {
                const covert = convertItem.items.find((s) => s.text === item[p])
                if (covert) {
                  //complete the asset id
                  if (p === 'AssetName') {
                    item['AssetID'] = covert.value
                    delete item['AssetName']
                  } else item[p] = covert.value
                }
              }
            }
          }

          this.$emit('confirm', {
            importItems: copiedItems,
            importModel: this.editedItem.importModel,
          })
        } else {
          this.$emit('confirm', {
            importItems: this.previewItems,
            importModel: this.editedItem.importModel,
          })
        }
      }
    },
    resetFile() {
      this.previewHeaders = []
      this.previewItems = []
    },
    pickedFile() {
      if (this.editedItem.importedDocument == null) {
        return
      }
      var fileReader = new FileReader()
      const that = this
      fileReader.onload = function (ev) {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary',
            cellDates: true,
          })
          for (let sheet in workbook.Sheets) {
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            const fetchColumns = () => {
              const o = sheetArray[0]
              let columns = []
              for (const f in o) {
                const col = that.importColumnRules.find((c) => encodeURIComponent(c.text) === encodeURIComponent(f))
                if (col) {
                  columns.push({ text: f, value: col.field, sortable: false })
                } else {
                  console.log('Not found' + f + 'Field')
                }
              }
              return columns
            }

            that.previewHeaders = fetchColumns()
            if (that.previewHeaders.length !== that.importColumnRules.length) {
              that.importColumnRules.forEach((s) => {
                const header = that.previewHeaders.find((sh) => sh.text === s.text)
                if (!header) {
                  that.Toast(s.text + ' Column(s) lost or their value is null', false)
                  that.validation = false
                }
              })
              return
            }
            if (sheetArray.length == 0) {
              continue
            }
            that.previewItems = []
            sheetArray.forEach((row, rowIdx) => {
              let updatedRow = {}
              that.previewHeaders.map((col) => {
                updatedRow[col.value] = row[col.text]
                //Tag import checking
                const convertItem = that.FieldsNameNeedBeConvert.find((s) => s.columnName === col.text)
                if (convertItem) {
                  const item = convertItem.items.find((s) => s.text === row[col.text])
                  if (!item) {
                    that.Toast(
                      'The value at column(' + col.text + ') row(' + (rowIdx + 1) + ') is incorrect, Please Check!',
                      false
                    )
                    that.validation = false
                    updatedRow[col.value] = ''
                  }
                }
              })
              //Using for import asset
              if (updatedRow['manufactedDate']) {
                updatedRow['manufactedDate'] = updatedRow['manufactedDate'].toLocaleDateString()
              }

              if (updatedRow['installationDate']) {
                updatedRow['installationDate'] = updatedRow['installationDate'].toLocaleDateString()
              }

              that.previewItems.push(updatedRow)
            })
          }
        } catch (e) {
          that.Toast('Error format type', false)
        }
      }
      fileReader.readAsBinaryString(that.editedItem.importedDocument)
    },
  },
  created() {
    this.editedItem.importModel = 'Trace Change'
  },
}
</script>