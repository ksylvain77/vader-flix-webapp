
# VaderFlix Cleanup Checklist (Non-Testing)

This checklist is focused on structural and dev hygiene tasks — keeping the project streamlined and maintainable without touching automated testing yet.

---

## 🔻 Dev & Debug Artifacts

- [ ] Remove or archive `websocket-test-server.js` from `backend/`
- [ ] Remove or archive `scripts/test-db-connection.js` and `test-new-db-config.js`
- [ ] Move frontend test/demo components to `src/sandbox/` or `src/dev/`:
  - `WebSocketExample.js`
  - `PlexTokenTest.js`
  - `SimpleTest.js`
  - `TestRoute.js`
- [ ] Move or archive HTML test files in `public/`:
  - `websocket-test.html`
  - `websocket-test-client.html`

---

## 🗃️ Folder Hygiene

- [ ] Delete `src/.DS_Store` and `src/@eaDir/*` from both frontend and backend
- [ ] Ensure `.gitignore` includes:
  ```bash
  .DS_Store
  @eaDir/
  *.zip
  ```
- [ ] Delete `docs/AESTHETIC_VISION.md` (V1 — already superseded by V2)

---

## 📁 Optional: File/Folder Re-org

- [ ] Move frontend `scripts/` into `tools/` or `dev/`
- [ ] Move backend `scripts/` into `tools/` or `dev/`
- [ ] Consider separating `dev/` from `src/` in both apps to clearly isolate runtime from utility/debug files

---

## 📌 Not Doing Yet

- ❌ No change to `__tests__/` or test scaffolding
- ❌ No TDD/init scripts or coverage enforcement
- ❌ No structural changes to API layers
