'use client'

import { createScopedStore } from 'stan-js'

export const { StoreProvider, useScopedStore, useStore } = createScopedStore({
    user: '',
    counter: 0,
})
