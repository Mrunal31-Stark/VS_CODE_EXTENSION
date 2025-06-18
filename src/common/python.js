"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVersion = exports.runPythonExtensionCommand = exports.getDebuggerPath = exports.getInterpreterDetails = exports.resolveInterpreter = exports.initializePython = exports.onDidChangePythonInterpreter = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const vscode_1 = require("vscode");
const logging_1 = require("./log/logging");
const python_extension_1 = require("@vscode/python-extension");
const onDidChangePythonInterpreterEvent = new vscode_1.EventEmitter();
exports.onDidChangePythonInterpreter = onDidChangePythonInterpreterEvent.event;
let _api;
async function getPythonExtensionAPI() {
    if (_api) {
        return _api;
    }
    _api = await python_extension_1.PythonExtension.api();
    return _api;
}
async function initializePython(disposables) {
    try {
        const api = await getPythonExtensionAPI();
        if (api) {
            disposables.push(api.environments.onDidChangeActiveEnvironmentPath((e) => {
                onDidChangePythonInterpreterEvent.fire({ path: [e.path], resource: e.resource?.uri });
            }));
            (0, logging_1.traceLog)('Waiting for interpreter from python extension.');
            onDidChangePythonInterpreterEvent.fire(await getInterpreterDetails());
        }
    }
    catch (error) {
        (0, logging_1.traceError)('Error initializing python: ', error);
    }
}
exports.initializePython = initializePython;
async function resolveInterpreter(interpreter) {
    const api = await getPythonExtensionAPI();
    return api?.environments.resolveEnvironment(interpreter[0]);
}
exports.resolveInterpreter = resolveInterpreter;
async function getInterpreterDetails(resource) {
    const api = await getPythonExtensionAPI();
    const environment = await api?.environments.resolveEnvironment(api?.environments.getActiveEnvironmentPath(resource));
    if (environment?.executable.uri && checkVersion(environment)) {
        return { path: [environment?.executable.uri.fsPath], resource };
    }
    return { path: undefined, resource };
}
exports.getInterpreterDetails = getInterpreterDetails;
async function getDebuggerPath() {
    const api = await getPythonExtensionAPI();
    return api?.debug.getDebuggerPackagePath();
}
exports.getDebuggerPath = getDebuggerPath;
async function runPythonExtensionCommand(command, ...rest) {
    await getPythonExtensionAPI();
    return await vscode_1.commands.executeCommand(command, ...rest);
}
exports.runPythonExtensionCommand = runPythonExtensionCommand;
function checkVersion(resolved) {
    const version = resolved?.version;
    if (version?.major === 3 && version?.minor >= 8) {
        return true;
    }
    (0, logging_1.traceError)(`Python version ${version?.major}.${version?.minor} is not supported.`);
    (0, logging_1.traceError)(`Selected python path: ${resolved?.executable.uri?.fsPath}`);
    (0, logging_1.traceError)('Supported versions are 3.8 and above.');
    return false;
}
exports.checkVersion = checkVersion;
//# sourceMappingURL=python.js.map