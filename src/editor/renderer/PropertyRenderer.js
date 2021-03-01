import inherits from 'inherits'

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer"
import TextUtil from "diagram-js/lib/util/Text"
import { translate } from 'diagram-js/lib/util/SvgTransformUtil'

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses
} from 'tiny-svg'

import DataTypeUtils from "@/utils/DataTypeUtils"
import EntityShapeUtils from "@/utils/EntityShapeUtils"
import InstanceTypes from "@/constants/InstanceTypes.json"
import SocketTypes from "@/constants/SocketTypes.json"

const PROPERTY_RENDER_PRIORITY = 5000

function PropertyRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, PROPERTY_RENDER_PRIORITY);
  this.SHAPE_STYLE = styles.style(
    {
      fill: 'none',
      stroke: 'rgba(0, 0, 0, 0.5)',
      strokeWidth: 1,
    }
  )
  this.DATA_TYPE_TEXT_STYLE = {
    fontFamily: 'Fira Code',
    fontSize: 20,
    fill: 'fuchsia'
  }
  this.VALUE_TEXT_STYLE = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 10,
    fill: 'black'
  }
}

inherits(PropertyRenderer, BaseRenderer)

PropertyRenderer.prototype.canRender = function(element) {
  // eslint-disable-next-line no-prototype-builtins
  return element.hasOwnProperty('businessObject') &&
    element.businessObject !== undefined &&
    // eslint-disable-next-line no-prototype-builtins
    element.businessObject.hasOwnProperty('type') &&
    element.businessObject.type === InstanceTypes.PROPERTY
}

PropertyRenderer.prototype.getShapeType = function (element) {
  return {
    x: 0,
    y: 0,
    rx: 5,
    ry: 5,
    width: element.width || 0,
    height: element.height || 0
  }
}

PropertyRenderer.prototype.drawShape = function (visuals, element) {
  let dataType = element.businessObject.dataType;
  let isBool = DataTypeUtils.isBool(dataType)
  let entityType = element.parent.businessObject.entityType
  let shapeDefinition = EntityShapeUtils.getShapeDefinition(entityType)
  let isInput = this.isInput(element.businessObject.socketType)
  let isOutput = this.isOutput(element.businessObject.socketType)
  let value = element.businessObject.value

  let factualDataType = dataType
  if (DataTypeUtils.isAny(dataType)) {
    if (isInput && element.incoming.length > 0) {
      factualDataType = element.incoming[0].source.businessObject.dataType
    } else if (isOutput && element.outgoing.length > 0) {
      factualDataType = element.outgoing[0].target.businessObject.dataType
    }
  }

  let propertyShape = svgCreate('rect');
  svgAttr(propertyShape, this.getShapeType(element));
  svgAttr(propertyShape, this.SHAPE_STYLE);
  if (!isBool) {
    svgAttr(propertyShape, {
      fill: DataTypeUtils.getDataTypeColorOpaque(factualDataType, 0.1)
    })
  } else if (element.businessObject.value) {
    svgAttr(propertyShape, {
      fill: 'rgba(0, 255, 0, 0.1)'
    })
  } else {
    svgAttr(propertyShape, {
      fill: 'rgba(255, 0, 0, 0.1)'
    })
  }

  // Highlight sockets which are in use
  if (isInput && element.incoming.length > 0) {
    svgAttr(propertyShape, {
      strokeWidth: 2,
    })
  } else if (isOutput && element.outgoing.length > 0) {
    svgAttr(propertyShape, {
      strokeWidth: 2,
    })
  }

  let centerWidth = shapeDefinition.socket.width / 2

  let dataTypeLabel = new TextUtil({
    style: this.DATA_TYPE_TEXT_STYLE,
    size: {
      width: centerWidth,
      height: shapeDefinition.socket.height
    },
    align: 'center-middle'
  })

  let dataTypeText = dataTypeLabel.createText(DataTypeUtils.getDataTypeShort(factualDataType), {})
  svgClasses(dataTypeText).add('djs-label')
  if (!isInput) {
    translate(dataTypeText, centerWidth, 0)
  }
  svgAttr(dataTypeText, {
    fill: DataTypeUtils.getDataTypeColorOpaque(factualDataType, 0.7),
    strokeWidth: 1,
    stroke: DataTypeUtils.getDataTypeColorOpaque(factualDataType, 0.3),
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter'
  })
  svgAppend(visuals, dataTypeText)

  // !isBool &&
  if (value !== undefined && value !== null) {
    let valueLabel = new TextUtil({
      style: this.VALUE_TEXT_STYLE,
      size: {
        width: centerWidth,
        height: shapeDefinition.socket.height
      },
      align: 'center-middle'
    })

    let valueText = valueLabel.createText(DataTypeUtils.convertValue(factualDataType, value), {})
    svgClasses(valueText).add('djs-label')
    if (isInput) {
      translate(valueText, centerWidth, 0)
    }
    svgAppend(visuals, valueText)
  }

  svgAppend(visuals, propertyShape)
  return propertyShape
}

// TODO: SocketUtils
PropertyRenderer.prototype.isInput = function (socketType) {
  return socketType === SocketTypes.INPUT
}

PropertyRenderer.prototype.isOutput = function (socketType) {
  return socketType === SocketTypes.OUTPUT
}

PropertyRenderer.$inject = [ 'eventBus', 'styles'  ]

export default PropertyRenderer
