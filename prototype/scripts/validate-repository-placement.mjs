#!/usr/bin/env node
// Historical compatibility entry point. RER-013 repository ownership is
// validated by validate-independent-repository.mjs.
await import('./validate-independent-repository.mjs')
