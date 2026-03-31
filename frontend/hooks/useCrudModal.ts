import { useState, useCallback } from 'react'

interface UseCrudModalReturn<T extends Record<string, any>> {
  showModal: boolean
  editingItem: T | null
  formData: T
  setFormData: React.Dispatch<React.SetStateAction<T>>
  openCreate: () => void
  openEdit: (item: T) => void
  close: () => void
  isEditing: boolean
}

/**
 * Reusable hook for CRUD modal state management.
 * Extracted from the common pattern across admin pages:
 * FAQPage (selectedFAQ + form + showModal), ContentPage (editingItem + formData + showModal),
 * ProjectsPage (editingProject + formData + showModal).
 *
 * @param defaultForm - The default/empty form state used when creating a new item.
 * @param mapItemToForm - Optional mapper to convert an existing item to form data for editing.
 *                        If not provided, the item is spread directly into the form.
 */
export function useCrudModal<T extends Record<string, any>>(
  defaultForm: T,
  mapItemToForm?: (item: T) => T
): UseCrudModalReturn<T> {
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<T>(defaultForm)

  const openCreate = useCallback(() => {
    setEditingItem(null)
    setFormData({ ...defaultForm })
    setShowModal(true)
  }, [defaultForm])

  const openEdit = useCallback(
    (item: T) => {
      setEditingItem(item)
      setFormData(mapItemToForm ? mapItemToForm(item) : { ...item })
      setShowModal(true)
    },
    [mapItemToForm]
  )

  const close = useCallback(() => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ ...defaultForm })
  }, [defaultForm])

  const isEditing = editingItem !== null

  return {
    showModal,
    editingItem,
    formData,
    setFormData,
    openCreate,
    openEdit,
    close,
    isEditing,
  }
}
