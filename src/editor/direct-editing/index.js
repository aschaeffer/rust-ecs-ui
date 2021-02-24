import PropertyDirectEditingProvider from './PropertyDirectEditingProvider'
import EntityDirectEditingProvider from './EntityDirectEditingProvider'
import ConnectorDirectEditingProvider from './ConnectorDirectEditingProvider'

export default {
  __init__: [
    'propertyDirectEditingProvider',
    'entityDirectEditingProvider',
    'connectorDirectEditingProvider'
  ],
  propertyDirectEditingProvider: [ 'type', PropertyDirectEditingProvider ],
  entityDirectEditingProvider: [ 'type', EntityDirectEditingProvider ],
  connectorDirectEditingProvider: [ 'type', ConnectorDirectEditingProvider ]
}
