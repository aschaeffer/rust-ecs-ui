<template>
  <b-tabs v-model="currentTab" content-class="mt-3" class="m-3">
    <b-tab>
      <template #title>
        <img src="assets/inexor_2.png" style="width: 24px; height: 24px;" />
        Flows
      </template>
      <flow-selector :flow-manager="flowManager" @openFlow="openFlow" @closeFlow="closeFlow" />
    </b-tab>
    <b-tab title="Type System">
      <type-system-editor />
    </b-tab>
    <b-tab v-for="(flowId, index) in openedFlowIds" :key="index">
      <template #title>
        {{ getTitle(flowId) }}
        <b-button variant="sm" @click="closeFlow(flowId)">
          <b-icon-x />
        </b-button>
      </template>
      <flow-editor :flow-manager="flowManager" :flowId="flowId" />
    </b-tab>
    <template #tabs-end>
      <b-nav-item @click="createFlow">
        <b-icon-plus />
      </b-nav-item>
    </template>
  </b-tabs>
</template>

<script>
import FlowEditor from '@/components/FlowEditor'
import FlowSelector from '@/components/FlowSelector'
import FlowManager from '@/manager/FlowManager'
import TypeSystemEditor from '@/components/TypeSystemEditor'

import {
  BTabs,
  BTab,
  BIconPlus,
  BNavItem,
} from 'bootstrap-vue';

export default {
  name: 'FlowDesigner',
  components: {
    TypeSystemEditor,
    BTabs,
    BTab,
    BIconPlus,
    BNavItem,
    FlowSelector,
    FlowEditor,
  },
  props: [
  ],
  data: function() {
    return {
      flowManager: null,
      openedFlowIds: [],
      currentTab: null
    }
  },
  created () {
    this.flowManager = new FlowManager()
  },
  methods: {
    getTitle (flowId) {
      let flow = this.flowManager.getFlow(flowId)
      if (flow) {
        if (Object.getOwnPropertyDescriptor(flow, 'description') && flow.description !== '') {
          return flow.description
        }
        return `Flow ${flow.id}`
      }
      return 'N/A ${flow.id}'
    },
    createFlow () {
      let flowId = this.flowManager.createFlow()
      this.openedFlowIds.push(flowId)
      setTimeout(() => {
        this.selectTab(flowId)
      }, 250)
    },
    isFlowOpened (id) {
      return this.openedFlowIds.filter(flowId => flowId === id).length > 0
    },
    selectTab (id) {
      let tabIndex = this.getTabIndex(id)
      console.log(2 + tabIndex)
      this.currentTab = 2 + tabIndex
      console.log(this.currentTab)
    },
    openFlow (id) {
      if (!this.isFlowOpened(id)) {
        this.openedFlowIds.push(id)
      }
      setTimeout(() => {
        this.selectTab(id)
      }, 250)
    },
    closeFlow (id) {
      this.openedFlowIds = this.openedFlowIds.filter(flowId => flowId !== id)
    },
    getTabIndex (id) {
      return this.openedFlowIds.findIndex(flowId => flowId === id)
    }
  }
}
</script>
