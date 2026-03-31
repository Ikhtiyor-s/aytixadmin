import { useState, useCallback } from 'react'

interface UseFileUploadReturn {
  file: File | null
  preview: string | null
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  resetFile: () => void
  setPreview: (preview: string | null) => void
}

/**
 * Reusable hook for file upload with preview.
 * Extracted from ContentPage.tsx and ProjectsPage.tsx patterns.
 *
 * @param useObjectUrl - If true, uses URL.createObjectURL (like ContentPage).
 *                       If false, uses FileReader.readAsDataURL (like ProjectsPage).
 *                       Default: false (FileReader).
 */
export function useFileUpload(useObjectUrl = false): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (!selected) return

      setFile(selected)

      if (useObjectUrl) {
        setPreview(URL.createObjectURL(selected))
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selected)
      }
    },
    [useObjectUrl]
  )

  const resetFile = useCallback(() => {
    setFile(null)
    setPreview(null)
  }, [])

  return { file, preview, handleFileChange, resetFile, setPreview }
}
