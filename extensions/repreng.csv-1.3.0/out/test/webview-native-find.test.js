"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview custom find integration', () => {
    const extensionSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src', 'extension.ts'), 'utf8');
    const providerSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src', 'CsvEditorProvider.ts'), 'utf8');
    const webviewScript = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('does not enable native webview find widget', () => {
        assert_1.default.ok(!extensionSource.includes('enableFindWidget: true'));
    });
    (0, node_test_1.it)('renders the custom in-webview find/replace controls', () => {
        assert_1.default.ok(providerSource.includes('id="findReplaceWidget"'));
        assert_1.default.ok(providerSource.includes('id="findInput"'));
        assert_1.default.ok(providerSource.includes('id="replaceInput"'));
        assert_1.default.ok(providerSource.includes('id="findNext"'));
        assert_1.default.ok(providerSource.includes("case 'findMatches':"));
        assert_1.default.ok(providerSource.includes("type: 'findMatchesResult'"));
    });
    (0, node_test_1.it)('handles Ctrl/Cmd+F and Ctrl/Cmd+H in the webview script', () => {
        assert_1.default.ok(webviewScript.includes("key === 'f'"));
        assert_1.default.ok(webviewScript.includes("key === 'h'"));
        assert_1.default.ok(webviewScript.includes('openFindReplace(false);'));
        assert_1.default.ok(webviewScript.includes('openFindReplace(true);'));
    });
});
