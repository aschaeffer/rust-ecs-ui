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

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/1.png">]()

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/2.png">]()

[<img src="https://raw.githubusercontent.com/aschaeffer/rust-ecs-ui/master/docs/screenshots/3.png">]()


## Roadmap

### General

- [x] Integrate diagram-js
- [x] Fork diagram-js CSS styles

### Palette

- [x] Provide a customized palette
- [ ] Use Better Icons
- [ ] Resolve Palette-Entries from EntityTypeManager

### Context Pad

- [ ] Property: ContextPad: Add Shape and Connector (like in BPMN Editor)
- [ ] Use Flows in Flows (ContextPad: Jump Into // Double Click)

### Rendering

#### Flows

- [x] Allow multiple Flows in multiple tabs
- [x] Flow: Render non-obtrusive border around the diagram canvas
- [ ] Fetch Flow from GraphQL
- [ ] Special Rendering of Entity Instance of Type "Flow": Use the properties from the instance (not the type - bc there is no type)

#### Entities

- [x] Entity: Render Rounded Border
- [x] Entity: Migrate from Overlay to Renderer
- [ ] Entity: Symbol: Render SVG / Icon

#### Properties

- [x] Property: Migrate from Overlay to Renderer
- [x] Property/Connector: Hover Green if connection allowed
- [x] Property/Connector: Hover Red if no connection allowed
- [x] Property: Render Data Type
- [x] Property: Render Current Value
- [x] Property: Colorize Boolean Values
- [x] Property: Use different color for each data type
- [x] Property: Show that socket has connection (Thicker socket border)
- [ ] Property: Offset between sockets

#### Connectors

- [x] Connector: Show Preview during Connecting
- [x] Connector: Populate Relation Instances from Flow
- [x] Connector: Inject Business Object
- [x] Connector: ContextPad: Show Trash
- [x] Connector: Create: Cropping
- [x] Connector: Render Arrow
- [x] Connector: Render Bezier Curve
- [x] Connector: Colorize Line/Curve if data type can be detected
- [ ] Connector: Move Entity: Create new Relation
- [ ] Connector: Move: Cropping

## Type System

- [ ] Fetch EntityTypes from GraphQL
- [ ] Fetch RelationTypes from GraphQL
- [ ] Visualize the Type System
  - [ ] Entity Type
  - [ ] Relation Type
- [ ] Extend Schemas (EntityType + RelationType + Component) for Shapes
- [ ] Create / Edit Entity Types
- [ ] Create / Edit Relation Types

## Editing

- [ ] Entity: Property: Show & Edit Properties
- [ ] Connector: Property: Show & Edit Properties
- [ ] Property: Show & Edit Value

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
