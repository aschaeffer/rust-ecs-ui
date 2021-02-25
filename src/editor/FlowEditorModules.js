import FlowContextPadProviders from '@/editor/context-pad'
import FlowDirectEditingProviders from '@/editor/direct-editing'
import FlowLayoutModule from '@/editor/layout'
import FlowPaletteProvider from '@/editor/palette'
import FlowRuleProvider from '@/editor/rule'
import FlowRenderers from '@/editor/renderer'
import FlowManagers from '@/manager'
import FlowFactories from '@/factory'

import HandToolModule from 'diagram-js/lib/features/hand-tool'
import KeyboardMoveModule from 'diagram-js/lib/features/keyboard-move-selection'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll'
import SpaceTool from 'diagram-js/lib/features/space-tool'
import AutoPlaceModule from 'diagram-js/lib/features/auto-place'
import AlignElementsModule from 'diagram-js/lib/features/align-elements'
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll'
import BendpointsModule from 'diagram-js/lib/features/bendpoints'
import CanvasCreate from 'diagram-js/lib/features/create'
import ConnectModule from 'diagram-js/lib/features/connect'
import ContextPadModule from 'diagram-js/lib/features/context-pad'
import CreateModule from 'diagram-js/lib/features/create'
import LassoToolModule from 'diagram-js/lib/features/lasso-tool'
import ModelingModule from 'diagram-js/lib/features/modeling'
import MoveModule from 'diagram-js/lib/features/move'
import OutlineModule from 'diagram-js/lib/features/outline'
import PaletteModule from 'diagram-js/lib/features/palette'
import ResizeModule from 'diagram-js/lib/features/resize'
import RulesModule from 'diagram-js/lib/features/rules'
import SelectionModule from 'diagram-js/lib/features/selection'
import CopyPasteModule from 'diagram-js/lib/features/copy-paste'
import OverlaysModule from 'diagram-js/lib/features/overlays'
import GlobalConnectModule from 'diagram-js/lib/features/global-connect'
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview'
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping'
import GridSnappingVisualsModule from 'diagram-js/lib/features/grid-snapping/visuals'
import ClipboardModule from 'diagram-js/lib/features/clipboard'
// import DistributeElementsModule from 'diagram-js/lib/features/distribute-elements'
import DirectEditingModule from 'diagram-js-direct-editing/index'
// import PreviewSupportModule from 'diagram-js/lib/features/preview-support'
import MiniMapModule from 'diagram-js-minimap'

/**
 * A module that changes the default diagram look.
 */
const ElementStyleModule = {
  __init__: [
    [
      'defaultRenderer', function(defaultRenderer) {
          // override default styles
          defaultRenderer.CONNECTION_STYLE = {
            fill: 'none',
            strokeDasharray: 4,
            strokeWidth: 1,
            stroke: '#000'
          };
          defaultRenderer.SHAPE_STYLE = {
            fill: 'none',
            stroke: '#000',
            strokeWidth: 1,

          };
          defaultRenderer.FRAME_STYLE = {
            fill: 'none',
            stroke: '#000',
            strokeDasharray: 4,
            strokeWidth: 2
          };
      },
    ]
  ]
}

const interactionModules = [
  HandToolModule,
  KeyboardMoveModule,
  MoveCanvasModule,
  ZoomScrollModule,
  SpaceTool
]

// default modules provided by the toolbox
const builtinModules = [
  AutoPlaceModule,
  AlignElementsModule,
  AutoScrollModule,
  BendpointsModule,
  CanvasCreate,
  ConnectModule,
  ContextPadModule,
  CreateModule,
  LassoToolModule,
  ModelingModule,
  MoveModule,
  OutlineModule,
  PaletteModule,
  ResizeModule,
  RulesModule,
  SelectionModule,
  CopyPasteModule,
  OverlaysModule,
  GlobalConnectModule,
  ConnectionPreviewModule,
  GridSnappingModule,
  GridSnappingVisualsModule,
  ClipboardModule,
  // DistributeElementsModule,
  DirectEditingModule,
  MiniMapModule
]

// our own modules, contributing controls, customizations, and more
const customModules = [
  FlowContextPadProviders,
  FlowDirectEditingProviders,
  FlowLayoutModule,
  FlowPaletteProvider,
  FlowRuleProvider,
  FlowRenderers,
  FlowManagers,
  FlowFactories,
  ElementStyleModule
]

export default [
  ...builtinModules,
  ...interactionModules,
  ...customModules
]
