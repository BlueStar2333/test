<template>
  <span>这是一段信息111{{componentData}}</span>
</template>

<script>
export default {
  name: 'ColumnForm',
  props: {
    componentData: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
