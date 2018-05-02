"use strict";

const version = require("./package.json").version;

const core = require("./src/main/core");
const getSupportInfo = require("./src/main/support").getSupportInfo;
const getFileInfo = require("./src/common/get-file-info");
const sharedUtil = require("./src/common/util-shared");
const loadPlugins = require("./src/common/load-plugins");

const config = require("./src/config/resolve-config");

const doc = require("./src/doc");

function withPlugins(fn, optionIndexInArgs) {
  // it is assumed that `opts` are the 2nd argument not defined
  if (typeof optionIndexInArgs !== "number") {
    optionIndexInArgs = 1;
  }
  return function() {
    const args = Array.from(arguments);
    const opts = args[optionIndexInArgs] || {};
    args[optionIndexInArgs] = Object.assign({}, opts, {
      plugins: loadPlugins(opts.plugins)
    });
    return fn.apply(null, args);
  };
}

const formatWithCursor = withPlugins(core.formatWithCursor);

module.exports = {
  formatWithCursor,

  format(text, opts) {
    return formatWithCursor(text, opts).formatted;
  },

  check: function(text, opts) {
    try {
      const formatted = formatWithCursor(text, opts).formatted;
      return formatted === text;
    } catch (e) {
      return false;
    }
  },

  doc,

  resolveConfig: config.resolveConfig,
  resolveConfigFile: config.resolveConfigFile,
  clearConfigCache: config.clearCache,

  getFileInfo: withPlugins(getFileInfo, 0),
  getSupportInfo: withPlugins(getSupportInfo),

  version,

  util: sharedUtil,

  /* istanbul ignore next */
  __debug: {
    parse: withPlugins(core.parse),
    formatAST: withPlugins(core.formatAST),
    formatDoc: withPlugins(core.formatDoc),
    printToDoc: withPlugins(core.printToDoc),
    printDocToString: withPlugins(core.printDocToString)
  }
};
