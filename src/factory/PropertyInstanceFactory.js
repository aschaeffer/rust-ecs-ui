import InstanceTypes from "@/constants/InstanceTypes.json";
import SocketTypes from '@/constants/SocketTypes.json'
import EntityShapeUtils from "@/utils/EntityShapeUtils";
import ShapeUtils from "@/utils/ShapeUtils";

export default function PropertyInstanceFactory(elementFactory) {
  this._elementFactory = elementFactory
}

PropertyInstanceFactory.$inject = [
  'elementFactory'
]

PropertyInstanceFactory.prototype.createPropertyInstance = function (socketDescriptor, idx, entity, value) {
  let entityType = entity.businessObject.entityType
  let shapeDefinition = EntityShapeUtils.getShapeDefinition(entityType)
  let x = this.getX(entity, shapeDefinition, socketDescriptor.propertySocketType)
  let y = this.getY(entity, shapeDefinition, idx)
  let propertyId = `${entity.id}-${socketDescriptor.propertyName}`
  return this._elementFactory.createShape({
    id: propertyId,
    x,
    y,
    width: shapeDefinition.socket.width,
    height: shapeDefinition.socket.height,
    parent: entity,
    attach: true,
    host: entity,
    businessObject: {
      type: InstanceTypes.PROPERTY,
      id: propertyId,
      name: socketDescriptor.propertyName,
      socketType: socketDescriptor.propertySocketType,
      dataType: socketDescriptor.propertyDataType,
      value,
      idx
    },
    label: {
      name: 'name'
    }
  })
}

PropertyInstanceFactory.prototype.getX = function (entity, shapeDefinition, socketType) {
  switch (socketType) {
    case SocketTypes.OUTPUT:
      return (entity.x + entity.width) - (shapeDefinition.socket.width / 2)
    case SocketTypes.INPUT:
    default:
      return entity.x - (shapeDefinition.socket.width / 2)
  }
}

PropertyInstanceFactory.prototype.getY = function (entity, shapeDefinition, idx) {
  let offsetTop = ShapeUtils.parseValue(shapeDefinition, null, shapeDefinition.offset.top)
  return entity.y +
    (idx * shapeDefinition.socket.height) +
    (idx * shapeDefinition.socket.offset) +
    offsetTop
}
