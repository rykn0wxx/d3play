import { waitForReadyState } from '@/services/utils'

export default async function scrollBehavior(to, from, savedPosition) {
  await waitForReadyState()
  if (savedPosition) {
    return savedPosition
  }
  if (to.hash) {
    return { selector: to.hash }
  }
  return { x: 0, y: 0 }
}
