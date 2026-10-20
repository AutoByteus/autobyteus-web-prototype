/** "3 hr. ago", "yesterday": the short relative time used on notification cards (as in macOS notifications). */
export const shortRelativeTime = (iso: string, locale: string): string => {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const format = new Intl.RelativeTimeFormat(locale || 'en', { numeric: 'auto', style: 'short' })
  const abs = Math.abs(seconds)
  if (abs < 3600) return format.format(Math.round(seconds / 60), 'minute')
  if (abs < 86_400) return format.format(Math.round(seconds / 3600), 'hour')
  return format.format(Math.round(seconds / 86_400), 'day')
}
