<template>
  <b-sidebar :visible="showSidebar"
             title="Entities"
             right
             shadow
             backdrop
             @change="changed($event)">
    <div class="px-3 py-2">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>ID</th>
            <th>Desc</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entity in getFlow(flowId).entities" :key="entity.id">
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
import FlowManager from "@/manager/FlowManager";

export default {
  name: "FlowEditorEntitiesSidebar",
  props: {
    flowId: String,
    showSidebar: Boolean
  },
  methods: {
    changed (newValue) {
      if (!newValue) {
        this.$emit('hidden')
      }
    },
    getFlow: FlowManager.getFlows
  }
}
</script>

<style scoped>

</style>
