<template>
  <b-tabs content-class="mt-3" class="m-3">
    <b-tab v-for="flow in getFlows()" :key="flow.id" :title="getTitle(flow)">
      <flow-editor :flowId="flow.id" />
    </b-tab>
    <template #tabs-start>
      <img src="assets/inexor_2.png" style="width: 48px; height: 48px; margin: 8px;" />
    </template>
  </b-tabs>
</template>

<script>
import FlowEditor from '@/components/FlowEditor';
import EntityTypeManager from "@/manager/FlowManager";

import {
  BTabs,
  BTab
} from 'bootstrap-vue';

export default {
  name: 'FlowManager',
  components: {
    BTabs,
    BTab,
    FlowEditor,
  },
  props: [
  ],
  methods: {
    getTitle (flow) {
      return `Flow Editor ${flow.id}`
    },
    getFlows: EntityTypeManager.getFlows
  }
}
</script>

<style scoped>

</style>
