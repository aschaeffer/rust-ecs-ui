import { v4 as uuidv4 } from 'uuid'

import EntityShapeUtils from '@/utils/EntityShapeUtils'
import InstanceTypes from '@/constants/InstanceTypes.json'
import ShapeUtils from '@/utils/ShapeUtils'

export default function EntityInstanceFactory(elementFactory, entityTypeManager) {
  this._elementFactory = elementFactory
  this._entityTypeManager = entityTypeManager
}

EntityInstanceFactory.$inject = [
  'elementFactory',
  'entityTypeManager'
]

EntityInstanceFactory.prototype.createEntityInstance = function (entityTypeName, id, dimensions, description) {
  let entityType = this._entityTypeManager.getEntityType(entityTypeName)
  let shapeDefinition = EntityShapeUtils.getShapeDefinition(entityType)
  let entityId = (typeof id === 'undefined') ? uuidv4() : id
  let shape = this._elementFactory.createShape({
    id: entityId,
    x: dimensions.x,
    y: dimensions.y,
    width: dimensions.width || shapeDefinition.entity.width,
    height: dimensions.height || this.calculateHeight(shapeDefinition, entityType, null),
    businessObject: {
      type: InstanceTypes.ENTITY,
      id: entityId,
      entityType: entityType,
      name: entityTypeName,
      description: description || entityTypeName
    },
    label: {
      name: 'name'
    }
  })
  return shape
}

EntityInstanceFactory.prototype.calculateHeight = function (shapeDefinition, entityType, socketsDescriptors) {
  let sockets = socketsDescriptors || this._entityTypeManager.getSocketDescriptors(entityType)
  let offsetTop = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.top)
  let offsetBottom = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.bottom)
  let numberOfSockets = Math.max(sockets.input.length, sockets.output.length)
  let height = numberOfSockets * shapeDefinition.socket.height
    + (numberOfSockets - 1) * shapeDefinition.socket.offset
    + offsetTop
    + offsetBottom
  height = Math.max(height, 2 * shapeDefinition.socket.height)
  return height
}

EntityInstanceFactory.prototype.getDimensions = function (entityInstance, defaultDimensions) {
  let dimensions = Object.assign({}, defaultDimensions)
  if (Object.getOwnPropertyDescriptor(entityInstance, 'properties')) {
    if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dx')) {
      dimensions.x = entityInstance.properties.f2dx
    }
    if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dy')) {
      dimensions.y = entityInstance.properties.f2dy
    }
    if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dw')) {
      dimensions.width = entityInstance.properties.f2dw
    }
    if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dh')) {
      dimensions.height = entityInstance.properties.f2dh
    }
  }
  return dimensions
}

// eslint-disable-next-line no-unused-vars
EntityInstanceFactory.prototype.importEntityInstance = function (entityInstance) {

}
