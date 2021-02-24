import { v4 as uuidv4 } from 'uuid'

import EntityShapeManager from '@/utils/EntityShapeUtils'
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

EntityInstanceFactory.prototype.createEntityInstance = function (entityTypeName, x, y, id, description) {
  let entityType = this._entityTypeManager.getEntityType(entityTypeName)
  let shapeDefinition = EntityShapeManager.getShapeDefinition(entityType)

  let entityId = (typeof id === 'undefined') ? uuidv4() : id
  let sockets = this._entityTypeManager.getSocketDescriptors(entityType)

  let offsetTop = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.top)
  let offsetBottom = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.bottom)
  let numberOfSockets = Math.max(sockets.input.length, sockets.output.length)
  let height = numberOfSockets * shapeDefinition.socket.height
    + (numberOfSockets - 1) * shapeDefinition.socket.offset
    + offsetTop
    + offsetBottom
  height = Math.max(height, 2 * shapeDefinition.socket.height)
  let shape = this._elementFactory.createShape({
    id: entityId,
    x,
    y,
    width: shapeDefinition.entity.width,
    height: height,
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

// eslint-disable-next-line no-unused-vars
EntityInstanceFactory.prototype.importEntityInstance = function (entityInstance) {

}
