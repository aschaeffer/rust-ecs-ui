import EntityContextPadProvider from './EntityContextPadProvider'
import ConnectorContextPadProvider from './ConnectorContextPadProvider'
import PropertyContextPadProvider from './PropertyContextPadProvider'
import FlowPaletteProvider from './FlowPaletteProvider'
import FlowRuleProvider from './FlowRuleProvider'
import EntityRenderer from '@/renderer/EntityRenderer'
import ConnectorRenderer from '@/renderer/ConnectorRenderer'
import PropertyRenderer from '@/renderer/PropertyRenderer'
import CroppingConnectionDockingProvider from 'diagram-js/lib/layout/CroppingConnectionDocking'
import PropertyDirectEditingProvider from './PropertyDirectEditingProvider'
import EntityDirectEditingProvider from './EntityDirectEditingProvider'

export default {
  __init__: [
    'entityContextPadProvider',
    'connectorContextPadProvider',
    'propertyContextPadProvider',
    'flowPaletteProvider',
    'flowRuleProvider',
    'connectionDocking',
    'entityRenderer',
    'connectorRenderer',
    'propertyRenderer',
    'propertyDirectEditingProvider',
    'entityDirectEditingProvider'
  ],
  entityContextPadProvider: [ 'type', EntityContextPadProvider ],
  connectorContextPadProvider: [ 'type', ConnectorContextPadProvider ],
  propertyContextPadProvider: [ 'type', PropertyContextPadProvider ],
  flowPaletteProvider: [ 'type', FlowPaletteProvider ],
  flowRuleProvider: [ 'type', FlowRuleProvider ],
  connectionDocking: [ 'type', CroppingConnectionDockingProvider ],
  entityRenderer: [ 'type', EntityRenderer ],
  connectorRenderer: [ 'type', ConnectorRenderer ],
  propertyRenderer: [ 'type', PropertyRenderer ],
  propertyDirectEditingProvider: [ 'type', PropertyDirectEditingProvider ],
  entityDirectEditingProvider: [ 'type', EntityDirectEditingProvider ]
}
