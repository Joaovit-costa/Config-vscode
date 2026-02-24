"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const module_1 = __importDefault(require("module"));
// Stub 'vscode' theme checks
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
(0, node_test_1.describe)('Virtual row and cell invariants', () => {
    (0, node_test_1.it)('non-chunked: renders exactly one virtual row matching widest column', () => {
        const data = [
            ['a'],
            ['b', 'c', 'd']
        ];
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(data, /*treatHeader*/ false, /*addSerialIndex*/ false, /*hiddenRows*/ 0);
        // Should not use chunks for non-chunked data
        assert_1.default.strictEqual(chunks.length, 0);
        // Virtual row absolute index = offset (0) + nonHeaderRows.length (2)
        const virtualAbs = 2;
        // Expect a cell for each column up to widest (3)
        for (let c = 0; c < 3; c++) {
            const needle = `data-row="${virtualAbs}" data-col="${c}"`;
            assert_1.default.ok(tableHtml.includes(needle), `expected virtual cell presence: ${needle}`);
        }
        // And ensure there is no unexpected next column
        assert_1.default.ok(!tableHtml.includes(`data-row="${virtualAbs}" data-col="3"`));
    });
    (0, node_test_1.it)('chunked: appends one final chunk containing the virtual row', () => {
        const rows = Array.from({ length: 1500 }, (_, i) => [String(i + 1), 'x', 'y']);
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, /*treatHeader*/ false, /*addSerialIndex*/ false, /*hiddenRows*/ 0);
        // Initial table should not include the virtual row when chunked
        assert_1.default.ok(!tableHtml.includes('data-row="1500"'));
        // Two chunks: 500 remaining rows + 1 virtual row chunk
        assert_1.default.strictEqual(chunks.length, 2);
        const last = chunks[chunks.length - 1];
        // Virtual absolute row index equals number of data rows (startAbs = 0)
        const virtualAbs = 1500;
        for (let c = 0; c < 3; c++) {
            const needle = `data-row="${virtualAbs}" data-col="${c}"`;
            assert_1.default.ok(last.includes(needle), `expected virtual cell in chunk: ${needle}`);
        }
    });
    (0, node_test_1.it)('can hide the trailing virtual row for non-empty non-chunked data', () => {
        const data = [
            ['a'],
            ['b', 'c', 'd']
        ];
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(data, 
        /*treatHeader*/ false, 
        /*addSerialIndex*/ false, 
        /*hiddenRows*/ 0, 
        /*clickableLinks*/ true, 
        /*columnColorMode*/ 'type', 
        /*columnColorPalette*/ 'default', 
        /*showTrailingEmptyRow*/ false);
        assert_1.default.strictEqual(chunks.length, 0);
        assert_1.default.ok(!tableHtml.includes('data-row="2" data-col="0"'));
        assert_1.default.ok(!tableHtml.includes('data-row="2" data-col="1"'));
        assert_1.default.ok(!tableHtml.includes('data-row="2" data-col="2"'));
    });
    (0, node_test_1.it)('can hide the trailing virtual row for non-empty chunked data', () => {
        const rows = Array.from({ length: 1500 }, (_, i) => [String(i + 1), 'x', 'y']);
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, 
        /*treatHeader*/ false, 
        /*addSerialIndex*/ false, 
        /*hiddenRows*/ 0, 
        /*clickableLinks*/ true, 
        /*columnColorMode*/ 'type', 
        /*columnColorPalette*/ 'default', 
        /*showTrailingEmptyRow*/ false);
        assert_1.default.ok(!tableHtml.includes('data-row="1500"'));
        // Only one chunk should remain (rows 1000-1499). No final virtual-row chunk.
        assert_1.default.strictEqual(chunks.length, 1);
        assert_1.default.ok(!chunks[0].includes('data-row="1500"'));
    });
    (0, node_test_1.it)('still renders one editable row for empty data even when trailing row is disabled', () => {
        const rows = [];
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, 
        /*treatHeader*/ false, 
        /*addSerialIndex*/ false, 
        /*hiddenRows*/ 0, 
        /*clickableLinks*/ true, 
        /*columnColorMode*/ 'type', 
        /*columnColorPalette*/ 'default', 
        /*showTrailingEmptyRow*/ false);
        assert_1.default.strictEqual(chunks.length, 0);
        assert_1.default.ok(tableHtml.includes('data-row="0" data-col="0"'));
    });
    (0, node_test_1.it)('sizes serial index column from total row count for chunked data', () => {
        const rows = Array.from({ length: 12345 }, (_, i) => [String(i + 1), 'x']);
        const { tableHtml, chunks } = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, /*treatHeader*/ false, /*addSerialIndex*/ true, /*hiddenRows*/ 0);
        // Width should be based on total rows + virtual row (12346 -> 5 digits) plus 1ch padding => 6ch.
        assert_1.default.ok(tableHtml.includes('min-width: 6ch; max-width: 6ch;'));
        assert_1.default.ok(chunks.some(chunk => chunk.includes('min-width:6ch;max-width:6ch;') || chunk.includes('min-width: 6ch; max-width: 6ch;')));
    });
    (0, node_test_1.it)('link rendering respects clickableLinks toggle', () => {
        const rows = [['www.example.com/path?q=1']];
        const enabled = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, /*treatHeader*/ false, /*addSerialIndex*/ false, /*hiddenRows*/ 0, /*clickableLinks*/ true);
        const disabled = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, /*treatHeader*/ false, /*addSerialIndex*/ false, /*hiddenRows*/ 0, /*clickableLinks*/ false);
        assert_1.default.ok(enabled.tableHtml.includes('class="csv-link"'));
        assert_1.default.ok(enabled.tableHtml.includes('data-href="https://www.example.com/path?q=1"'));
        assert_1.default.ok(disabled.tableHtml.includes('www.example.com/path?q=1'));
        assert_1.default.ok(!disabled.tableHtml.includes('class="csv-link"'));
    });
    (0, node_test_1.it)('renders multiline cell values with preserved line breaks and wrap styling', () => {
        const rows = [['Hello\nWorld'], ['Another\nmulti-line\nvalue']];
        const rendered = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, 
        /*treatHeader*/ false, 
        /*addSerialIndex*/ false, 
        /*hiddenRows*/ 0, 
        /*clickableLinks*/ true);
        assert_1.default.ok(rendered.tableHtml.includes('white-space: pre-wrap;'));
        assert_1.default.ok(rendered.tableHtml.includes('overflow-wrap: anywhere;'));
        assert_1.default.ok(rendered.tableHtml.includes('Hello\nWorld'));
        assert_1.default.match(rendered.tableHtml, /title="Hello[\r\n]+World"/);
    });
    (0, node_test_1.it)('supports opt-in theme foreground column colors', () => {
        const rows = [['alpha', 'beta']];
        const themed = CsvEditorProvider_1.CsvEditorProvider.__test.generateTableAndChunksRaw(rows, 
        /*treatHeader*/ false, 
        /*addSerialIndex*/ false, 
        /*hiddenRows*/ 0, 
        /*clickableLinks*/ true, 
        /*columnColorMode*/ 'theme');
        assert_1.default.ok(themed.tableHtml.includes('color: var(--vscode-editor-foreground);'));
    });
});
