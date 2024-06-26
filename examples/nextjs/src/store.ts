'use client'

import { createScopedStore } from 'stan-js'

export const { StoreProvider, useScopedStore } = createScopedStore({
    user: '',
    counter: 0,
})
