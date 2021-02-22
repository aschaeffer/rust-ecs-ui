function parseValue (shapeDefinition, shape, value, isHeight) {
  if (typeof value === 'string') {
    switch (value) {
      case 'shape.height':
        return shape.height;
      case 'shape.width':
        return shape.width;
      case 'socket.height':
        return shapeDefinition.socket.height;
      case 'socket.width':
        return shapeDefinition.socket.width;
      case 'shape.height-socket.height':
        return shape.height - shapeDefinition.socket.height;
      case 'shape.width-socket.width':
        return shape.width - shapeDefinition.socket.width;
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

export default {
  parseValue,
  parseContentValue
}
