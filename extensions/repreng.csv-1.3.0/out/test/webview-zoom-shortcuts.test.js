"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview zoom interactions', () => {
    const providerSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src', 'CsvEditorProvider.ts'), 'utf8');
    const webviewSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('passes zoom settings from provider to webview root dataset', () => {
        assert_1.default.ok(providerSource.includes('data-wheelzoomenabled="${mouseWheelZoomEnabled ? \'1\' : \'0\'}"'));
        assert_1.default.ok(providerSource.includes('data-wheelzoominvert="${mouseWheelZoomInvert ? \'1\' : \'0\'}"'));
    });
    (0, node_test_1.it)('handles Ctrl/Cmd zoom keyboard shortcuts (+, -, 0)', () => {
        assert_1.default.ok(webviewSource.includes('const maybeHandleZoomShortcut = e => {'));
        assert_1.default.ok(webviewSource.includes("const isZoomInShortcut = e => e.code === 'NumpadAdd' || e.key === '+' || e.key === '=';"));
        assert_1.default.ok(webviewSource.includes("const isZoomOutShortcut = e => e.code === 'NumpadSubtract' || e.key === '-' || e.key === '_';"));
        assert_1.default.ok(webviewSource.includes("const isZoomResetShortcut = e => e.key === '0';"));
        assert_1.default.ok(webviewSource.includes('if (maybeHandleZoomShortcut(e)) {'));
    });
    (0, node_test_1.it)('handles Ctrl/Cmd mouse wheel zoom and supports invert direction', () => {
        assert_1.default.ok(webviewSource.includes('const MOUSE_WHEEL_ZOOM_ENABLED = root?.dataset?.wheelzoomenabled !== \'0\';'));
        assert_1.default.ok(webviewSource.includes('const MOUSE_WHEEL_ZOOM_INVERTED = root?.dataset?.wheelzoominvert === \'1\';'));
        assert_1.default.ok(webviewSource.includes('const handleZoomWheel = e => {'));
        assert_1.default.ok(webviewSource.includes('const direction = MOUSE_WHEEL_ZOOM_INVERTED ? -naturalDirection : naturalDirection;'));
        assert_1.default.ok(webviewSource.includes("window.addEventListener('wheel', handleZoomWheel, { passive: false });"));
    });
});
