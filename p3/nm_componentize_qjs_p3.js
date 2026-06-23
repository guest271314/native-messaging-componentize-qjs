//! componentize-qjs Native Messaging host
//! guest271314, andreiltd (https://github.com/andreiltd), 6-13-2026
//! https://github.com/andreiltd/issues/1
//! Based on https://github.com/guest271314/native-messaging-webassembly/nm_javy.js
//! WASI P3 version

import stdin from "wasi:cli/stdin@0.3.0-rc-2026-03-15";
import stdout from "wasi:cli/stdout@0.3.0-rc-2026-03-15";

const MAX_IN = 64 * 1024 * 1024;
const FRAME = 1 * 1024 * 1024;

async function readExact(input, n) {
  const out = new Uint8Array(n);
  for (let off = 0; off < n;) {
    const chunk = await input.read(n - off);
    if (chunk.length === 0) return null;
    out.set(chunk, off);
    off += chunk.length;
  }
  return out;
}

async function readMessage(input) {
  const header = await readExact(input, 4);
  if (header === null) return null;
  const len = new DataView(header.buffer).getUint32(0, true);
  if (len > MAX_IN) throw new Error(`message of ${len} bytes exceeds 64 MiB`);
  return len === 0 ? new Uint8Array(0) : readExact(input, len);
}

async function sendMessage(output, payload) {
  for (let off = 0; off === 0 || off < payload.length; off += FRAME) {
    const chunk = payload.subarray(off, off + FRAME);
    const frame = new Uint8Array(4 + chunk.length);

    new DataView(frame.buffer).setUint32(0, chunk.length, true);
    frame.set(chunk, 4);

    for (let w = 0; w < frame.length;) {
      const n = await output.write(frame.subarray(w));
      if (n === 0) return;
      w += n;
    }
  }
}

export const run = {
  async run() {
    const [input, status] = stdin.readViaStream();
    const { readable, writable } = wit.Stream(wit.Stream.U8);
    const writeDone = stdout.writeViaStream(readable);

    try {
      for (let msg; (msg = await readMessage(input)) !== null;) {
        await sendMessage(writable, msg);
      }
    } finally {
      writable.drop();
      input.drop();
    }

    const written = await writeDone;
    return written.tag === "err" ? written : await status.read();
  },
};
