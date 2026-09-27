# macOS Safari Web Extension wrapper

This directory is a deliberately small Xcode scaffold around the Manifest V3
extension in the parent directory. The wrapper is not signed and uses placeholder
bundle identifiers; replace them with identifiers owned by your Apple Developer
team before distribution.

## Generate or open the project

The checked-in `project.yml` is an XcodeGen recipe. On macOS, run:

```sh
./setup.sh
```

If XcodeGen is installed, this generates `Articleall.xcodeproj`. Otherwise the
script prints the equivalent manual Xcode steps. You can also install XcodeGen
with `brew install xcodegen`, rerun the script, and open the generated project.

## Build and enable in Safari

1. Open `Articleall.xcodeproj` in Xcode.
2. Select the **Articleall** app target and choose your Apple Developer team.
3. Set unique bundle identifiers for **Articleall** and **Articleall Extension**
   if the defaults are already in use.
4. Select the **Articleall** macOS scheme and click **Build & Run**.
5. In Safari, open **Safari > Settings > Extensions**, select Articleall, and
   enable it. Grant website access if Safari asks.

The extension target contains symlinks to `../manifest.json`, `../src`,
`../popup`, `../options`, and `../icons`; edit the parent files to change the
extension. Xcode must be able to resolve these links from the checked-out
repository. For a release build, configure signing, capabilities, archive
settings, and the Safari extension distribution workflow in Xcode.
