<template>
  <elFrame :src="druidApi"/>
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Swagger',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'druidApi'
    ])
  }
}
</script>
