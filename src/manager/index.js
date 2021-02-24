import ComponentManager from './ComponentManager'
import EntityTypeManager from './EntityTypeManager'
import RelationTypeManager from './RelationTypeManager'
import SymbolManager from './SymbolManager'

export default {
  __init__: [
    'componentManager',
    'entityTypeManager',
    'relationTypeManager',
    'symbolManager',
  ],
  componentManager: [ 'type', ComponentManager ],
  entityTypeManager: [ 'type', EntityTypeManager ],
  relationTypeManager: [ 'type', RelationTypeManager ],
  symbolManager: [ 'type', SymbolManager ],
}
