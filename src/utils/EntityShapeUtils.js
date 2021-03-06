import EntityShapeDefaults from "@/constants/EntityShapeDefaults.json"
import EntityShapeDefaultElements from "@/constants/EntityShapeDefaultElements.json"
import EntityShapeDefaultDirectEditing from "@/constants/EntityShapeDefaultDirectEditing.json"
import SocketShapeDefaults from "@/constants/SocketShapeDefaults.json"

function getEntityWidth (entityType) {
  try {
    return entityType.shape.width
  } catch {
    return EntityShapeDefaults.WIDTH
  }
}

function getSocketHeight (entityType) {
  try {
    return entityType.shape.socket.height
  } catch {
    return SocketShapeDefaults.HEIGHT
  }
}

function getSocketWidth (entityType) {
  try {
    return entityType.shape.socket.width
  } catch {
    return SocketShapeDefaults.WIDTH
  }
}

function getSocketOffset (entityType) {
  try {
    return entityType.shape.socket.offset
  } catch {
    return SocketShapeDefaults.OFFSET
  }
}

function getOffsetTop (entityType) {
  try {
    return entityType.shape.offset.top
  } catch {
    return EntityShapeDefaults.OFFSET_TOP
  }
}

function getOffsetBottom (entityType) {
  try {
    return entityType.shape.offset.bottom
  } catch {
    return EntityShapeDefaults.OFFSET_BOTTOM
  }
}

function getShapeElements (entityType) {
  try {
    let elements = entityType.shape.elements
    for (let elementName of Object.keys(elements)) {
      if (!Object.getOwnPropertyDescriptor(elements[elementName], 'position')) {
        elements[elementName].position = {
          top: 0,
          left: 0,
          height: "socket.height",
          width: "socket.width"
        }
      }
      if (!Object.getOwnPropertyDescriptor(elements[elementName], 'align')) {
        elements[elementName].align = 'center-middle'
      }
    }
    return elements
  } catch {
    return EntityShapeDefaultElements
  }
}

function getShapeDirectEditing (entityType) {
  try {
    if (typeof entityType.shape.directEditing  !== 'undefined') {
      return entityType.shape.directEditing
    }
    return EntityShapeDefaultDirectEditing
  } catch {
    return EntityShapeDefaultDirectEditing
  }
}

function getShapeStyle (entityType) {
  try {
    if (typeof entityType.shape.style !== 'undefined') {
      return entityType.shape.style
    }
    return {}
  } catch {
    return {}
  }
}

function getShapeDefinition (entityType) {
  return {
    entity: {
      width: getEntityWidth(entityType)
    },
    socket: {
      width: getSocketWidth(entityType),
      height: getSocketHeight(entityType),
      offset: getSocketOffset(entityType)
    },
    offset: {
      top: getOffsetTop(entityType),
      bottom: getOffsetBottom(entityType)
    },
    elements: getShapeElements(entityType),
    directEditing: getShapeDirectEditing(entityType),
    style: getShapeStyle(entityType)
  }
}

function getDefaultShapeDefinition () {
  return {
    entity: {
      width: EntityShapeDefaults.WIDTH
    },
    socket: {
      width: SocketShapeDefaults.WIDTH,
      height: SocketShapeDefaults.HEIGHT,
      offset: SocketShapeDefaults.OFFSET
    },
    offset: {
      top: EntityShapeDefaults.OFFSET_TOP,
      bottom: EntityShapeDefaults.OFFSET_BOTTOM
    },
    elements: EntityShapeDefaultElements,
    directEditing: EntityShapeDefaultDirectEditing,
    style: {}
  }
}

export default {
  getShapeDefinition,
  getDefaultShapeDefinition
}
