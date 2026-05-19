import { shallowRef } from 'vue'

import router from '@/application/router'

import AuthLayout from './auth/AuthLayout.vue'
import AdminLayout from './admin/AdminLayout.vue'
import EmptyLayout from './empty/EmptyLayout.vue'
import PublicLayout from './public/PublicLayout.vue'

const layout = shallowRef()

export const layouts = {
  admin: AdminLayout,
  auth: AuthLayout,
  empty: EmptyLayout,
  public: PublicLayout,
}

type TLayoutKey = keyof typeof layouts

router.beforeEach((to) => {
  const layoutName = (to.meta.layout as TLayoutKey) ?? 'admin'

  layout.value = layouts[layoutName]
})

export default layout