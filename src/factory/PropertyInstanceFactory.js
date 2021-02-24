import EntityShapeUtils from "@/utils/EntityShapeUtils";
import InstanceTypes from "@/constants/InstanceTypes.json";
import ShapeUtils from "@/utils/ShapeUtils";

function createEntityProperty (elementFactory, socketDescriptor, idx, shape, value) {
  let entityType = shape.businessObject.entityType
  let shapeDefinition = EntityShapeUtils.getShapeDefinition(entityType)

  let x
  switch (socketDescriptor.propertySocketType) {
    case 'output':
      x = (shape.x + shape.width) - (shapeDefinition.socket.width / 2)
      break
    default:
    case 'input':
      x = shape.x - (shapeDefinition.socket.width / 2)
      break
  }
  let offsetTop = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.top)
  let y = shape.y +
    (idx * shapeDefinition.socket.height) +
    (idx * shapeDefinition.socket.offset) +
    offsetTop
  let propertyId = `${shape.id}-${socketDescriptor.propertyName}`
  return elementFactory.createShape({
    id: propertyId,
    x,
    y,
    width: shapeDefinition.socket.width,
    height: shapeDefinition.socket.height,
    parent: shape,
    attach: true,
    host: shape,
    businessObject: {
      type: InstanceTypes.PROPERTY,
      id: propertyId,
      name: socketDescriptor.propertyName,
      socketType: socketDescriptor.propertySocketType,
      dataType: socketDescriptor.propertyDataType,
      value
    },
    label: {
      name: 'name'
    }
  })
}

export default {
  createEntityProperty,
}
