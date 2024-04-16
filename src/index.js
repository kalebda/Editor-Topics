import "./index.css";
/**
 * @typedef {object} TopicData
 * @description Tool's input and output data format
 * @property {string} text — Topic's content
 * @property {number} level - Topic's level from 1 to 6
 */

/**
 * @typedef {object} TopicConfig
 * @description Tool's config from Editor
 * @property {string} placeholder — Block's placeholder
 * @property {number[]} levels — Topic levels
 * @property {number} defaultLevel — default level
 */

/**
 * Topic block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
export default class Topics {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: TopicData, config: TopicConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-topic",
    };
    /**
     * Tool's settings passed from Editor
     *
     * @type {TopicConfig}
     * @private
     */
    this._settings = config;

    /**
     * Block's data
     *
     * @type {TopicData}
     * @private
     */
    this._data = this.normalizeData(data);
    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = null;
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  /**
   * Normalize input data
   *
   * @param {TopicData} data - saved data to process
   *
   * @returns {TopicData}
   * @private
   */
  normalizeData(data) {
    const newData = {};

    if (typeof data !== "object") {
      data = {};
    }

    newData.text = data.text || "";
    newData.level = parseInt(data.level) || this.defaultLevel.number;

    return newData;
  }

  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete") {
      return;
    }

    const { textContent } = this._element;

    if (textContent === "") {
      this._element.innerHTML = "";
    }
  }

  renderSettings() {
    const wrapper = document.createElement("div");
    return wrapper;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLTopicElement}
   * @public
   */
  render() {
    this._element = this.getTag();
    return this._element;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {TopicData} data - saved data to merger with current block
   * @public
   */
  merge(data) {
    const newData = {
      text: this.data.text + data.text,
      level: this.data.level,
    };

    this.data = newData;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLTopicElement} toolsContent - Text tools rendered view
   * @returns {TopicData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number,
    };
  }

  /**
   * Allow Topic to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: "text", // use 'text' property for other blocks
      import: "text", // fill 'text' property from other block's export string
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {},
    };
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   *
   * @returns {TopicData} Current data
   * @private
   */
  get data() {
    this._data.text = this._element.innerHTML;
    this._data.level = this.currentLevel.number;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {TopicData} data — data to set
   * @private
   */
  set data(data) {
    this._data = this.normalizeData(data);

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLTopicElement}
       */
      const newTopic = this.getTag();

      /**
       * Save Block's content
       */
      newTopic.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newTopic, this._element);

      /**
       * Save new block to private variable
       *
       * @type {HTMLTopicElement}
       * @private
       */
      this._element = newTopic;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || "";
    }
  }

  createPopUp() {
    // Create main div
    const mainDiv = document.createElement("div");
    mainDiv.classList.add(
      "ce-example__content",
      "ce-example__content--with-bg",
      "_ce-example__content--small"
    );

    // Create div for popup
    const popupDiv = document.createElement("div");
    popupDiv.classList.add("ce-example-popup");

    // Create overlay div
    const overlayDiv = document.createElement("div");
    overlayDiv.classList.add("ce-example-popup__overlay");
    popupDiv.appendChild(overlayDiv);

    // Create popup content div
    const popupContentDiv = document.createElement("div");
    popupContentDiv.classList.add("ce-example-popup__popup");

    //Add a Title
    const title = document.createElement("div");
    title.classList.add("ce-example-popup__title");
    title.textContent = "Create a Topic"; // Set the text content of the title
    popupContentDiv.appendChild(title);
    // Create input element
    const input = document.createElement("input");
    input.classList.add("ce-example--popup__input");
    popupContentDiv.appendChild(input);
    input.placeholder = "Topic Title";
    //create action containers
    const actionContainerDiv = document.createElement("div");
    actionContainerDiv.classList.add("ce-example--action__container");
    // Create OK button
    const okButton = document.createElement("button");
    okButton.classList.add("ce-example--action__ok");
    okButton.textContent = "OK";
    actionContainerDiv.appendChild(okButton);
    // Add event listener to pass the input value on OK button click
    okButton.addEventListener("click", () => {
      const inputValue = input.value;
      if (inputValue) {
        this.data = { text: inputValue, level: this.currentLevel };
      } else {
        this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
      }
      // Remove the popup from the DOM
      mainDiv.remove();
    });
    // Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("ce-example--action__delete");
    cancelButton.textContent = "Cancel";
    actionContainerDiv.appendChild(cancelButton);
    // Add event listener to close the popup on cancel button click
    cancelButton.addEventListener("click", function () {
      // Remove the popup from the DOM
      mainDiv.remove();
    });

    //append action container to popup content
    popupContentDiv.appendChild(actionContainerDiv);
    // Append popup content div to popup div
    popupDiv.appendChild(popupContentDiv);

    // Append popup div to main div
    mainDiv.appendChild(popupDiv);
    document.body.appendChild(mainDiv);
  }

  /**
   * Get tag for target level
   * By default returns second-leveled Topic
   *
   * @returns {HTMLElement}
   */
  getTag() {
    /**
     * Create element for current Block's level
     */
    if (!this._data.text) {
      this.createPopUp();
      const tag = document.createElement("DIV");
      tag.innerHTML = "";
      return tag;
    } else {
      if (!this.readOnly) {
        const tag = document.createElement(this.currentLevel.tag);
        /**
         * Add text to block
         */
        tag.innerHTML = this._data.text || "";
        /**
         * Add styles class
         */
        tag.classList.add(this._CSS.wrapper);

        /**
         * Add Placeholder
         */
        tag.dataset.placeholder = this.api.i18n.t(
          this._settings.placeholder || ""
        );
        tag.contentEditable = this.readOnly ? "false" : "true";
        tag.addEventListener("keyup", this.onKeyUp);
        return tag;
      } else {
        return this._element;
      }
    }
  }

  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel() {
    let level = this.levels.find(
      (levelItem) => levelItem.number === this._data.level
    );

    if (!level) {
      level = this.defaultLevel;
    }
    return level;
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {TopicData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData) {
    return blockData.text.trim() !== "";
  }

  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel() {
    /**
     * User can specify own default level value
     */
    if (this._settings.defaultLevel) {
      const userSpecified = this.levels.find((levelItem) => {
        return levelItem.number === this._settings.defaultLevel;
      });

      if (userSpecified) {
        return userSpecified;
      } else {
        console.warn(
          "(ง'̀-'́)ง Topic Tool: the default level specified was not found in available levels"
        );
      }
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {level}
     */
    return this.levels[0];
  }

  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */

  /**
   * Available Topic levels
   *
   * @returns {level[]}
   */
  get levels() {
    const availableLevels = [
      {
        number: 1,
        tag: "H1",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
      },
    ];

    return this._settings.levels
      ? availableLevels.filter((l) => this._settings.levels.includes(l.number))
      : availableLevels;
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with Topic Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;

    /**
     * Define default level value
     *
     * @type {number}
     */
    let level = this.defaultLevel.number;

    switch (content.tagName) {
      case "H1":
        level = 1;
        break;
      case "H2":
        level = 2;
        break;
      case "H3":
        level = 3;
        break;
      case "H4":
        level = 4;
        break;
      case "H5":
        level = 5;
        break;
      case "H6":
        level = 6;
        break;
    }

    if (this._settings.levels) {
      // Fallback to nearest level when specified not available
      level = this._settings.levels.reduce((prevLevel, currLevel) => {
        return Math.abs(currLevel - level) < Math.abs(prevLevel - level)
          ? currLevel
          : prevLevel;
      });
    }

    this.data = {
      level,
      text: content.innerHTML,
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["H1"],
    };
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
      title: "Topics",
    };
  }
}
