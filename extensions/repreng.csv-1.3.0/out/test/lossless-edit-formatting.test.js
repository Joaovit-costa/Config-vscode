"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const module_1 = __importDefault(require("module"));
// Stub 'vscode' prior to loading provider (theme checks)
const originalRequire = module_1.default.prototype.require;
module_1.default.prototype.require = function (id) {
    if (id === 'vscode') {
        return {
            window: { activeColorTheme: { kind: 1 } },
            ColorThemeKind: { Dark: 1 }
        };
    }
    return originalRequire.apply(this, arguments);
};
const CsvEditorProvider_1 = require("../CsvEditorProvider");
(0, node_test_1.describe)('Lossless edit formatting', () => {
    (0, node_test_1.it)('preserves untouched quotes and trailing spaces when editing a different cell', () => {
        const input = '"id","value","note"\r\n"1","FOOBAR / 0 ","keep"\r\n';
        const output = CsvEditorProvider_1.CsvEditorProvider.__test.applyFieldUpdatesPreservingFormat(input, ',', [
            { row: 1, col: 2, value: 'changed' }
        ]);
        assert_1.default.strictEqual(output, '"id","value","note"\r\n"1","FOOBAR / 0 ","changed"\r\n');
    });
    (0, node_test_1.it)('keeps quoted style for edited quoted fields', () => {
        const input = '"a","b"\n"left","right"\n';
        const output = CsvEditorProvider_1.CsvEditorProvider.__test.applyFieldUpdatesPreservingFormat(input, ',', [
            { row: 1, col: 1, value: 'updated' }
        ]);
        assert_1.default.strictEqual(output, '"a","b"\n"left","updated"\n');
    });
    (0, node_test_1.it)('supports multiple updates with non-comma separators', () => {
        const input = '"a"|b|c\n"x"|y|z\n';
        const output = CsvEditorProvider_1.CsvEditorProvider.__test.applyFieldUpdatesPreservingFormat(input, '|', [
            { row: 0, col: 1, value: 'B' },
            { row: 1, col: 2, value: 'Z' }
        ]);
        assert_1.default.strictEqual(output, '"a"|B|c\n"x"|y|Z\n');
    });
    (0, node_test_1.it)('returns undefined when any target field is out of range', () => {
        const input = 'a,b\n1,2\n';
        const output = CsvEditorProvider_1.CsvEditorProvider.__test.applyFieldUpdatesPreservingFormat(input, ',', [
            { row: 4, col: 0, value: 'x' }
        ]);
        assert_1.default.strictEqual(output, undefined);
    });
});
