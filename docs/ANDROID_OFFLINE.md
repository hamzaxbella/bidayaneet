# Android field collection (PWA)

Open `/terrain` while signed in as a mediator/admin and connected. Wait for “Prêt hors connexion”. In Chrome on Android, select Install app / Add to Home screen. The public field shell is cached; personal dashboard HTML and API responses are never cached by the service worker.

Switch to airplane mode. Create a diagnosis with consent. Saving writes to IndexedDB and waits for the transaction to commit before confirming. Reload/reopen `/terrain`: pending records remain. Return online with the same account: automatic synchronization runs on reconnection and every 5 seconds while the page is open; a manual button is also available. Successful records are removed locally after the server acknowledges them. The server's UUID and identical-payload retry handling prevent duplicate records if acknowledgment is lost. Invalid/rejected records remain with an error and a correction button. Another account cannot synchronize these records.

This is an installable web application, not an APK. Only new diagnoses are collected offline; matching, review, referrals and other platform features need connectivity. Sync requires an open field page and valid session; there is no background sync after closing Chrome. First-time authentication/preparation requires connectivity. Android outside localhost requires HTTPS; plain HTTP LAN access is insufficient. The current localhost URL belongs to the computer and cannot be opened directly on the phone. The hosted HTTPS entry is https://bidayaneet.vercel.app/terrain.

Local drafts are not encrypted and remain accessible on an unlocked browser/device. This demo is for fictitious data. Browser storage can be cleared or evicted; a persistence request is made but cannot guarantee retention. Keep the device locked and do not clear browser storage until synchronization. Account separation prevents wrong-account submission, not forensic access to local data. No passwords or session tokens are copied into IndexedDB.

Verification: Playwright desktop and Pixel 7 emulation cover network outage, reload, durable local save, reconnect/single creation, expired login, other role, and cache exclusions. A physical Android airplane-mode test is still required after HTTPS deployment.

Completed verification on 2026-10-03: production build and ESLint passed; four offline tests passed (two scenarios × desktop/Pixel 7). The existing twelve web workflow tests also passed during this change. The external HTTPS deployment was subsequently completed with Neon PostgreSQL; a physical Android test is still required.
