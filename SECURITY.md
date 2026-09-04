# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to the maintainers. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

## Security Features

This project implements the following security measures:

### Automated Security Scanning

- **CodeQL** — Static analysis for code vulnerabilities (runs on every push and PR)
- **Semgrep** — Additional static analysis with custom rules
- **Trivy** — Filesystem vulnerability scanning for dependencies
- **Gitleaks** — Secret detection in source code
- **Dependabot** — Automated dependency updates with security alerts
- **SBOM Generation** — Software Bill of Materials for supply chain transparency
- **OpenSSF Scorecard** — Security best practices evaluation

### CI/CD Security

- All GitHub Actions are pinned to specific SHA commits
- Workflow permissions follow least-privilege principle
- zizmor analysis for GitHub Actions security
- actionlint for workflow validation

### Dependency Management

- Automated weekly dependency updates via Dependabot
- Grouped updates for related packages
- Auto-merge for minor and patch version bumps (via CI workflow)
- License auditing for all dependencies

## Best Practices

- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration
- Enable branch protection rules on `main`
- Require status checks before merging
- Enable "Require pull request reviews before merging"
