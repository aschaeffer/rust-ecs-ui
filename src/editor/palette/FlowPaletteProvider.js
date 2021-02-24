import { v4 as uuidv4 } from "uuid"

/**
 * The flow palette provider.
 */
export default function FlowPaletteProvider(
  palette,
  create,
  handTool, lassoTool, spaceTool,
  globalConnect,
  entityTypeManager, entityInstanceFactory
) {
  this._palette = palette
  this._create = create
  this._handTool = handTool
  this._lassoTool = lassoTool
  this._spaceTool = spaceTool
  this._globalConnect = globalConnect
  this._entityTypeManager = entityTypeManager
  this._entityInstanceFactory = entityInstanceFactory

  palette.registerProvider(this);
}

FlowPaletteProvider.$inject = [
  'palette',
  'create',
  'handTool',
  'lassoTool',
  'spaceTool',
  'globalConnect',
  'entityTypeManager',
  'entityInstanceFactory'
]

FlowPaletteProvider.prototype.getToolEntries = function () {
  let handTool = this._handTool
  let lassoTool = this._lassoTool
  let spaceTool = this._spaceTool

  return {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: 'Activate Hand Tool',
      action: {
        click: function (event) {
          handTool.activateHand(event)
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click: function (event) {
          lassoTool.activateSelection(event)
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Activate the create/remove space tool',
      action: {
        click: function (event) {
          spaceTool.activateSelection(event)
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },

  }
}

FlowPaletteProvider.prototype.getEntityEntries = function() {
  let create = this._create

  // eslint-disable-next-line no-unused-vars
  let self = this
  let createInstance = function (entityTypeName) {
    let shape = self._entityInstanceFactory.createEntityInstance(
      entityTypeName,
      undefined,
      undefined,
      uuidv4()
    )
    create.start(event, shape)
  }


  let paletteEntries = {}

  // console.log(EntityTypeManager.getGroupNames())
  let groups = this._entityTypeManager.getGroupNames()
  // groups.map(EntityTypeManager.getEntityTypesByGroupName).forEach(entityType => console.log(entityType))

  groups.forEach(group => {
    let types = this._entityTypeManager.getEntityTypesByGroupName(group)
    types.forEach(type => {
      let paletteEntry = {
        group,
        title: type.description || `Create ${type.name}`,
        className: 'bpmn-icon-task-none',
        action: {
          click: () => createInstance(type.name)
        }
      }
      if (Object.getOwnPropertyDescriptor(type, 'palette')) {

        if (Object.getOwnPropertyDescriptor(type.palette, 'imgUrl')) {
          paletteEntry.html = `<div class="entry" draggable="true"><img style="position: absolute; left: 0; top: -44px; width: 18px; height: 18px; padding: 4px;" class="position-relative" src="${type.palette.imgUrl}" /></div>`
        }
        if (Object.getOwnPropertyDescriptor(type.palette, 'content')) {
          paletteEntry.html = `<div class="entry" draggable="true"><div style="position: relative; left: 0; top: -44px; text-align: center; font-size: 14px;">${type.palette.content}</div></div>`
          delete type.palette.className
        } else if (Object.getOwnPropertyDescriptor(type.palette, 'className')) {
          paletteEntry.className = type.palette.className
        }
        paletteEntry = Object.assign(paletteEntry, type.palette)
      }
      // console.log(paletteEntry)
      paletteEntries[`create-${type.name}`] = paletteEntry
    })
    paletteEntries[`create-${group}-separator`] = {
      group,
      separator: true
    }
  })
  return paletteEntries
}

FlowPaletteProvider.prototype.getConnectorEntries = function() {
  let globalConnect = this._globalConnect
  let group = 'connector'
  return {
    'create-default-connector': {
      group,
      className: 'bpmn-icon-connection',
      title: 'Create Default Connector',
      action: {
        click: function () {
          globalConnect.start(event)
        }
      }
    },
    'connector-separator': {
      group,
      separator: true
    }
  }
}

FlowPaletteProvider.prototype.getPaletteEntries = function() {
  let paletteEntries = {}
  Object.assign(paletteEntries, this.getToolEntries())
  Object.assign(paletteEntries, this.getConnectorEntries())
  Object.assign(paletteEntries, this.getEntityEntries())
  return paletteEntries
}
