import flow1 from '../mock/flows/4faf3dad-3be5-45c7-b73e-96e5855b4c7d.json'
// eslint-disable-next-line no-unused-vars
import flow2 from '../mock/flows/60f08554-1258-4347-93d2-b05c7f9b51d7.json'

// Currently mocks
const flows = []
flows.push(flow1)
// flows.push(flow2)

function getFlows() {
    return flows
}

function getFlow(id) {
    let flow = flows.filter(f => f.id === id)
    if (flow.length > 0) {
        return flow[0]
    }
    return null
}

export default {
    getFlows,
    getFlow
}
