import defaultSettings from '@/settings'

const title = defaultSettings.title || '识因AI'

export default function getPageTitle() {
  // if (pageTitle) {
  //   return `${pageTitle} - ${title}`
  // }
  return `${title}`
}
