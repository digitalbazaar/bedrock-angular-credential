# bedrock-angular-credential ChangeLog

## [Unreleased]

## [2.0.0] - 2016-05-28

### Added
- **BREAKING**: Allow credential viewer action menu to be replaced
  via transclusion and expose credential viewer controller via
  `br-on-init` attribute. This is considered breaking because it
  changes the way that the action menu can be overridden and
  previous overrides will no longer work.

## 1.1.1 - 2016-05-27

### Changed
- Update deps.

## 1.1.0 - 2016-05-27

### Added
- Allow credential viewer action menu to be overridden w/transclusion.

## 1.0.0 - 2016-04-29

### Added
- Add basic credential display using form library and sysLayout.
- Support for custom display directives based on Credential type.
- Default credential displayer using `br-form`.
- Basic share menu and dialog support.
