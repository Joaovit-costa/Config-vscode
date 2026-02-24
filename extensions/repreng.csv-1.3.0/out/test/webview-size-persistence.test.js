"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview size persistence', () => {
    const source = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('persists column and row sizes in webview state', () => {
        assert_1.default.ok(source.includes('columnSizes: { ...columnSizeState }'));
        assert_1.default.ok(source.includes('rowSizes: { ...rowSizeState }'));
        assert_1.default.ok(source.includes('zoomScale'));
    });
    (0, node_test_1.it)('restores and reapplies size state after render/chunk loads', () => {
        assert_1.default.ok(source.includes('columnSizeState = normalizeSizeState(st.columnSizes, 40);'));
        assert_1.default.ok(source.includes('rowSizeState = normalizeSizeState(st.rowSizes, getMinRowHeight());'));
        assert_1.default.ok(source.includes('setZoomScale(restoredZoom ?? 1, false);'));
        assert_1.default.ok(source.includes('applySizeStateToRenderedCells();'));
    });
    (0, node_test_1.it)('updates in-memory size maps when resizing', () => {
        assert_1.default.ok(source.includes('columnSizeState[String(col)] = width;'));
        assert_1.default.ok(source.includes('rowSizeState[String(row)] = height;'));
        assert_1.default.ok(source.includes('Math.max(getMinRowHeight(), Math.round(heightPx))'));
    });
    (0, node_test_1.it)('derives a dynamic minimum row height from configured font size', () => {
        assert_1.default.ok(source.includes('const BASE_FONT_SIZE_PX ='));
        assert_1.default.ok(source.includes('const ZOOM_MIN = 0.5;'));
        assert_1.default.ok(source.includes('const ZOOM_MAX = 3.0;'));
        assert_1.default.ok(source.includes('const getMinRowHeight = () => Math.max(22, Math.round(BASE_FONT_SIZE_PX * zoomScale * 1.6));'));
    });
    (0, node_test_1.it)('removes size overrides from state when reset to defaults', () => {
        assert_1.default.ok(source.includes('delete columnSizeState[String(col)];'));
        assert_1.default.ok(source.includes('delete rowSizeState[String(row)];'));
    });
});
