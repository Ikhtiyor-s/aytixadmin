import { useState, useCallback } from 'react'

interface UseAsyncActionReturn {
  loading: boolean
  error: string | null
  execute: <T>(fn: () => Promise<T>) => Promise<T | undefined>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

/**
 * Reusable hook for wrapping async CRUD operations with loading/error state.
 * Extracted from the try/catch/finally pattern found in every admin page:
 *
 * ```
 * setSaving(true)
 * try { await someApi.doSomething(...) }
 * catch (err) { handleError(err) }
 * finally { setSaving(false) }
 * ```
 */
export function useAsyncAction(): UseAsyncActionReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute, setError }
}
