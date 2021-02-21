import EntityInstanceFactory from '@/factory/EntityInstanceFactory'
// import ConnectorFactory from '@/factory/ConnectorFactory'

import { v4 as uuidv4 } from "uuid"

/**
 * The flow palette provider.
 */
export default function FlowPaletteProvider(
  create, elementFactory, handTool, lassoTool, spaceTool,
  globalConnect, palette) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._handTool = handTool;
  this._lassoTool = lassoTool;
  this._spaceTool = spaceTool;
  this._globalConnect = globalConnect;
  this._palette = palette;

  palette.registerProvider(this);
}

FlowPaletteProvider.$inject = [
  'create',
  'elementFactory','handTool',
  'lassoTool',
  'spaceTool',
  'globalConnect',
  'palette'
];


FlowPaletteProvider.prototype.getPaletteEntries = function() {
  let create = this._create,
    elementFactory = this._elementFactory,
    handTool = this._handTool,
    lassoTool = this._lassoTool,
    spaceTool = this._spaceTool,
    globalConnect = this._globalConnect;

  return {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: 'Activate Hand Tool',
      action: {
        click: function(event) {
          handTool.activateHand(event)
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event)
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Activate the create/remove space tool',
      action: {
        click: function(event) {
          spaceTool.activateSelection(event)
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create-and': {
      group: 'logical-gates',
      className: 'bpmn-icon-task-none',
      title: 'Create AND',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'and',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'create-or': {
      group: 'logical-gates',
      className: 'bpmn-icon-task-none',
      title: 'Create OR',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'or',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'logical-gates-separator': {
      group: 'logical-gates',
      separator: true
    },
    'create-add': {
      group: 'arithmetic-gates',
      className: 'bpmn-icon-task-none',
      title: 'Addition',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'add',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'create-sub': {
      group: 'arithmetic-gates',
      className: 'bpmn-icon-task-none',
      title: 'Subtraction',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'sub',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'create-mul': {
      group: 'arithmetic-gates',
      className: 'bpmn-icon-task-none',
      title: 'Multiplication',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'mul',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'arithmetic-gates-separator': {
      group: 'arithmetic-gates',
      separator: true
    },
    'create-greater-than': {
      group: 'comparison-gates',
      className: 'bpmn-icon-task-none',
      title: 'Greater Than',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'greater_than',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'comparison-gates-separator': {
      group: 'comparison-gates',
      separator: true
    },
    'create-to_string': {
      group: 'string-gates',
      className: 'bpmn-icon-task-none',
      title: 'To String',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'to_string',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'create-concat': {
      group: 'string-gates',
      className: 'bpmn-icon-task-none',
      title: 'Concat String',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'concat',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'string-gates-separator': {
      group: 'string-gates',
      separator: true
    },
    'create-value': {
      group: 'value',
      className: 'bpmn-icon-task-none',
      title: 'Create Const Value',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'value',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'value-separator': {
      group: 'value',
      separator: true
    },
    'perlin-noise-4d-value': {
      group: 'texture',
      className: 'bpmn-icon-task-none',
      title: 'Perlin Noise 4D',
      action: {
        click: function() {
          let shape = EntityInstanceFactory.createEntityInstance(
            elementFactory,
            'perlin_noise_4d',
            undefined,
            undefined,
            uuidv4()
          )
          create.start(event, shape)
        }
      }
    },
    'texture-separator': {
      group: 'texture',
      separator: true
    },
    'create-default-connector': {
      group: 'connect',
      className: 'bpmn-icon-connection',
      title: 'Create Default Connector',
      action: {
        click: function() {
          globalConnect.start(event)
        }
      }
    },
    // 'create-frame': {
    //     group: 'create',
    //     className: 'palette-icon-create-frame',
    //     title: 'Create Frame',
    //     action: {
    //         click: function() {
    //             var shape = elementFactory.createShape({
    //                 width: 300,
    //                 height: 200,
    //                 isFrame: true
    //             });
    //
    //             create.start(event, shape);
    //         }
    //     }
    // }
  }
}
