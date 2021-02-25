import inherits from 'inherits'

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer"

import {
  append as svgAppend,
  attr as svgAttr, classes as svgClasses,
  create as svgCreate
} from 'tiny-svg'

import { query as domQuery } from 'min-dom'

import DataTypes from "@/constants/DataTypes.json"
import DataTypeUtils from "@/utils/DataTypeUtils"
// eslint-disable-next-line no-unused-vars
import {translate} from "diagram-js/lib/util/SvgTransformUtil";
import TextUtil from "diagram-js/lib/util/Text";
import ElementUtils from "@/utils/ElementUtils";

const CONNECTOR_RENDER_PRIORITY = 3000

function ConnectorRenderer(eventBus, styles, canvas) {
  BaseRenderer.call(this, eventBus, CONNECTOR_RENDER_PRIORITY);
  let arrowId = Math.ceil(Math.random() * 1000)
  this.arrowId = 'arrow-' + arrowId
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
  this.MARKER_END_ARROW = {
    markerEnd: `url(#${this.arrowId})`
  }

  let arrowMarker = svgCreate('path')
  svgAttr(arrowMarker, {
    // d: 'M0,-5L10,0L0,5',
    d: 'M0,0 V4 L4,2 Z',
    // fill: 'black'
  })

  let marker = svgCreate('marker')
  svgAttr(marker, {
    id: this.arrowId,
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
  return ElementUtils.isDefaultConnector(element)
}

ConnectorRenderer.prototype.drawConnection = function drawConnection(visuals, element) {
  let bezierCurve = svgCreate('path')
  // console.log(this.toBezierPoints(connection.waypoints))
  let bezierCurvePath = this.toBezierPoints(element.waypoints)
  svgAttr(bezierCurve, { d: bezierCurvePath })
  svgAttr(bezierCurve, this.CONNECTION_STYLE)
  svgAttr(bezierCurve, this.getFillColorByDataTypes(element))
  svgAttr(bezierCurve, this.MARKER_END_ARROW)
  svgAppend(visuals, bezierCurve)

  let x = Math.min(element.waypoints[0].x, element.waypoints[element.waypoints.length - 1].x)
  let y = Math.min(element.waypoints[0].y, element.waypoints[element.waypoints.length - 1].y)
  let width = Math.abs(element.waypoints[element.waypoints.length - 1].x - element.waypoints[0].x)
  let height = Math.abs(element.waypoints[element.waypoints.length - 1].y - element.waypoints[0].y)

  if (width < 75) {
    let dx = 75 - width
    x -= dx / 2
    width += dx / 2
  }
  let elementLabel = new TextUtil({
    style: { fill: "black", fontSize: "12px" },
    size: { width, height },
    align: 'center-middle'
  })

  let description = element.businessObject.description || ''
  if (description !== '') {
    let shapeElementText = elementLabel.createText(description, {})
    svgClasses(shapeElementText).add('djs-label')
    translate(shapeElementText, x, y)
    svgAppend(visuals, shapeElementText)
  }

  return bezierCurve
}

ConnectorRenderer.prototype.toBezierPoints = function (points) {
  let result = 'M'
  for (let i = 0, p; (p = points[i]); i++) {
    if (i > 0 && i < points.length - 1) {
      if (points.length === 3 && i === 1) {
        result += 'Q'
      }
      if (points.length === 4 && i === 1) {
        result += 'C'
      }
      if (points.length === 5 && (i === 1 || i === 3)) {
        result += 'Q'
      }
      if (points.length === 6) {
        if (i === 1) {
          result += 'C'
        } else if (i === 4) {
          result += 'Q'
        }
      }
      if (points.length === 7) {
        if (i === 1) {
          result += 'C'
        } else if (i === 4) {
          result += 'C'
        }
      }
      if (points.length === 8) {
        if (i === 1) {
          result += 'C'
        } else if (i === 4 || i === 7) {
          result += 'Q'
        }
      }
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
