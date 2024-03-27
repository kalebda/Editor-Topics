# Topic Tool

![Version of EditorJS that the plugin is compatible with](https://badgen.net/badge/Editor.js/v2.0/blue)

Provides Topic Blocks for the [Editor.js](https://ifmo.su/editor).

## Installation

Get the package

```shell
yarn add @kalebu2468/editorjs-topic
```

Include module at your application

```javascript
import Topic from "@editorjs/editorjs-topic";
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    topics: Topics,
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
    topics: {
      class: Topics,
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
| levels       | `number[]` | enabled topic levels       |
| defaultLevel | `number`   | default topic level        |

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    topics: {
     class: Topics,
        config: {
          placeholder: "Enter a Topic",
          levels: [1],
          defaultLevel: 1,
        },
    }
  }

  ...
});
```

## Output data

| Field | Type     | Description    |
| ----- | -------- | -------------- |
| text  | `string` | topic's text   |
| level | `number` | level of topic |

```json
{
  "type": "topic",
  "data": {
    "text": "Why Telegram is the best messenger",
    "level": 1
  }
}
```
