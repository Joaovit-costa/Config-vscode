"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview reorder and resize interactions', () => {
    const source = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('starts reorder only from preselected header or row-index cells', () => {
        assert_1.default.ok(source.includes('startReorderDrag'));
        assert_1.default.ok(source.includes('target.classList.contains(\'selected\')'));
        assert_1.default.ok(source.includes('!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && startReorderDrag(target, e)'));
    });
    (0, node_test_1.it)('posts reorder messages for columns and rows', () => {
        assert_1.default.ok(source.includes("type: 'reorderColumns'"));
        assert_1.default.ok(source.includes("type: 'reorderRows'"));
    });
    (0, node_test_1.it)('supports drag-resize for columns and rows', () => {
        assert_1.default.ok(source.includes('startResizeDrag'));
        assert_1.default.ok(source.includes('col-resize'));
        assert_1.default.ok(source.includes('row-resize'));
    });
    (0, node_test_1.it)('resets resized column/row on edge double-click', () => {
        assert_1.default.ok(source.includes('getResizeEdgeInfo'));
        assert_1.default.ok(source.includes('table.addEventListener(\'dblclick\''));
        assert_1.default.ok(source.includes('resetColumnWidth(edge.index)'));
        assert_1.default.ok(source.includes('resetRowHeight(edge.index)'));
    });
});
