import inherits from 'inherits'

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer"
import { createLine } from "diagram-js/lib/util/RenderUtil"

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

import { query as domQuery } from 'min-dom'

import InstanceTypes from "@/constants/InstanceTypes.json"
import ConnectorTypes from "@/constants/ConnectorTypes.json"
import DataTypes from "@/constants/DataTypes.json"
import DataTypeUtils from "@/utils/DataTypeUtils"

const CONNECTOR_RENDER_PRIORITY = 3000

function ConnectorRenderer(eventBus, styles, canvas) {
  BaseRenderer.call(this, eventBus, CONNECTOR_RENDER_PRIORITY);
  this.CONNECTION_STYLE = styles.style(
    [
      'no-fill'
    ],
    {
      fill: 'none',
      strokeDasharray: 4,
      strokeWidth: 2,
      stroke: '#000'
    }
  )

  let arrowMarker = svgCreate('path')
  svgAttr(arrowMarker, {
    // d: 'M0,-5L10,0L0,5',
    d: 'M0,0 V4 L4,2 Z',
    // fill: 'black'
  })

  let marker = svgCreate('marker')
  svgAttr(marker, {
    id: 'arrow',
    orient: 'auto',
    markerWidth: 15,
    markerHeight: 20,
    refX: 4,
    refY: 2,
    viewBox: '0 0 10 10'
  })
  svgAppend(marker, arrowMarker)

  let defs = domQuery('defs', canvas._svg)
  if (!defs) {
    defs = svgCreate('defs')
    svgAppend(canvas._svg, defs)
  }
  svgAppend(defs, marker)

}

inherits(ConnectorRenderer, BaseRenderer)

ConnectorRenderer.prototype.canRender = function(element) {
  // eslint-disable-next-line no-prototype-builtins
  return element.hasOwnProperty('businessObject') &&
    element.businessObject !== undefined &&
    // eslint-disable-next-line no-prototype-builtins
    element.businessObject.hasOwnProperty('type') &&
    element.businessObject.type === InstanceTypes.RELATION &&
    element.businessObject.relationType.name === ConnectorTypes.DEFAULT_CONNECTOR
}

ConnectorRenderer.prototype.drawConnection = function drawConnection(visuals, connection) {
  if (connection.waypoints.length % 2 === 0) {
    let line = createLine(connection.waypoints, this.CONNECTION_STYLE)
    svgAttr(line, {
      markerEnd: 'url(#arrow)'
    })
    svgAttr(line, this.getFillColorByDataTypes(connection))
    svgAppend(visuals, line);
    return line
  } else {
    let bezierCurve = svgCreate('path')
    // console.log(this.toBezierPoints(connection.waypoints))
    svgAttr(bezierCurve, { d: this.toBezierPoints(connection.waypoints) })
    svgAttr(bezierCurve, this.CONNECTION_STYLE)
    svgAttr(bezierCurve, this.getFillColorByDataTypes(connection))
    svgAttr(bezierCurve, { markerEnd: 'url(#arrow)' })
    svgAppend(visuals, bezierCurve)
    return bezierCurve
  }
}

ConnectorRenderer.prototype.toBezierPoints = function (points) {
  let result = 'M'
  for (let i = 0, p; (p = points[i]); i++) {
    if (i % 2 === 1) {
      result += 'Q'
    }
    result += p.x + ',' + p.y + ' '
  }
  return result
}

ConnectorRenderer.prototype.getFillColorByDataTypes = function (connection) {
  if (connection.source.businessObject.dataType === connection.target.businessObject.dataType ||
    connection.target.businessObject.dataType === DataTypes.ANY
  ) {
    return {
      stroke: DataTypeUtils.getDataTypeColor(connection.source.businessObject.dataType)
    }
  } else if (connection.source.businessObject.dataType === DataTypes.ANY) {
    return {
      stroke: DataTypeUtils.getDataTypeColor(connection.target.businessObject.dataType)
    }
  }


  return {}
}

ConnectorRenderer.$inject = [ 'eventBus', 'styles', 'canvas'  ]

export default ConnectorRenderer
