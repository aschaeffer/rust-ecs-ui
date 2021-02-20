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

function parseContentValue (shapeDefinition, shape, content) {
  switch (content) {
    case 'shape.id':
      return shape.id;
    default:
      return content
  }
}

export default {
  parseValue,
  parseContentValue
}
