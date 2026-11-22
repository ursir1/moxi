@echo off
set mypath=%~dp0

:: Compile the main executable
if not exist "%mypath%..\target\x86_64-pc-windows-msvc\release\moxi.exe" (
    if not exist "%mypath%..\target\release\moxi.exe" (
        cargo build --release --target x86_64-pc-windows-msvc
    )
) else (
    echo Main executable is already built
)

:: Compile the installer
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" "%mypath%Stremio.iss"
