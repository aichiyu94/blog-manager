<template>
  <div class="page-user__item">
    <v-container>
      <v-row>
        <v-col>
          <property-form :property-id="id" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PropertyForm from '@/components/form/PropertyForm'
export default {
  components: {
    PropertyForm,
  },
  props: {
    id: [Number],
  },
}
</script>
