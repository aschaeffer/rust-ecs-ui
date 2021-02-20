import inherits from 'inherits'

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer"
import TextUtil from "diagram-js/lib/util/Text"
import { translate } from 'diagram-js/lib/util/SvgTransformUtil'

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
} from 'tiny-svg'

import InstanceTypes from "@/constants/InstanceTypes.json"
import EntityShapeManager from "@/manager/EntityShapeManager"
import ShapeUtils from "@/utils/ShapeUtils"

const ENTITY_RENDER_PRIORITY = 4000

function EntityRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, ENTITY_RENDER_PRIORITY);
  this.SHAPE_STYLE = styles.style(
    [ 'no-fill' ],
    {
      fill: 'none',
      stroke: '#000',
      strokeWidth: 1,
    }
  )
}

inherits(EntityRenderer, BaseRenderer)

EntityRenderer.prototype.canRender = function(element) {
  // eslint-disable-next-line no-prototype-builtins
  return element.hasOwnProperty('businessObject') &&
    element.businessObject !== undefined &&
    // eslint-disable-next-line no-prototype-builtins
    element.businessObject.hasOwnProperty('type') &&
    element.businessObject.type === InstanceTypes.ENTITY
}

EntityRenderer.prototype.getShapeType = function (element) {
  return {
    x: 0,
    y: 0,
    rx: 20,
    ry: 20,
    width: element.width || 0,
    height: element.height || 0
  }
}

EntityRenderer.prototype.drawShape = function (visuals, element) {
  let entityType = element.businessObject.entityType
  let shapeDefinition = EntityShapeManager.getShapeDefinition(entityType)

  // The entity shape itself
  let entityShape = svgCreate('rect');
  svgAttr(entityShape, this.getShapeType(element))
  svgAttr(entityShape, this.SHAPE_STYLE)
  svgAppend(visuals, entityShape);

  // eslint-disable-next-line no-unused-vars
  for (let [elementName, shapeElement] of Object.entries(shapeDefinition.elements)) {
    // console.log(elementName, shapeElement)
    if (shapeElement.show) {
      let top = ShapeUtils.parseValue(shapeDefinition, element, shapeElement.position.top, true)
      let left = ShapeUtils.parseValue(shapeDefinition, element, shapeElement.position.left, false)
      let height = ShapeUtils.parseValue(shapeDefinition, element, shapeElement.position.height, true)
      let width = ShapeUtils.parseValue(shapeDefinition, element, shapeElement.position.width, false)
      let content = ShapeUtils.parseContentValue(shapeDefinition, element, shapeElement.content)
      let shapeElementLabel = new TextUtil({
        style: shapeElement.styles,
        size: { width, height },
        align: 'center-middle'
      })

      let shapeElementText = shapeElementLabel.createText(content, {})
      svgClasses(shapeElementText).add('djs-label')
      translate(shapeElementText, left, top)
      svgAppend(visuals, shapeElementText)
    }
  }

  return entityShape
}

EntityRenderer.$inject = [ 'eventBus', 'styles'  ]

export default EntityRenderer
