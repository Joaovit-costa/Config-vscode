"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview link interactions', () => {
    const source = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('opens links only on Ctrl/Cmd+click', () => {
        assert_1.default.ok(source.includes("closest('.csv-link[data-href]')"));
        assert_1.default.ok(source.includes("link.getAttribute('data-href')"));
        assert_1.default.ok(source.includes('if (!(e.ctrlKey || e.metaKey)) {'));
        assert_1.default.ok(source.includes('if (e.detail === 1) {'));
        assert_1.default.ok(source.includes('postOpenLink(link);'));
    });
    (0, node_test_1.it)('treats right-click on link text as cell context menu', () => {
        assert_1.default.ok(source.includes("table.addEventListener('contextmenu', e => {"));
        assert_1.default.ok(source.includes('const target = getCellTarget(e.target);'));
    });
    (0, node_test_1.it)('keeps regular click selection behavior on URL cells', () => {
        assert_1.default.ok(source.includes('if (link && (e.ctrlKey || e.metaKey)) {'));
        assert_1.default.ok(source.includes('const target = getCellTarget(e.target);'));
    });
});
