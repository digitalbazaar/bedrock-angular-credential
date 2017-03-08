# bedrock-angular-credential ChangeLog

### Changed
- Fix modal transclusion.

## 2.4.0 - 2017-01-18

### Added
- Pass `displayer` options to custom displayers.

## 2.3.0 - 2017-01-05

### Added
- Add `onDelete` handler to credential viewer.
- Add optional attributes to credentials list to hide UI elements.

## 2.2.5 - 2016-10-25

### Changed
- Add protractor pages.

## 2.2.4 - 2016-09-16

### Fixed
- Do not call `scope.callback` twice in login directive on error.

## 2.2.3 - 2016-09-12

### Fixed
- Fix generation of credentials sharing URL.

## 2.2.2 - 2016-08-11

### Fixed
- Build credential share URL from bedrock-identity config.

## 2.2.1 - 2016-08-08

### Fixed
- Credential share URL.

## 2.2.0 - 2016-07-20

### Changed
- Support library parameter.
- Update to use Displayer data to map credential type to displayer type.

## 2.1.1 - 2016-07-14

### Fixed
- Display a public credential to an identity without elevated permissions.

## 2.1.0 - 2016-07-06

### Removed
- Remove context-specific credential data display.

## 2.0.5 - 2016-06-30

### Changed
- Do $route.reload() after login.

## 2.0.4 - 2016-06-29

### Fixed
- Credential deletion.

## 2.0.3 - 2016-06-22

### Fixed
- Display error on credential storage failure.

## 2.0.2 - 2016-05-31

### Changed
- Change method of displaying links for unclaimed credentials.

## 2.0.1 - 2016-05-30

### Fixed
- Recreate credentials-action-menu-directive.js.

## 2.0.0 - 2016-05-28

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
