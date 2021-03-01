<template>
  <b-sidebar :visible="showSidebar"
             title="Entities"
             right
             shadow
             backdrop
             @change="changed($event)">
    <div v-if="flow !== null" class="px-3 py-2">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>ID</th>
            <th>Desc</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entity in flow.entities" :key="entity.id">
            <td>{{entity.type}}</td>
            <td>{{entity.id}}</td>
            <td>{{entity.description}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </b-sidebar>
</template>

<script>
export default {
  name: "FlowEditorEntitiesSidebar",
  props: {
    flow: Object,
    showSidebar: Boolean
  },
  methods: {
    changed (newValue) {
      if (!newValue) {
        this.$emit('hidden')
      }
    }
  }
}
</script>

<style scoped>

</style>
