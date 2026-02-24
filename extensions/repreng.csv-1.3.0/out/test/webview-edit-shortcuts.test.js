"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview edit shortcuts', () => {
    const webviewSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('supports Shift+Enter to insert newline while editing', () => {
        assert_1.default.ok(webviewSource.includes('const insertNewlineAtCaret = cell => {'));
        assert_1.default.ok(webviewSource.includes("const NEWLINE_SENTINEL_ATTR = 'data-csv-newline-sentinel';"));
        assert_1.default.ok(webviewSource.includes("if (editingCell && e.key === 'Enter') {"));
        assert_1.default.ok(webviewSource.includes('if (e.shiftKey) {'));
        assert_1.default.ok(webviewSource.includes('insertNewlineAtCaret(editingCell)'));
        assert_1.default.ok(webviewSource.includes('appendVisibleNewlineAtEnd(editingCell)'));
    });
    (0, node_test_1.it)('supports Shift+Enter from selection on first press', () => {
        assert_1.default.ok(webviewSource.includes('if (!editingCell && anchorCell && currentSelection.length === 1) {'));
        assert_1.default.ok(webviewSource.includes('if (e.shiftKey) {'));
        assert_1.default.ok(webviewSource.includes('Shift+Enter from selection should open detail edit and insert'));
        assert_1.default.ok(webviewSource.includes('appendVisibleNewlineAtEnd(cell);'));
    });
    (0, node_test_1.it)('removes temporary newline sentinels before saving edited cell text', () => {
        assert_1.default.ok(webviewSource.includes('const removeNewlineSentinels = cell => {'));
        assert_1.default.ok(webviewSource.includes('removeNewlineSentinels(cell);'));
        assert_1.default.ok(webviewSource.includes("const value = cell.textContent;"));
    });
    (0, node_test_1.it)('keeps non-edit Tab navigation in sync with selection state', () => {
        assert_1.default.ok(webviewSource.includes("if (!editingCell && e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {"));
        assert_1.default.ok(webviewSource.includes('const nextCell = ensureRenderedCellByCoords(targetRow, targetCol);'));
        assert_1.default.ok(webviewSource.includes('setSingleSelection(nextCell);'));
        assert_1.default.ok(webviewSource.includes('const setSingleSelection = cell => {'));
    });
    (0, node_test_1.it)('commits edit-mode Enter and moves selection down without auto-entering edit mode', () => {
        assert_1.default.ok(webviewSource.includes('Editing Enter commits and moves selection down (no auto-edit).'));
        assert_1.default.ok(webviewSource.includes('const nextCell = ensureRenderedCellByCoords(targetRow, col);'));
        assert_1.default.ok(webviewSource.includes('setSingleSelection(nextCell);'));
    });
    (0, node_test_1.it)('commits edit-mode Tab and moves selection without auto-entering edit mode', () => {
        assert_1.default.ok(webviewSource.includes("if (editingCell && e.key === 'Tab') {"));
        assert_1.default.ok(webviewSource.includes('Editing Tab commits and moves selection only (no auto-edit).'));
        assert_1.default.ok(webviewSource.includes('const nextCell = canMove ? ensureRenderedCellByCoords(targetRow, targetCol) : null;'));
        assert_1.default.ok(webviewSource.includes('setSingleSelection(nextCell);'));
    });
    (0, node_test_1.it)('handles selection-mode paste as a grid operation', () => {
        assert_1.default.ok(webviewSource.includes("document.addEventListener('paste', e => {"));
        assert_1.default.ok(webviewSource.includes("type: 'pasteCells'"));
        assert_1.default.ok(webviewSource.includes('const selection = getDataSelectionBounds();'));
        assert_1.default.ok(webviewSource.includes("} else if (message.type === 'pasteApplied') {"));
        assert_1.default.ok(webviewSource.includes("selectRange({ row: startRow, col: startCol }, { row: endRow, col: endCol });"));
    });
});
