import EntityRenderer from './EntityRenderer'
import ConnectorRenderer from './ConnectorRenderer'
import PropertyRenderer from './PropertyRenderer'

export default {
  __init__: [
    'entityRenderer',
    'connectorRenderer',
    'propertyRenderer'
  ],
  entityRenderer: [ 'type', EntityRenderer ],
  connectorRenderer: [ 'type', ConnectorRenderer ],
  propertyRenderer: [ 'type', PropertyRenderer ],
}
