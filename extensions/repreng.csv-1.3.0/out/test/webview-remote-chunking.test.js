"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_test_1 = require("node:test");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, node_test_1.describe)('Webview remote chunk transport', () => {
    const providerSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'src', 'CsvEditorProvider.ts'), 'utf8');
    const webviewSource = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'media', 'main.js'), 'utf8');
    (0, node_test_1.it)('publishes remote chunk metadata on the root table container', () => {
        assert_1.default.ok(providerSource.includes('data-nextchunkstart="${nextChunkStart >= 0 ? nextChunkStart : \'\'}"'));
        assert_1.default.ok(providerSource.includes('data-hasmorechunks="${hasRemoteChunks ? \'1\' : \'0\'}"'));
    });
    (0, node_test_1.it)('requests and handles chunk payloads over postMessage', () => {
        assert_1.default.ok(webviewSource.includes("type: 'requestChunk'"));
        assert_1.default.ok(webviewSource.includes("message.type === 'chunkData'"));
    });
    (0, node_test_1.it)('continues ensure-target rendering as chunks arrive', () => {
        assert_1.default.ok(webviewSource.includes('pendingEnsureTarget'));
        assert_1.default.ok(webviewSource.includes("window.addEventListener('csvChunkLoaded', ensureTargetStep);"));
    });
});
