import { v4 as uuidv4 } from 'uuid'

import EntityTypeManager from '@/manager/EntityTypeManager'
import EntityShapeManager from '@/manager/EntityShapeManager'
import InstanceTypes from '@/constants/InstanceTypes.json'
import ShapeUtils from '@/utils/ShapeUtils'

function createEntityInstance (elementFactory, entityTypeName, x, y, id, description) {
  let entityType = EntityTypeManager.getEntityType(entityTypeName)
  let shapeDefinition = EntityShapeManager.getShapeDefinition(entityType)

  let entityId = (typeof id === 'undefined') ? uuidv4() : id
  let sockets = EntityTypeManager.getSocketDescriptors(entityType)

  let offsetTop = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.top)
  let offsetBottom = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.bottom)
  let height = (Math.max(sockets.input.length, sockets.output.length) * shapeDefinition.socket.height)
    + offsetTop
    + offsetBottom
  height = Math.max(height, 2 * shapeDefinition.socket.height)
  let shape = elementFactory.createShape({
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
      description: description || entityType.name
    },
    label: {
      name: 'name'
    }
  })
  return shape
}

// eslint-disable-next-line no-unused-vars
function importEntityInstance(entityInstance) {

}

export default {
  createEntityInstance,
  importEntityInstance,
}
