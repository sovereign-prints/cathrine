@echo off
setlocal
cd /d "%~dp0"

echo ============================================================
echo  Sovereign Prints - publish the static site changes
echo ============================================================
echo.

echo [1/6] Saving a backup of your current branch...
git branch -f backup-before-static-split HEAD
if errorlevel 1 goto :failed
echo       Backup saved as "backup-before-static-split".
echo.

echo [2/6] Fetching the latest from GitHub...
git fetch origin
if errorlevel 1 goto :failed
echo.

echo [3/6] Checking for local commits that are not on GitHub...
for /f %%i in ('git rev-list --count origin/main..HEAD') do set AHEAD=%%i
if not "%AHEAD%"=="0" (
  echo.
  echo   STOP: you have %AHEAD% local commit^(s^) that are not on GitHub.
  echo   Nothing has been changed. Tell Claude before continuing.
  echo.
  pause
  exit /b 1
)
echo       None - safe to continue.
echo.

echo [4/6] Lining up with GitHub main...
git reset --mixed origin/main
if errorlevel 1 goto :failed
echo.

echo [5/6] Committing the changes...
git add -A
git commit -m "Split customer site into a Render Static Site and add admin publishing" -m "Customer pages (home, products, gallery, quote) build into ./dist and deploy as a Render Static Site. The API, uploads and admin pages stay on the existing web service. Adds a Website tab in the admin to rebuild the static site. No database changes."
if errorlevel 1 goto :nothing
echo.

echo [6/6] Pushing to GitHub...
git push origin HEAD:main
if errorlevel 1 goto :failed
echo.
echo ============================================================
echo  DONE. Pushed to GitHub main.
echo  Next: in Render, sync the Blueprint to create the static site,
echo  then set the environment variables (see APPLY-STATIC-SITE-CHANGES.txt).
echo ============================================================
echo.
pause
exit /b 0

:nothing
echo.
echo  Nothing to commit - the files may already be pushed.
echo.
pause
exit /b 0

:failed
echo.
echo  Something went wrong. Nothing was force-pushed.
echo  Your previous state is saved on the branch "backup-before-static-split".
echo  Copy the message above and send it to Claude.
echo.
pause
exit /b 1
