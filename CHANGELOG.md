# Changelog

All notable changes to the Arkham City project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Architecture diagram reference in README.md
- Development workflow sections in README.md including testing and deployment guidelines
- Proper module imports in GwProjectFirestoreRuleController test setup for better test reliability

### Changed

- Updated project title in README.md from "Arkham City Deployment" to "Arkham City"
- Reorganized imports in HashService (alphabetical ordering)
- Enhanced test setup in GwProjectFirestoreRuleController tests by importing the required module

### Removed

- Removed unnecessary console.error logging in HashService's decrypt method

### Fixed

- Improved test reliability for GwProjectFirestoreRuleController by properly importing dependencies

## [0.1.0] - 2025-03-15

### Added

- Initial project setup
- Core backend services (NestJS)
- Dashboard frontend (Angular)
- Web SDK for integration
- Example code and templates
- Docker configuration for development and production
- Documentation