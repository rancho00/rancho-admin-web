<template>
  <div class="app-container">
      <pre>
        {{ content }}
      </pre>
  </div>
</template>

<script>
import { getLogs } from '@/api/actuator'

export default {
  data() {
    return {
      loading: true,
      content: null,
      monitor: null
    }
  },
  created() {
    this.monitor = window.setInterval(() => {
      setTimeout(() => {
        this.getLogs()
      }, 2)
    }, 3500)
  },
  destroyed() {
    clearInterval(this.monitor)
  },
  methods: {
    getLogs() {
      this.loading = true
      getLogs().then(response => {
        console.log(response)
        if(response !== undefined){
          this.content = this.content + '<br>' + response
        }
      })
    }
  }
}
</script>

