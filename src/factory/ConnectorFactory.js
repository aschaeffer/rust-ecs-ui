import InstanceTypes from '@/constants/InstanceTypes.json'
import EntityShapeManager from '@/utils/EntityShapeUtils'

export default function ConnectorFactory(elementFactory, elementRegistry, relationTypeManager) {
  this._elementFactory = elementFactory
  this._elementRegistry = elementRegistry
  this._relationTypeManager = relationTypeManager
}

ConnectorFactory.$inject = [
  'elementFactory',
  'elementRegistry',
  'relationTypeManager'
]

ConnectorFactory.prototype.createConnectorInstance = function (
  relationTypeName,
  outboundId,
  outboundPropertyName,
  relationInstanceTypeName,
  inboundId,
  inboundPropertyName,
  description
) {
  let relationType = this._relationTypeManager.getRelationType(relationTypeName)

  let outboundShape = this._elementRegistry.get(outboundId)
  let inboundShape = this._elementRegistry.get(inboundId)

  let outboundPropertyShapeId = `${outboundId}-${outboundPropertyName}`
  let inboundPropertyShapeId = `${inboundId}-${inboundPropertyName}`
  let edgeKey = `${outboundPropertyShapeId}--${relationTypeName}--${inboundPropertyShapeId}`

  let outboundPropertyShape = outboundShape.children.filter(p => p.id === outboundPropertyShapeId)[0]
  if (typeof outboundPropertyShape === 'undefined') {
    console.error(`Missing outbound property ${outboundPropertyShapeId}`)
    return
  }
  let inboundPropertyShape = inboundShape.children.filter(p => p.id === inboundPropertyShapeId)[0]
  if (typeof inboundPropertyShape === 'undefined') {
    console.error(`Missing inbound property ${inboundPropertyShapeId}`)
    return
  }

  let outboundPropertyShapeDefinition
  try {
    outboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(outboundPropertyShape.businessObject.entityType)
  } catch {
    outboundPropertyShapeDefinition = EntityShapeManager.getDefaultShapeDefinition()
  }
  let inboundPropertyShapeDefinition
  try {
    inboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(inboundPropertyShape.businessObject.entityType)
  } catch {
    inboundPropertyShapeDefinition = EntityShapeManager.getDefaultShapeDefinition()
  }

  let connection = this._elementFactory.createConnection({
    id: edgeKey,
    waypoints: [
      {
        x: outboundPropertyShape.x + outboundPropertyShapeDefinition.socket.width,
        y: outboundPropertyShape.y + outboundPropertyShapeDefinition.socket.height / 2
      },
      {
        x: (outboundPropertyShape.x + inboundPropertyShape.x) / 2,
        y: (outboundPropertyShape.y + inboundPropertyShape.y) / 2
      },
      {
        x: inboundPropertyShape.x + inboundPropertyShapeDefinition.socket.width,
        y: inboundPropertyShape.y + inboundPropertyShapeDefinition.socket.height / 2
      },
    ],
    businessObject: {
      type: InstanceTypes.RELATION,
      relationType,
      name: relationInstanceTypeName,
      outboundPropertyName,
      inboundPropertyName,
      description: description || ''
    },
    source: outboundPropertyShape,
    target: inboundPropertyShape
  })
  return connection
}

ConnectorFactory.prototype.connectProperties = function (
  relationTypeName,
  outboundProperty,
  relationInstanceTypeName,
  inboundProperty,
  description
) {
  let relationType = this._relationTypeManager.getRelationType(relationTypeName)

  let outboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(outboundProperty.businessObject.entityType)
  let inboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(inboundProperty.businessObject.entityType)

  let edgeKey = `${outboundProperty.id}--${relationTypeName}--${inboundProperty.id}`

  let connection = this._elementFactory.createConnection({
    id: edgeKey,
    waypoints: [
      {
        x: outboundProperty.x + outboundPropertyShapeDefinition.socket.width,
        y: outboundProperty.y + outboundPropertyShapeDefinition.socket.height / 2
      },
      {
        x: (outboundProperty.x + inboundProperty.x) / 2,
        y: (outboundProperty.y + inboundProperty.y) / 2
      },
      {
        x: inboundProperty.x + inboundPropertyShapeDefinition.socket.width,
        y: inboundProperty.y + inboundPropertyShapeDefinition.socket.height / 2
      },
    ],
    businessObject: {
      type: InstanceTypes.RELATION,
      relationType,
      name: relationInstanceTypeName,
      outboundPropertyName: outboundProperty.businessObject.name,
      inboundPropertyName: inboundProperty.businessObject.name,
      description: description || ''
    },
    source: outboundProperty,
    target: inboundProperty
  })
  return connection
}
