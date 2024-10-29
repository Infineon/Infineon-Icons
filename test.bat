@echo off
REM Create the directory if it doesn't exist
if not exist optimized-icons (
    mkdir optimized-icons
)
REM Loop through all SVG files in the icons\16 directory
for %%f in (svg\*.svg) do (
    REM Get the base name of the file
    set "filename=%%~nf"

    REM Run Inkscape to process the file
    inkscape "%%f" --export-plain-svg --actions="select-all;object-stroke-to-path;export-filename:optimized-icons\%%~nxf;export-do"
)
pause