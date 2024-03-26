# Topic Tool

![Version of EditorJS that the plugin is compatible with](https://badgen.net/badge/Editor.js/v2.0/blue)

Provides Headings Blocks for the [Editor.js](https://ifmo.su/editor).

## Installation

Get the package

```shell
yarn add @editorjs/topic
```

Include module at your application

```javascript
import Topic from "@editorjs/topic";
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    topic: Topic,
  },

  ...
});
```

## Shortcut

You can insert this Block by a useful shortcut. Set it up with the `tools[].shortcut` property of the Editor's initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    topic: {
      class: Topic,
    },
  },

  ...
});
```

## Config Params

All properties are optional.

| Field        | Type       | Description                |
| ------------ | ---------- | -------------------------- |
| placeholder  | `string`   | topic's placeholder string |
| levels       | `number[]` | enabled heading levels     |
| defaultLevel | `number`   | default heading level      |

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    topic: {
      class: Topic,
      config: {
        placeholder: 'Enter a topic',
        levels: [2, 3, 4],
        defaultLevel: 3
      }
    }
  }

  ...
});
```

## Output data

| Field | Type     | Description                                     |
| ----- | -------- | ----------------------------------------------- |
| text  | `string` | topic's text                                    |
| level | `number` | level of topic: 1 for H1, 2 for H2 ... 6 for H6 |

```json
{
  "type": "topic",
  "data": {
    "text": "Why Telegram is the best messenger",
    "level": 2
  }
}
```
