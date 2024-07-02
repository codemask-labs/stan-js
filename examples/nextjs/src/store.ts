'use client'

import { createScopedStore } from '../../../dist'

export const { StoreProvider, useScopedStore, useStore } = createScopedStore({
    user: '',
    counter: 0,
})
