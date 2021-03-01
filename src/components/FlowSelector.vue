<template>
  <div>
    <h3>List of Flows</h3>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Description</th>
        <th>Num Entities</th>
        <th>Num Relations</th>
        <th>Source</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="flow in getFlows()" :key="`${flow.id}-${flow.idx}`" @click="openFlow(flow.id)">
        <td>{{ flow.id }}</td>
        <td>{{ flow.description }}</td>
        <td>{{ flow.entities.length }}</td>
        <td>{{ flow.relations.length }}</td>
        <td>{{ flow.source }}</td>
        <td>
          <b-button variant="danger" @click.prevent.stop="removeFlow(flow.id)">
            <b-icon-x />
          </b-button>
        </td>
      </tr>
      </tbody>
    </table>
    <hr />
    <h3>Upload Flow</h3>
    <div>
      <b-form-file v-model="importFlowFile" accept="application/json" size="sm" @input="uploadFlow" />
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BFormFile,
  BIconX,
} from 'bootstrap-vue';

export default {
  name: "FlowSelector",
  components: {
    BButton,
    BFormFile,
    BIconX,
  },
  props: {
    flowManager: Object,
    flowId: String,
  },
  data: function() {
    return {
      importFlowFile: null,
    }
  },
  methods: {
    openFlow (flowId) {
      console.log('open flow ' + flowId)
      this.$emit('openFlow', flowId)
    },
    getFlows () {
      if (this.flowManager) {
        return this.flowManager.getFlows()
      } else {
        return []
      }
    },
    uploadFlow (event) {
      const reader = new FileReader()
      reader.onload = this.convertFlow
      reader.readAsText(event)
    },
    convertFlow (event) {
      let flow = JSON.parse(event.target.result)
      this.importFlow(flow)
    },
    importFlow (flow) {
      flow.source = 'upload'
      this.flowManager.addFlow(flow)
    },
    removeFlow (flowId) {
      this.flowManager.removeFlow(flowId)
      this.$emit('closeFlow', flowId)
    }
  }
}
</script>
