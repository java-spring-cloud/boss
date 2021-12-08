import defaultSettings from '@/settings'

const title = defaultSettings.title || '哈希'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
