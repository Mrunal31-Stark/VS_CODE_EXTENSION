"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG_SERVER_SCRIPT_PATH = exports.SERVER_SCRIPT_PATH = exports.BUNDLED_PYTHON_SCRIPTS_DIR = exports.EXTENSION_ROOT_DIR = void 0;
const path = require("path");
const folderName = path.basename(__dirname);
exports.EXTENSION_ROOT_DIR = folderName === 'common' ? path.dirname(path.dirname(__dirname)) : path.dirname(__dirname);
exports.BUNDLED_PYTHON_SCRIPTS_DIR = path.join(exports.EXTENSION_ROOT_DIR, 'bundled');
exports.SERVER_SCRIPT_PATH = path.join(exports.BUNDLED_PYTHON_SCRIPTS_DIR, 'tool', `lsp_server.py`);
exports.DEBUG_SERVER_SCRIPT_PATH = path.join(exports.BUNDLED_PYTHON_SCRIPTS_DIR, 'tool', `_debug_server.py`);
//# sourceMappingURL=constants.js.map