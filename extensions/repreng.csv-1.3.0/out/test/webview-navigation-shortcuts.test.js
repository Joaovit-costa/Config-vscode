"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview navigation shortcuts', () => {
    const webviewScript = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('does not hijack Ctrl/Cmd+PageUp or Ctrl/Cmd+PageDown', () => {
        assert_1.default.ok(!webviewScript.includes("'Home','End','PageUp','PageDown'"));
        assert_1.default.ok(webviewScript.includes("'Home','End'"));
    });
});
