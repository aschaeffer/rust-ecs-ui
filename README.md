# Inexor Reactive Semantic Entity Component System - Flow Editor

[<img src="https://img.shields.io/badge/Language-Rust-brightgreen">]()
[<img src="https://img.shields.io/badge/Platforms-Linux%20%26%20Windows-brightgreen">]()
[<img src="https://img.shields.io/github/workflow/status/aschaeffer/rust-ecs-ui/inexor-ecs-flow-editor">](https://github.com/aschaeffer/rust-ecs-ui/actions?query=workflow%3Ainexor-ecs-flow-editor)
[<img src="https://img.shields.io/github/license/aschaeffer/rust-ecs-ui">](https://github.com/aschaeffer/rust-ecs-ui/blob/main/LICENSE)
[<img src="https://img.shields.io/discord/698219248954376256?logo=discord">](https://discord.com/invite/acUW8k7)

[<img src="https://img.shields.io/github/contributors/aschaeffer/rust-ecs-ui">]()
[<img src="https://img.shields.io/github/downloads/aschaeffer/rust-ecs-ui/total?color=brightgreen">]()
[<img src="https://img.shields.io/github/last-commit/aschaeffer/rust-ecs-ui">]()
[<img src="https://img.shields.io/github/issues/aschaeffer/rust-ecs-ui">]()
[<img src="https://img.shields.io/github/languages/code-size/aschaeffer/rust-ecs-ui">]()

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/public/assets/inexor_2.png">]()

Inexor is an open-source project which ???.

The main objective of this repository is the development of a editor for flows running on the reactive entity component system.

Inexor is licensed under the MIT license.

## About the Reactive Semantic Entity Component System

The `Reactive Semantic Entity Component System` is meant to be the core of the `game engine` which represents the
`game state` as the one and only truth using `entities` and `semantic relations` in a graph that controls and runs
the `game logic` using `reactive technologies`.

## About the Flow Editor

The Flow Editor is the frontend for the reactive ECS. Flows are shown visually with entity instances and it's
properties and the connectors between properties.

The Flow Editor builds upon a great library: diagram-js.

At a later point of development the same or a similar interface will be implemented within the 3D game world - 
the 3D Visual Scripting Editor of Inexor! The can be a really useful extension for map designers which can
combine entities in the 3D world with logical gates, mathematical or other operations.

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/overview.png">]()

### Palette

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/flow-palette.png">]()

### Entities

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/direct-editing.png">]()

* Rendering of sockets with data type and current value (if available)
* Rendering of the name and symbol (can be configured in the entity type)
* The entities can have an description (Direct editing)

### Connectors

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/autolayout-connectors.png">]()

* Auto-Layout + Bend-Points
* You can only connect compatible sockets
* The connectors can have an description (Direct editing)

### Context Actions

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/context-actions.png">]()

* Create Connectors
* Create Entity with Connection
* Delete Connectors
* Delete Entity Instances

## Roadmap

### General Integration

- [x] Integrate diagram-js

### General Styling

- [x] Fork diagram-js CSS styles
- [x] Show MiniMap

#### Fonts

- [x] https://github.com/bpmn-io/bpmn-font
- [x] Create an SVG icon font
- [x] https://github.com/tonsky/FiraCode
- [ ] https://game-icons.net/ --- https://github.com/game-icons/icons
- [ ] https://github.com/kiliman/operator-mono-lig
- [ ] https://www.recursive.design/
- [ ] https://icons.coreui.io/icons/

### Palette

- [x] Provide a customized palette
- [x] Resolve Palette-Entries from EntityTypeManager
- [x] Use SVG Icon Font
- [ ] Group Label

### Context Pad

- [x] ContextPad: Property: Add Shape and Connector (like in BPMN Editor)
- [x] ContextPad: Property: Sockets: Trash -> Remove the incoming/outgoing connector(s)
- [ ] ContextPad: Property: Outgoing Sockets: Provide a list of possible following entities

### Rendering

#### Flows

- [x] Allow multiple Flows in multiple tabs
- [x] Flow: Render non-obtrusive border around the diagram canvas
- [x] Synchronize Flow Data Structure with created/removed entities and connectors
- [x] Export Flow to JSON
- [x] Import Flow from Local JSON-File
- [x] Render: Virtual Flow Start Node
- [x] Render: Virtual Flow End Node
- [x] List of Flows
- [x] Do not load any flow at start
- [x] Make FlowManager a shared component
- [ ] Model: Add Properties / Sockets to Start Node / End Node
- [ ] Fetch Flow from GraphQL

#### Sub-Flows

- [ ] Flow: Render Entity Instance of Type "flow"
  - [ ] Use the properties from the instance (not from the type - bc there is no type)
- [ ] Flow: Interaction: Double-Click: Open / Focus Flow
- [ ] ContextPad: Icon for Jump Into Flow

#### Entities

- [x] Entity: Render Rounded Border
- [x] Entity: Migrate from Overlay to Renderer
- [x] Entity: Relayout all incoming and outgoing connectors with double click on the entity
- [x] Entity: Direct Editing: Description / Title
- [x] Entity: Direct Editing: Update Flow
- [x] Entity: Import/Export Positions (via properties: f2dx, f2dy)
- [x] Entity: Shape Styles & Rendering Comments
- [x] Entity: Symbol: Render Custom SVG by Filename
- [x] Entity: Symbol: Render Symbol Text using SVG Icon Font
- [x] Entity: Rule: Allow Resizing Comments
- [x] Entity: On Move: Set positions of the sockets
- [x] Entity: Import/Export Positions (via properties: f2dw, f2dh)
- [x] Entity: Shape Element Type: Render Property Value
- [x] Entity: Direct Editing: New Mode: One property can be defined as editable

#### Properties

- [x] Property: Migrate from Overlay to Renderer
- [x] Property/Connector: Hover Green if connection allowed
- [x] Property/Connector: Hover Red if no connection allowed
- [x] Property: Render Data Type
- [x] Property: Render Current Value
- [x] Property: Colorize Boolean Values
- [x] Property: Use different color for each data type
- [x] Property: Show that socket has connection (Thicker socket border)
- [x] Property: Interaction: Single Click: Open Context Pad
- [x] Property: Interaction: Double Click: Start connecting
- [x] Property: Direct Editing: Value
- [x] Property: Direct Editing: Update Flow
- [x] Property: Handle Data Type "any"
- [x] Property: Offset between sockets
- [ ] Property: On Move: Reset positions of the socket according to the entity

#### Connectors

- [x] Connector: Show Preview during Connecting
- [x] Connector: Populate Relation Instances from Flow
- [x] Connector: Inject Business Object
- [x] Connector: ContextPad: Show Trash
- [x] Connector: Create: Cropping
- [x] Connector: Render Arrow
- [x] Connector: Render Bezier Curve
- [x] Connector: Colorize Line/Curve if data type can be detected
- [x] Connector: Relayout with double click on the connector
- [x] Connector: Move: Cropping
- [x] Connector: Direct Editing: Description / Title
- [x] Connector: Direct Editing: Update Flow
- [x] Connector: Rule: Disallow Reconnect

#### Type System

- [x] Entity Types: Merge properties from Components
- [x] Relation Types: Merge properties from Components
- [ ] Flow: Merge properties from Components
- [x] Entity Types: Tolerant mode if entity type doesn't exist
- [x] Entity Types: Dynamic Imports
- [ ] Fetch EntityTypes from GraphQL
- [ ] Fetch RelationTypes from GraphQL
- [ ] Visualize the Type System (in another diagram.js based editor)
  - [ ] Component
  - [ ] Property Type
  - [ ] Entity Type
  - [ ] Relation Type
- [ ] Extend Schemas (EntityType + RelationType + Component) for Shapes
- [ ] Create / Edit Entity Types
- [ ] Create / Edit Relation Types

## Control ECS

- [ ] Log Appender
- [ ] Command Terminal
- [ ] JavaScript Terminal
- [ ] Build/Packaging -> Serve Flow Editor from HTTP-Server

## Resources

Found a list of event types (with explainations!) on some chinese server:

https://chowdera.com/2021/02/20210202154910914f.html

## Development

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
