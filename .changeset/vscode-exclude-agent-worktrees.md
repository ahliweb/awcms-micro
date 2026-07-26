---
"awcms-micro": patch
---

Jangan biarkan worktree agent muncul sebagai problem di editor.

`.claude/worktrees/agent-*/` adalah checkout penuh repo ini pada commit lain.
Tanpa pengecualian, VS Code mengindeksnya sebagai sumber proyek: TypeScript
server memeriksa salinan basi dan errornya muncul di panel Problems atas
berkas yang bahkan mungkin sudah tidak ada di branch mana pun (teramati
setelah PR #374 — 14 error `ts(2339)` dari worktree yang kodenya sudah
diperbaiki di `main`). Karena worktree juga tidak terlihat `git status`, tidak
ada hal lain yang memperingatkan.

Ditambahkan `.vscode/settings.json` (exclude untuk files/search/watcher),
entri `.gitignore`, dan `scripts/cleanup-agent-worktrees.sh` untuk sisa yang
tidak bisa dihapus tanpa `sudo` — container PostgreSQL yang dipakai tes
integrasi menulis berkas milik root ke dalam worktree, sehingga
`git worktree remove` gagal EPERM dan meninggalkan direktorinya meski git
sudah men-deregistrasi worktree-nya.
