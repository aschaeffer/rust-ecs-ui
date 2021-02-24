import { v4 as uuidv4 } from 'uuid';

import flow1 from '../mock/flows/4faf3dad-3be5-45c7-b73e-96e5855b4c7d.json'
// eslint-disable-next-line no-unused-vars
import flow2 from '../mock/flows/60f08554-1258-4347-93d2-b05c7f9b51d7.json'
// import flow3 from '../mock/flows/5fe09c8c-e5b5-4a0c-b211-14c4c82c98a2.json'
// import flow4 from '../mock/flows/72de97ac-948c-47f5-ae30-8507b3bc59af.json'


// Currently mocks
const flows = []
flows.push(flow1)
// flows.push(flow2)
// flows.push(flow3)
// flows.push(flow4)

function getFlows () {
  return flows
}

function getFlow (id) {
  let flow = flows.filter(f => f.id === id)
  if (flow.length > 0) {
    return flow[0]
  }
  return null
}

function createFlow () {
  let id = uuidv4()
  flows.push({
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
    relations: []
  })
}

function addFlow (flow) {
  flows.push(flow)
}

function removeFlow (id) {
  let idx = flows.findIndex(flow => flow.id === id)
  if (idx >= 0) {
    flows.splice(idx, 1)
  }
}

export default {
  getFlows,
  getFlow,
  createFlow,
  addFlow,
  removeFlow
}
