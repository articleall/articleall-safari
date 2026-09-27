#!/bin/sh
set -eu

cd "$(dirname "$0")"

if command -v xcodegen >/dev/null 2>&1; then
  xcodegen generate --spec project.yml
  echo "Generated Articleall.xcodeproj. Open it in Xcode."
  exit 0
fi

cat <<'EOF'
XcodeGen is not installed, so no project was generated.

Manual setup:
1. Open Xcode and choose File > New > Project > macOS > App.
2. Name the app Articleall, select SwiftUI, set the deployment target to macOS 13.0,
   and save it in this macos/ directory.
3. Choose File > New > Target > Safari Web Extension and name it Articleall Extension.
4. Remove Xcode's generated extension resources, then add the contents of
   "Articleall Extension" to the extension target. Keep the files in their
   current locations; they are symlinks to the parent extension source.
5. Add Articleall Extension to the app target's Frameworks, Libraries, and Embedded
   Content using "Embed & Sign".
6. Set a unique team and bundle identifiers for both targets, then build and run.

The checked-in project.yml can be used with XcodeGen:
  brew install xcodegen
  ./setup.sh
EOF
