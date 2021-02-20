import FlowContextPadProvider from './FlowContextPadProvider'
import FlowPaletteProvider from './FlowPaletteProvider'
import FlowRuleProvider from './FlowRuleProvider'
// import FlowOrderingProvider from './FlowOrderingProvider'
import EntityRenderer from '@/renderer/EntityRenderer'
import ConnectorRenderer from '@/renderer/ConnectorRenderer'
import PropertyRenderer from '@/renderer/PropertyRenderer'
import CroppingConnectionDockingProvider from 'diagram-js/lib/layout/CroppingConnectionDocking'

export default {
  __init__: [
    'flowContextPadProvider',
    'flowPaletteProvider',
    'flowRuleProvider',
    // 'flowOrderingProvider',
    'connectionDocking',
    'entityRenderer',
    'connectorRenderer',
    'propertyRenderer'
  ],
  flowContextPadProvider: [ 'type', FlowContextPadProvider ],
  flowPaletteProvider: [ 'type', FlowPaletteProvider ],
  flowRuleProvider: [ 'type', FlowRuleProvider ],
  // flowOrderingProvider: [ 'type', FlowOrderingProvider ],
  connectionDocking: [ 'type', CroppingConnectionDockingProvider ],
  entityRenderer: [ 'type', EntityRenderer ],
  connectorRenderer: [ 'type', ConnectorRenderer ],
  propertyRenderer: [ 'type', PropertyRenderer ]
}
