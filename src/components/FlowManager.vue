<template>
  <b-tabs content-class="mt-3" class="m-3">
    <b-tab v-for="flow in flows" :key="flow.id">
      <template #title>
        {{ getTitle(flow) }}
        <b-button variant="sm" @click="removeFlow(flow.id)">
          <b-icon-x />
        </b-button>
      </template>
      <flow-editor :flowId="flow.id" />
    </b-tab>
    <template #tabs-start>
      <b-nav-item>
        <img src="assets/inexor_2.png" style="width: 24px; height: 24px;" />
      </b-nav-item>
    </template>
    <template #tabs-end>
      <b-nav-item @click="createFlow">
        <b-icon-plus />
      </b-nav-item>
      <b-nav-form class="float-right">
        <b-form-file v-model="importFlowFile" accept="application/json" size="sm" @input="uploadFlow" />
      </b-nav-form>
    </template>
  </b-tabs>
</template>

<script>
import FlowEditor from '@/components/FlowEditor';
import EntityTypeManager from "@/manager/FlowManager";

import {
  BTabs,
  BTab,
  BIconPlus,
  BNavItem,
  BNavForm,
  BFormFile
} from 'bootstrap-vue';

export default {
  name: 'FlowManager',
  components: {
    BTabs,
    BTab,
    BIconPlus,
    BNavItem,
    BNavForm,
    BFormFile,
    FlowEditor,
  },
  props: [
  ],
  data: function() {
    return {
      flows: [],
      importFlowFile: null,
    }
  },
  mounted () {
    this.loadFlows()
  },
  methods: {
    getTitle (flow) {
      if (Object.getOwnPropertyDescriptor(flow, 'description') && flow.description !== '') {
        return flow.description
      }
      return `Flow ${flow.id}`
    },
    createFlow () {
      EntityTypeManager.createFlow()
      this.loadFlows()
    },
    removeFlow (id) {
      EntityTypeManager.removeFlow(id)
      this.loadFlows()
    },
    loadFlows () {
      this.flows = EntityTypeManager.getFlows()
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
      console.log(flow)
      EntityTypeManager.addFlow(flow)
      this.loadFlows()
    }
  }
}
</script>
