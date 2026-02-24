"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const module_1 = __importDefault(require("module"));
const originalRequire = module_1.default.prototype.require;
module_1.default.prototype.require = function (id) {
    if (id === 'vscode') {
        return {};
    }
    return originalRequire.apply(this, arguments);
};
const CsvEditorProvider_1 = require("../CsvEditorProvider");
(0, node_test_1.describe)('Reorder behavior', () => {
    (0, node_test_1.it)('reorders selected columns relative to unselected columns', () => {
        const order = CsvEditorProvider_1.CsvEditorProvider.__test.reorderIndexOrder(6, [1, 2], 5);
        assert_1.default.deepStrictEqual(order, [0, 3, 4, 1, 2, 5]);
    });
    (0, node_test_1.it)('moves selected columns to the beginning when dropped before first column', () => {
        const order = CsvEditorProvider_1.CsvEditorProvider.__test.reorderIndexOrder(6, [2, 3], 0);
        assert_1.default.deepStrictEqual(order, [2, 3, 0, 1, 4, 5]);
    });
    (0, node_test_1.it)('keeps order unchanged when dropping before the selected block itself', () => {
        const order = CsvEditorProvider_1.CsvEditorProvider.__test.reorderIndexOrder(5, [2, 3], 2);
        assert_1.default.deepStrictEqual(order, [0, 1, 2, 3, 4]);
    });
    (0, node_test_1.it)('normalizes duplicate and out-of-range indices', () => {
        const order = CsvEditorProvider_1.CsvEditorProvider.__test.reorderIndexOrder(5, [3, 3, -1, 99, 1], 5);
        assert_1.default.deepStrictEqual(order, [0, 2, 4, 1, 3]);
    });
    (0, node_test_1.it)('reorders rows by absolute row index', () => {
        const rows = [['r0'], ['r1'], ['r2'], ['r3'], ['r4']];
        const reordered = CsvEditorProvider_1.CsvEditorProvider.__test.reorderRows(rows, [1, 2], 4);
        assert_1.default.deepStrictEqual(reordered, [['r0'], ['r3'], ['r1'], ['r2'], ['r4']]);
    });
    (0, node_test_1.it)('reorders columns across all rows consistently', () => {
        const rows = [
            ['A', 'B', 'C', 'D'],
            ['1', '2', '3', '4']
        ];
        const reordered = CsvEditorProvider_1.CsvEditorProvider.__test.reorderColumns(rows, [1, 2], 4);
        assert_1.default.deepStrictEqual(reordered, [
            ['A', 'D', 'B', 'C'],
            ['1', '4', '2', '3']
        ]);
    });
});
