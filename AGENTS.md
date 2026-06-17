# Project Overview

This project is a secure vault-style authentication system using client-side cryptography.

# Project Structure

```md
lockbox
├─public
├─src
│ ├─app
│ ├─assets
│ ├─components
│ ├─config
│ ├─features
│ │ ├─archive
│ │ ├─auth
│ │ ├─tools
│ │ ├─user
│ │ ├─vault
│ ├─hooks
│ ├─lib
│ ├─types
│ ├─index.css
│ ├─main.tsx
```

`app`

This directory contains route page. In this directory we don't call the backend api.

`components`

This directory contains reusable components or custom components.

`config`

This directory contains configuration for environment and route paths.

`feature`

This important directory contains our feature applications.

# Important Constraints

- Do not install unnecessary dependencies
- Do not modify unrelated files
- Keep code simple and maintainable
- Prefer explicit code over magic abstractions
- Use context timeout for external resources
- Do not implement testing until I need that
