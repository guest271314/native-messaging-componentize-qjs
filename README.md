## componentize-qjs Native Messaging host

### Install dependencies

```shell
bun install --cache-dir ./.bun-cache componentize-qjs
```

```shell
cargo bininstall wkg
wkg wit fetch -d . --cache ./.wit-cache
```

### Compile to WASM

```shell
bun x componentize-qjs -n native-messaging-componentize-qjs -w . -m \
--opt-size --js nm_componentize_qjs.js -o nm_componentize_qjs.wasm
```

# Installation and usage on Chrome and Chromium

1. Navigate to `chrome://extensions`.
2. Toggle `Developer mode`.
3. Click `Load unpacked`.
4. Select `native-messaging-componentize-qjs` folder.
5. Note the generated extension ID.
6. Open `nm_componentize_qjs.json` in a text editor, set `"path"` to absolute path of `nm_componentize_qjs.sh` and `chrome-extension://<ID>/` using ID from 5 in `"allowed_origins"` array, and set `nm_componentize_qjs.sh` permission to executable.
7. Copy the file to Chrome or Chromium configuration folder, e.g., Chromium on Linux `~/.config/chromium/NativeMessagingHosts`; Chrome dev channel on Linux `~/.config/google-chrome-unstable/NativeMessagingHosts`.
8. To test click `service worker` link in panel of unpacked extension which is DevTools for `background.js` in MV3 `ServiceWorker`, observe echo'ed message from Bun Native Messaging host. To disconnect run `port.disconnect()`.

The Native Messaging host echoes back the message passed. 

For differences between OS and browser implementations see [Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#native_messaging).

## License
Do What the Fuck You Want to Public License [WTFPLv2](http://www.wtfpl.net/about/)


