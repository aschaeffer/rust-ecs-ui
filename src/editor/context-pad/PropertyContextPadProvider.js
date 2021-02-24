import {v4 as uuidv4} from 'uuid'

import ElementUtils from '@/utils/ElementUtils'
import DataTypes from '@/constants/DataTypes.json'

export default function PropertyContextPadProvider(
  contextPad, connect, create, modeling, entityInstanceFactory
) {
  this._connect = connect
  this._create = create
  this._modeling = modeling
  this._entityInstanceFactory = entityInstanceFactory

  contextPad.registerProvider(this)
}

PropertyContextPadProvider.$inject = [
  'contextPad',
  'connect',
  'create',
  'modeling',
  'entityInstanceFactory'
]

PropertyContextPadProvider.prototype.getContextPadEntries = function (element) {
  if (!ElementUtils.isProperty(element)) {
    return {}
  }

  let connect = this._connect
  let create = this._create
  let modeling = this._modeling

  let removeIncomingConnectors = () => {
    let connectors = []
    element.incoming.forEach(connector => connectors.push(connector))
    modeling.removeElements(element.incoming)
  }

  let removeOutgoingConnectors = () => {
    let connectors = []
    element.outgoing.forEach(connector => connectors.push(connector))
    modeling.removeElements(connectors)
  }

  let startConnect = (event, element, autoActivate) => {
    connect.start(event, element, autoActivate)
  }

  let createAndConnect = (event, element) => {
    let shape = this._entityInstanceFactory.createEntityInstance(
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

  if (ElementUtils.hasIncomingConnectors(element)) {
    contextPadEntries['delete-incoming-connectors'] = {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: 'Delete incoming connectors',
      action: {
        click: removeIncomingConnectors
      }
    }
  }
  if (ElementUtils.hasOutgoingConnectors(element)) {
    contextPadEntries['delete-outgoing-connectors'] = {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: 'Delete outgoing connectors',
      action: {
        click: removeOutgoingConnectors
      }
    }
  }

  return contextPadEntries
}
