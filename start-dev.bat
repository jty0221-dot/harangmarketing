@echo off
REM Run the Next.js dev server.
REM
REM Notes (deliberate, do not "simplify"):
REM  - %~dp0 is this file's own folder, so moving the project never breaks it.
REM  - `npm run dev` puts node_modules/.bin on PATH, but when the project path
REM    contains non-ASCII characters (e.g. the Korean folder name in E:\...\harang)
REM    cmd's code page mangles it and `next` is not found. Calling the entry
REM    script through node avoids PATH entirely.
REM  - Keep this file ASCII-only. cmd reads .bat as the system code page,
REM    so Korean comments here would come out garbled.
cd /d "%~dp0"
node "%~dp0node_modules/next/dist/bin/next" dev
