"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview find/replace widget', () => {
    const providerSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src', 'CsvEditorProvider.ts'), 'utf8');
    const webviewSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('renders two-row find/replace overlay controls', () => {
        assert_1.default.ok(providerSource.includes('id="findReplaceWidget"'));
        assert_1.default.ok(providerSource.includes('id="replaceToggle"'));
        assert_1.default.ok(providerSource.includes('id="findInput"'));
        assert_1.default.ok(providerSource.includes('id="replaceInput"'));
        assert_1.default.ok(providerSource.includes('id="findCaseToggle"'));
        assert_1.default.ok(providerSource.includes('id="findWordToggle"'));
        assert_1.default.ok(providerSource.includes('id="findRegexToggle"'));
        assert_1.default.ok(providerSource.includes('id="replaceCaseToggle"'));
        assert_1.default.ok(providerSource.includes('id="findPrev"'));
        assert_1.default.ok(providerSource.includes('id="findNext"'));
        assert_1.default.ok(providerSource.includes('id="findMenuButton"'));
        assert_1.default.ok(providerSource.includes('id="replaceOne"'));
        assert_1.default.ok(providerSource.includes('id="replaceAll"'));
    });
    (0, node_test_1.it)('supports find and replace keyboard shortcuts', () => {
        assert_1.default.ok(webviewSource.includes("key === 'f'"));
        assert_1.default.ok(webviewSource.includes("key === 'h'"));
        assert_1.default.ok(webviewSource.includes("e.key === 'F3'"));
        assert_1.default.ok(webviewSource.includes('openFindReplace(false);'));
        assert_1.default.ok(webviewSource.includes('openFindReplace(true);'));
        assert_1.default.ok(webviewSource.includes('if (findReplaceState.open && e.key === \'Escape\') {'));
        assert_1.default.ok(webviewSource.includes('if (e.key === \'Enter\') {'));
    });
    (0, node_test_1.it)('tracks disabled states for navigation and replace actions', () => {
        assert_1.default.ok(webviewSource.includes('findPrev.disabled = !hasMatches;'));
        assert_1.default.ok(webviewSource.includes('findNext.disabled = !hasMatches;'));
        assert_1.default.ok(webviewSource.includes('replaceOne.disabled = !hasQuery || !hasMatches;'));
        assert_1.default.ok(webviewSource.includes('replaceAll.disabled = !hasQuery || !hasMatches;'));
    });
    (0, node_test_1.it)('sends replace-all changes in a single batch message', () => {
        assert_1.default.ok(webviewSource.includes("type: 'replaceCells'"));
    });
    (0, node_test_1.it)('requests global match coordinates from the extension and handles async results', () => {
        assert_1.default.ok(webviewSource.includes("type: 'findMatches'"));
        assert_1.default.ok(webviewSource.includes("message.type === 'findMatchesResult'"));
    });
});
