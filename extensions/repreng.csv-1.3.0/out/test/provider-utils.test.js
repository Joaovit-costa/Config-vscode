"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const module_1 = __importDefault(require("module"));
// Stub the 'vscode' module used by extension.ts so it can be imported in a
// regular Node environment. Only the utilities are tested here so an empty
// object is sufficient.
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
(0, node_test_1.describe)('CsvEditorProvider utility methods', () => {
    (0, node_test_1.it)('computeColumnWidths returns max length per column', () => {
        const data = [
            ['a', 'bb', 'ccc'],
            ['dddd', 'ee', 'f']
        ];
        const widths = CsvEditorProvider_1.CsvEditorProvider.__test.computeColumnWidths(data);
        assert_1.default.deepStrictEqual(widths, [4, 2, 3]);
    });
    (0, node_test_1.it)('formatCellContent linkifies allowed URLs when enabled', () => {
        const format = CsvEditorProvider_1.CsvEditorProvider.__test.formatCellContent;
        const html = format('See https://example.com?a=1&b=2 and mailto:user@example.com', true);
        assert_1.default.ok(html.includes('class="csv-link"'));
        assert_1.default.ok(html.includes('data-href="https://example.com?a=1&amp;b=2"'));
        assert_1.default.ok(html.includes('data-href="mailto:user@example.com"'));
        assert_1.default.ok(html.includes('https://example.com?a=1&amp;b=2'));
    });
    (0, node_test_1.it)('formatCellContent linkifies www.*.* links like Google Sheets', () => {
        const format = CsvEditorProvider_1.CsvEditorProvider.__test.formatCellContent;
        const html = format('Visit www.google.com, then continue.', true);
        assert_1.default.ok(html.includes('class="csv-link"'));
        assert_1.default.ok(html.includes('data-href="https://www.google.com"'));
        assert_1.default.ok(html.includes('>www.google.com</span>,'));
    });
    (0, node_test_1.it)('formatCellContent leaves URLs as plain text when linkify is disabled', () => {
        const format = CsvEditorProvider_1.CsvEditorProvider.__test.formatCellContent;
        const html = format('https://example.com?a=1&b=2', false);
        assert_1.default.ok(!html.includes('class="csv-link"'));
        assert_1.default.strictEqual(html, 'https://example.com?a=1&amp;b=2');
    });
    (0, node_test_1.it)('formatCellContent leaves www links as plain text when linkify is disabled', () => {
        const format = CsvEditorProvider_1.CsvEditorProvider.__test.formatCellContent;
        const html = format('www.google.com', false);
        assert_1.default.ok(!html.includes('class="csv-link"'));
        assert_1.default.strictEqual(html, 'www.google.com');
    });
    (0, node_test_1.it)('external link allowlist accepts only supported URL schemes', () => {
        const allowed = CsvEditorProvider_1.CsvEditorProvider.__test.isAllowedExternalUrl;
        assert_1.default.strictEqual(allowed('https://example.com'), true);
        assert_1.default.strictEqual(allowed('http://example.com'), true);
        assert_1.default.strictEqual(allowed('ftp://example.com/file.txt'), true);
        assert_1.default.strictEqual(allowed('mailto:user@example.com'), true);
        assert_1.default.strictEqual(allowed('javascript:alert(1)'), false);
        assert_1.default.strictEqual(allowed('data:text/plain,hello'), false);
        assert_1.default.strictEqual(allowed('file:///tmp/x.csv'), false);
        assert_1.default.strictEqual(allowed(''), false);
    });
    (0, node_test_1.it)('large file prompt helper honors threshold and disabled limit', () => {
        const shouldPrompt = CsvEditorProvider_1.CsvEditorProvider.__test.shouldPromptForLargeFile;
        const mb = 1024 * 1024;
        assert_1.default.strictEqual(shouldPrompt(10 * mb, 10), false);
        assert_1.default.strictEqual(shouldPrompt(10 * mb + 1, 10), true);
        assert_1.default.strictEqual(shouldPrompt(50 * mb, 0), false);
        assert_1.default.strictEqual(shouldPrompt(50 * mb, -1), false);
        assert_1.default.strictEqual(shouldPrompt(50 * mb, Number.NaN), false);
    });
    (0, node_test_1.it)('handles very large row counts without stack overflow', () => {
        const rows = Array.from({ length: 70000 }, (_, i) => [String(i)]);
        assert_1.default.doesNotThrow(() => {
            CsvEditorProvider_1.CsvEditorProvider.__test.computeColumnWidths(rows);
        });
        assert_1.default.doesNotThrow(() => {
            CsvEditorProvider_1.CsvEditorProvider.__test.getEffectiveHeader(rows, 0);
        });
    });
    (0, node_test_1.it)('isDate correctly identifies date strings', () => {
        const isDate = CsvEditorProvider_1.CsvEditorProvider.__test.isDate;
        assert_1.default.strictEqual(isDate('2024-01-02'), true);
        assert_1.default.strictEqual(isDate('not-a-date'), false);
        assert_1.default.strictEqual(isDate('1003'), false);
        assert_1.default.strictEqual(isDate('2024'), false);
        assert_1.default.strictEqual(isDate('2024/01/02'), true);
    });
    (0, node_test_1.it)('estimateColumnDataType detects common types', () => {
        const estimate = CsvEditorProvider_1.CsvEditorProvider.__test.estimateColumnDataType;
        assert_1.default.strictEqual(estimate(['true', 'FALSE']), 'boolean');
        assert_1.default.strictEqual(estimate(['1', '0', '0', '1']), 'boolean');
        assert_1.default.strictEqual(estimate(['t', 'F', 'T', 'f']), 'boolean');
        assert_1.default.strictEqual(estimate(['yes', 'No', 'Y', 'n']), 'boolean');
        assert_1.default.strictEqual(estimate(['on', 'OFF']), 'boolean');
        assert_1.default.strictEqual(estimate(['2020-01-01', '1999-12-31']), 'date');
        assert_1.default.strictEqual(estimate(['0x1', '0x2']), 'integer');
        assert_1.default.strictEqual(estimate(['1003', '42', '0']), 'integer');
        assert_1.default.strictEqual(estimate(['1.2e0', '3.4e0']), 'float');
        assert_1.default.strictEqual(estimate(['', '']), 'empty');
        assert_1.default.strictEqual(estimate(['hello', '1a']), 'string');
    });
    (0, node_test_1.it)('getColumnColor returns hex colors', () => {
        const getColor = CsvEditorProvider_1.CsvEditorProvider.__test.getColumnColor;
        assert_1.default.strictEqual(getColor('empty', true, 0), '#BBB');
        assert_1.default.strictEqual(getColor('empty', false, 0), '#444');
        const hex = getColor('boolean', true, 2);
        assert_1.default.match(hex, /^#[0-9a-fA-F]{6}$/);
    });
    (0, node_test_1.it)('getColumnColor supports an opt-in cool palette', () => {
        const getColor = CsvEditorProvider_1.CsvEditorProvider.__test.getColumnColor;
        const def = getColor('string', false, 0, 'default');
        const cool = getColor('string', false, 0, 'cool');
        assert_1.default.match(cool, /^#[0-9a-fA-F]{6}$/);
        assert_1.default.notStrictEqual(def, cool);
    });
    (0, node_test_1.it)('getColumnColor supports an opt-in warm palette', () => {
        const getColor = CsvEditorProvider_1.CsvEditorProvider.__test.getColumnColor;
        const def = getColor('string', false, 0, 'default');
        const warm = getColor('string', false, 0, 'warm');
        assert_1.default.match(warm, /^#[0-9a-fA-F]{6}$/);
        assert_1.default.notStrictEqual(def, warm);
    });
    (0, node_test_1.it)('resolves effective column color mode for diff contexts', () => {
        const resolveMode = CsvEditorProvider_1.CsvEditorProvider.__test.resolveEffectiveColumnColorMode;
        assert_1.default.strictEqual(resolveMode('type', false, true), 'type');
        assert_1.default.strictEqual(resolveMode('theme', false, true), 'theme');
        assert_1.default.strictEqual(resolveMode('type', true, true), 'theme');
        assert_1.default.strictEqual(resolveMode('theme', true, true), 'theme');
        assert_1.default.strictEqual(resolveMode('type', true, false), 'type');
        assert_1.default.strictEqual(resolveMode('invalid', false, false), 'type');
    });
    (0, node_test_1.it)('resolves effective font size using csv override or editor fallback', () => {
        const resolveFontSize = CsvEditorProvider_1.CsvEditorProvider.__test.resolveEffectiveFontSize;
        assert_1.default.strictEqual(resolveFontSize(18, 14), 18);
        assert_1.default.strictEqual(resolveFontSize(0, 14), 14);
        assert_1.default.strictEqual(resolveFontSize(undefined, 15), 15);
        assert_1.default.strictEqual(resolveFontSize(-2, 15), 15);
        assert_1.default.strictEqual(resolveFontSize('abc', 15), 15);
        assert_1.default.strictEqual(resolveFontSize(undefined, undefined), 14);
    });
    (0, node_test_1.it)('computes paste plan to fill rectangular selection for single-cell clipboard value', () => {
        const plan = CsvEditorProvider_1.CsvEditorProvider.__test.computePastePlan([['X']], 5, 6, { minRow: 1, maxRow: 2, minCol: 3, maxCol: 4, rectangular: true });
        assert_1.default.deepStrictEqual(plan, {
            startRow: 1,
            startCol: 3,
            endRow: 2,
            endCol: 4,
            fillSelection: true
        });
    });
    (0, node_test_1.it)('applies matrix paste and expands data when needed', () => {
        const data = [['a']];
        const result = CsvEditorProvider_1.CsvEditorProvider.__test.applyPasteMatrixToData(data, [['x', 'y'], ['z', 'w']], 0, 1);
        assert_1.default.strictEqual(result.changed, true);
        assert_1.default.strictEqual(result.structuralChange, true);
        assert_1.default.strictEqual(result.plan.fillSelection, false);
        assert_1.default.deepStrictEqual(data, [
            ['a', 'x', 'y'],
            ['', 'z', 'w']
        ]);
    });
    (0, node_test_1.it)('fills selected rectangle when pasting a single-cell value', () => {
        const data = [
            ['a', 'b'],
            ['c', 'd']
        ];
        const result = CsvEditorProvider_1.CsvEditorProvider.__test.applyPasteMatrixToData(data, [['q']], 0, 0, { minRow: 0, maxRow: 1, minCol: 0, maxCol: 1, rectangular: true });
        assert_1.default.strictEqual(result.changed, true);
        assert_1.default.strictEqual(result.structuralChange, false);
        assert_1.default.strictEqual(result.plan.fillSelection, true);
        assert_1.default.deepStrictEqual(data, [
            ['q', 'q'],
            ['q', 'q']
        ]);
    });
    (0, node_test_1.it)('hslToHex converts known colors', () => {
        const hslToHex = CsvEditorProvider_1.CsvEditorProvider.__test.hslToHex;
        assert_1.default.strictEqual(hslToHex(0, 100, 50), '#ff0000'); // red
        assert_1.default.strictEqual(hslToHex(120, 100, 50), '#00ff00'); // green
        assert_1.default.strictEqual(hslToHex(240, 100, 50), '#0000ff'); // blue
    });
    (0, node_test_1.it)('runtime transport defers chunk serialization and serves chunks on demand', () => {
        var _a, _b, _c, _d, _e, _f;
        const rows = Array.from({ length: 2500 }, (_, i) => [String(i + 1), 'x', 'y']);
        const meta = CsvEditorProvider_1.CsvEditorProvider.__test.generateRuntimeChunkTransport(rows, 
        /* treatHeader */ false, 
        /* addSerialIndex */ false, 
        /* hiddenRows */ 0);
        assert_1.default.strictEqual(meta.serializedChunkCount, 0);
        assert_1.default.strictEqual(meta.hasRemoteChunks, true);
        assert_1.default.strictEqual(meta.hasChunkState, true);
        assert_1.default.strictEqual(meta.nextChunkStart, 1000);
        const nextChunk = CsvEditorProvider_1.CsvEditorProvider.__test.generateRuntimeChunkTransport(rows, false, false, 0, 1000);
        assert_1.default.ok(nextChunk.response);
        assert_1.default.strictEqual((_a = nextChunk.response) === null || _a === void 0 ? void 0 : _a.done, false);
        assert_1.default.strictEqual((_b = nextChunk.response) === null || _b === void 0 ? void 0 : _b.nextStart, 2000);
        assert_1.default.ok((_c = nextChunk.response) === null || _c === void 0 ? void 0 : _c.html.includes('data-row="1000" data-col="0"'));
        const virtualChunk = CsvEditorProvider_1.CsvEditorProvider.__test.generateRuntimeChunkTransport(rows, false, false, 0, 2500);
        assert_1.default.ok(virtualChunk.response);
        assert_1.default.strictEqual((_d = virtualChunk.response) === null || _d === void 0 ? void 0 : _d.done, true);
        assert_1.default.strictEqual((_e = virtualChunk.response) === null || _e === void 0 ? void 0 : _e.nextStart, -1);
        assert_1.default.ok((_f = virtualChunk.response) === null || _f === void 0 ? void 0 : _f.html.includes('data-row="2500" data-col="0"'));
    });
    (0, node_test_1.it)('runtime transport shrinks chunk row count for very wide datasets', () => {
        const width = 250;
        const wideRow = Array.from({ length: width }, (_, i) => `c${i}`);
        const rows = Array.from({ length: 1300 }, () => [...wideRow]);
        const meta = CsvEditorProvider_1.CsvEditorProvider.__test.generateRuntimeChunkTransport(rows, 
        /* treatHeader */ false, 
        /* addSerialIndex */ false, 
        /* hiddenRows */ 0);
        // 20,000 max cells per chunk => floor(20000 / 250) = 80 rows per chunk.
        assert_1.default.strictEqual(meta.nextChunkStart, 80);
        assert_1.default.strictEqual(meta.hasRemoteChunks, true);
    });
});
