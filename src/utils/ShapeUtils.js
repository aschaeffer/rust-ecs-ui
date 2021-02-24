import EntityShapeElementTypes from '@/constants/EntityShapeElementTypes.json'

function parseValue (shapeDefinition, shape, value, isHeight) {
  if (typeof value === 'string') {
    switch (value) {
      case 'shape.width':
        return shape.width
      case 'shape.width/2':
        return shape.width / 2
      case 'shape.height':
        return shape.height
      case 'shape.height/2':
        return shape.height / 2
      case 'socket.width':
        return shapeDefinition.socket.width
      case 'socket.width/2':
        return shapeDefinition.socket.width / 2
      case 'socket.height':
        return shapeDefinition.socket.height
      case 'socket.height/2':
        return shapeDefinition.socket.height / 2
      case 'socket.offset':
        return shapeDefinition.socket.offset
      case 'shape.width-socket.width':
        return shape.width - shapeDefinition.socket.width
      case 'shape.height-socket.height':
        return shape.height - shapeDefinition.socket.height
      default:
        return parseInt(value)
    }
  }
  if (value < 0) {
    if (isHeight) {
      return shape.height - value
    } else {
      return shape.width - value
    }
  }
  return value
}

function parseContentValue (shapeDefinition, element, content) {
  try {
    switch (content) {
      case 'shape.id':
        return element.id
      case 'element.description':
        return element.businessObject.description || ''
      case 'entityType.name':
        return element.businessObject.entityType.name
      case 'entityType.description':
        return element.businessObject.entityType.description
      default:
        return content
    }
  } catch (err) {
    return content
  }
}

function getShapeElementType (shapeElementDefinition) {
  try {
    switch (shapeElementDefinition.type.toLowerCase()) {
      case 'svg':
        return EntityShapeElementTypes.SVG
      default:
        return EntityShapeElementTypes.TEXT
    }
  } catch {
    return EntityShapeElementTypes.TEXT
  }
}

export default {
  parseValue,
  parseContentValue,
  getShapeElementType
}
