<template>
  <div class="container">
    <div class="box">
      <textarea v-model="jsonNew" class="textarea" placeholder="Paste new JSON data" />
      <textarea v-model="jsonOld" class="textarea" placeholder="Paste old JSON data" />
      <div class="box__actions">
        <button class="button" @click="prettyPrint">
          Prettify
        </button>
        <button class="button" @click="compare">
          Compare
        </button>
      </div>
    </div>
    <div v-if="resultJson" class="box box_cols">
      Result JSON
      <textarea v-model="resultJson" class="textarea" placeholder="Paste new JSON data" />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})
useMeta({
  title: 'JSON DIFF'
})
</script>
<script lang="ts">
export default {
  name: 'Locales',
  components: {
  },
  data () {
    return {
      jsonNew: '{"firstTestKey": "value1", "secondTestKey": "value2", "thirdTestKey": "value3"}',
      jsonOld: '{"firstTestKey": "value1", "secondTestKey": "value2"}',
      resultJson: ''
    }
  },
  methods: {
    prettyPrint () {
      this.jsonNew = JSON.stringify(JSON.parse(this.jsonNew), undefined, 2)
      this.jsonOld = JSON.stringify(JSON.parse(this.jsonOld), undefined, 2)
    },
    compare () {
      const parsedNew = JSON.parse(this.jsonNew)
      const parsedOld = JSON.parse(this.jsonOld)

      Object.keys(parsedNew).forEach(function (keyNew) {
        Object.keys(parsedOld).forEach(function (keyOld) {
          if (keyNew === keyOld) {
            delete parsedNew[keyNew]
          }
        })
      })

      this.resultJson = JSON.stringify(parsedNew, undefined, 2)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: grid;
  margin-top: 24px;
  grid-gap: 12px;
}
.box {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  &_cols {
    display: flex;
    flex-direction: column;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
