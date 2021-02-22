<template>
  <b-tabs content-class="mt-3" class="m-3">
    <b-tab v-for="flow in flows" :key="flow.id" :title="getTitle(flow)">
      <flow-editor :flowId="flow.id" />
    </b-tab>
    <template #tabs-start>
      <img src="assets/inexor_2.png" style="width: 48px; height: 48px; margin: 8px;" />
    </template>
    <template #tabs-end>
      <b-button @click="addFlow">
        <b-icon-plus />
      </b-button>
      <img src="assets/inexor_2.png" style="width: 48px; height: 48px; margin: 8px;" />
    </template>
  </b-tabs>
</template>

<script>
import FlowEditor from '@/components/FlowEditor';
import EntityTypeManager from "@/manager/FlowManager";

import {
  BTabs,
  BTab,
  BIconPlus
} from 'bootstrap-vue';

export default {
  name: 'FlowManager',
  components: {
    BTabs,
    BTab,
    BIconPlus,
    FlowEditor,
  },
  props: [
  ],
  data: function() {
    return {
      flows: [],
    }
  },
  mounted () {
    this.loadFlows()
  },
  methods: {
    getTitle (flow) {
      return `Flow Editor ${flow.id}`
    },
    addFlow () {
      EntityTypeManager.addFlow()
      this.loadFlows()
    },
    loadFlows () {
      this.flows = EntityTypeManager.getFlows()
    }
  }
}
</script>

<style scoped>

</style>
