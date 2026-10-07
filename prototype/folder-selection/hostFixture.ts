// Browser-only host fixture. Select starting context/outcome here or with the documented
// storage keys; user-visible actions still run through the product's Browse control.
export type FolderPickerContext = 'local-electron' | 'remote-electron' | 'browser' | 'mobile'
export type FolderPickerOutcome = 'choose' | 'error' | 'empty'
export const folderPickerFixture: { context: FolderPickerContext; firstOutcome: FolderPickerOutcome } = {
  context: 'local-electron',
  firstOutcome: 'choose',
}
let consumed = false
export function consumeFolderPickerOutcome(): FolderPickerOutcome {
  const result = consumed ? 'choose' : folderPickerFixture.firstOutcome
  consumed = true
  return result
}
