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
(0, node_test_1.describe)('Separators and date edge cases', () => {
    (0, node_test_1.it)('inherits separator from file type and respects overrides', () => {
        const eff = CsvEditorProvider_1.CsvEditorProvider.__test.getEffectiveSeparator;
        // Default CSV -> ','
        assert_1.default.strictEqual(eff('/tmp/sample.csv', undefined), ',');
        // Default TSV -> '\t'
        assert_1.default.strictEqual(eff('/tmp/sample.tsv', undefined), '\t');
        // Default TAB -> '\t'
        assert_1.default.strictEqual(eff('/tmp/sample.tab', undefined), '\t');
        // Default PSV -> '|'
        assert_1.default.strictEqual(eff('/tmp/sample.psv', undefined), '|');
        // Override wins regardless of extension
        assert_1.default.strictEqual(eff('/tmp/sample.csv', ';'), ';');
        assert_1.default.strictEqual(eff('/tmp/sample.tsv', ';'), ';');
        assert_1.default.strictEqual(eff('/tmp/sample.tab', ';'), ';');
        assert_1.default.strictEqual(eff('/tmp/sample.psv', ';'), ';');
    });
    (0, node_test_1.it)('supports extension/default/auto separator modes', () => {
        const eff = CsvEditorProvider_1.CsvEditorProvider.__test.getEffectiveSeparator;
        // default mode always uses csv.defaultSeparator
        assert_1.default.strictEqual(eff('/tmp/sample.tsv', undefined, { mode: 'default', defaultSeparator: ';' }), ';');
        // extension mode uses mapping overrides
        assert_1.default.strictEqual(eff('/tmp/sample.data', undefined, {
            mode: 'extension',
            defaultSeparator: ',',
            byExtension: { '.data': '|', '.csv': ';' }
        }), '|');
        // auto mode detects separators from content regardless of extension
        assert_1.default.strictEqual(eff('/tmp/sample.csv', undefined, {
            mode: 'auto',
            text: 'a|b|c\n1|2|3\n4|5|6'
        }), '|');
        // auto mode should favor the delimiter present in the header row
        assert_1.default.strictEqual(eff('/tmp/sample.csv', undefined, {
            mode: 'auto',
            text: 'a;b;c\n1,23;4,56;7,89\n2,11;3,33;4,44'
        }), ';');
        // auto mode falls back safely when content is ambiguous
        assert_1.default.strictEqual(eff('/tmp/sample.tsv', undefined, {
            mode: 'auto',
            text: 'single-value-line'
        }), '\t');
    });
    (0, node_test_1.it)('isDate handles offsets, time components, and rejects bogus values', () => {
        const isDate = CsvEditorProvider_1.CsvEditorProvider.__test.isDate;
        // ISO with time
        assert_1.default.strictEqual(isDate('2024-01-02T03:04:05Z'), true);
        assert_1.default.strictEqual(isDate('2024-01-02 03:04'), true);
        assert_1.default.strictEqual(isDate('2024-01-02T03:04:05+02:00'), true);
        assert_1.default.strictEqual(isDate('2024/01/02'), true);
        // Bogus / ambiguous values
        assert_1.default.strictEqual(isDate('2024-13-40'), false);
        assert_1.default.strictEqual(isDate('0000-00-00'), false);
        assert_1.default.strictEqual(isDate('1/2/2024'), false); // not yyyy/mm/dd
        assert_1.default.strictEqual(isDate('20240102'), false);
        assert_1.default.strictEqual(isDate('42'), false);
    });
});
