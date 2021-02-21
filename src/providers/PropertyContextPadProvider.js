import {v4 as uuidv4} from 'uuid'

import ElementUtils from '@/utils/ElementUtils'
import DataTypes from '@/constants/DataTypes.json'
import EntityInstanceFactory from '@/factory/EntityInstanceFactory'

export default function PropertyContextPadProvider(connect, create, contextPad, elementFactory) {
  this._connect = connect
  this._create = create
  this._elementFactory = elementFactory
  contextPad.registerProvider(this)
}

PropertyContextPadProvider.$inject = [
  'connect',
  'create',
  'contextPad',
  'elementFactory'
]

PropertyContextPadProvider.prototype.getContextPadEntries = function (element) {
  if (!ElementUtils.isProperty(element)) {
    return {}
  }

  let connect = this._connect
  let create = this._create
  let elementFactory = this._elementFactory

  let startConnect = (event, element, autoActivate) => {
    connect.start(event, element, autoActivate)
  }

  let createAndConnect = (event, element) => {
    let shape = EntityInstanceFactory.createEntityInstance(
      elementFactory,
      'and',
      undefined,
      undefined,
      uuidv4()
    )
    create.start(event, shape, {
      outboundProperty: element,
      inboundPropertyName: 'lhs',
      relationTypeName: 'default_connector'
    })

    // connect.start(event, element, autoActivate)
  }

  let contextPadEntries = {}

  if (ElementUtils.isOutputSocket(element)) {
    contextPadEntries['connect'] = {
      group: 'edit',
      className: 'bpmn-icon-connection',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    }
    if (element.businessObject.dataType === DataTypes.BOOL) {
      contextPadEntries['create-and'] = {
        group: 'edit',
        className: 'bpmn-icon-task-none',
        title: 'AND',
        action: {
          click: createAndConnect
        }
      }
    }
  }
  return contextPadEntries
}
// 'create-and': {
//   group: 'logical-gates',
//     className: 'bpmn-icon-task-none',
//     title: 'Create AND',
//     action: {
//     click: function() {
//       let shape = EntityInstanceFactory.createEntityInstance(
//         elementFactory,
//         'and',
//         undefined,
//         undefined,
//         uuidv4()
//       )
//       create.start(event, shape)
//     }
//   }
// },
