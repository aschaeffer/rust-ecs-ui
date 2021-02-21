import ElementUtils from '@/utils/ElementUtils'

export default function ConnectorContextPadProvider(contextPad, modeling) {
  this._modeling = modeling
  contextPad.registerProvider(this)
}

ConnectorContextPadProvider.$inject = [
  'contextPad',
  'modeling'
]

ConnectorContextPadProvider.prototype.getContextPadEntries = function (element) {
  if (!ElementUtils.isDefaultConnector(element)) {
    return {}
  }

  let modeling = this._modeling

  let removeElement = () => {
    modeling.removeElements([ element ])
  }

  return {
    'delete': {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: 'Remove',
      action: {
        click: removeElement,
        dragstart: removeElement
      }
    }
  }

}
