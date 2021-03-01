import { v4 as uuidv4 } from 'uuid';

export default function FlowManager() {
  // Currently mocks / static components
  this.flows = []
  this.importAll(require.context('../mock/flows/', true, /\.json$/))
}

FlowManager.prototype.importAll = function (r) {
  let idx = 0
  r.keys().forEach(key => {
    let flow = r(key)
    flow.idx = idx
    flow.source = key
    this.flows.push(flow)
    idx++
  })
}

FlowManager.prototype.getFlows = function () {
  return this.flows
}

FlowManager.prototype.getFlow = function (id) {
  let flow = this.flows.filter(f => f.id === id)
  if (flow.length > 0) {
    return flow[0]
  }
  return null
}

FlowManager.prototype.createFlow = function () {
  let id = uuidv4()
  this.flows.push({
    id,
    description: '',
    entities: [
      {
        type: 'flow',
        id,
        description: '',
        properties: {
        }
      }
    ],
    relations: [],
    properties: []
  })
  return id
}

FlowManager.prototype.addFlow = function (flow) {
  this.flows.push(flow)
}

FlowManager.prototype.removeFlow = function (id) {
  let idx = this.flows.findIndex(flow => flow.id === id)
  if (idx >= 0) {
    this.flows.splice(idx, 1)
  }
}
