<template>
  <div class="page-user__item">
    <v-container>
      <v-row>
        <v-col>
          <config-form :config-name="id" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ConfigForm from '@/components/form/ConfigForm'
export default {
  components: {
    ConfigForm,
  },
  props: {
    id: [String],
  },
}
</script>
