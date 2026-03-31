'use client'

import { FooterSection, FooterItem } from '@/lib/api/footer'

interface FooterSectionsTabProps {
  t: any
  sections: FooterSection[]
  selectedSection: FooterSection | null
  selectedItem: FooterItem | null
  showSectionModal: boolean
  showItemModal: boolean
  saving: boolean
  sectionForm: Partial<FooterSection>
  itemForm: Partial<FooterItem>
  setSectionForm: (form: Partial<FooterSection>) => void
  setItemForm: (form: Partial<FooterItem>) => void
  setSelectedSection: (section: FooterSection | null) => void
  setSelectedItem: (item: FooterItem | null) => void
  setShowSectionModal: (show: boolean) => void
  setShowItemModal: (show: boolean) => void
  resetSectionForm: () => void
  resetItemForm: () => void
  handleCreateSection: () => void
  handleUpdateSection: () => void
  handleDeleteSection: (id: number) => void
  handleToggleSection: (id: number, is_active: boolean) => void
  openEditSection: (section: FooterSection) => void
  handleCreateItem: () => void
  handleUpdateItem: () => void
  handleDeleteItem: (id: number) => void
  handleToggleItem: (id: number, is_active: boolean) => void
  openEditItem: (item: FooterItem) => void
}

export default function FooterSectionsTab({
  t,
  sections,
  selectedSection,
  selectedItem,
  showSectionModal,
  showItemModal,
  saving,
  sectionForm,
  itemForm,
  setSectionForm,
  setItemForm,
  setSelectedSection,
  setSelectedItem,
  setShowSectionModal,
  setShowItemModal,
  resetSectionForm,
  resetItemForm,
  handleCreateSection,
  handleUpdateSection,
  handleDeleteSection,
  handleToggleSection,
  openEditSection,
  handleCreateItem,
  handleUpdateItem,
  handleDeleteItem,
  handleToggleItem,
  openEditItem,
}: FooterSectionsTabProps) {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">{t.footerSections}</h2>
          <button
            onClick={() => { resetSectionForm(); setSelectedSection(null); setShowSectionModal(true) }}
            className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
          >
            + {t.addSection}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sections list */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">{t.footerSections}</h3>
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t.noSections}</p>
            ) : (
              sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSection?.id === section.id
                      ? 'border-[#00a6a6] bg-[#00a6a6]/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium dark:text-white">{section.title_uz}</h4>
                      <p className="text-sm text-gray-500">/{section.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleSection(section.id!, !!section.is_active) }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${section.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                        title={section.is_active ? t.inactiveStatus : t.activeStatus}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${section.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditSection(section) }}
                        className="p-1 text-gray-500 hover:text-[#00a6a6]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id!) }}
                        className="p-1 text-gray-500 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {section.items?.length || 0} ta element
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Section items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                {selectedSection ? `"${selectedSection.title_uz}" elementlari` : 'Bo\'limni tanlang'}
              </h3>
              {selectedSection && (
                <button
                  onClick={() => { resetItemForm(); setSelectedItem(null); setShowItemModal(true) }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + {t.addItem}
                </button>
              )}
            </div>
            {selectedSection ? (
              selectedSection.items && selectedSection.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedSection.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span className="text-gray-400">
                            <i className={item.icon}></i>
                          </span>
                        )}
                        <div>
                          <p className="font-medium text-sm dark:text-white">{item.title_uz}</p>
                          {item.link_url && (
                            <p className="text-xs text-gray-500">{item.link_url}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleItem(item.id!, !!item.is_active)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                          title={item.is_active ? t.inactiveStatus : t.activeStatus}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                        <button
                          onClick={() => openEditItem(item)}
                          className="p-1 text-gray-400 hover:text-[#00a6a6]"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id!)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Bu bo'limda element yo'q</p>
              )
            ) : (
              <p className="text-gray-400 text-center py-8">Chap tarafdan bo'limni tanlang</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION MODAL */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {selectedSection ? t.editSection : t.newSection}
              </h3>
              <button
                onClick={() => { setShowSectionModal(false); setSelectedSection(null) }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t.close}
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.sectionName} (UZ) *</label>
                <input
                  type="text"
                  value={sectionForm.title_uz}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Sahifalar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.sectionName} (RU)</label>
                <input
                  type="text"
                  value={sectionForm.title_ru}
                  onChange={(e) => setSectionForm({ ...sectionForm, title_ru: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Страницы"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
                <input
                  type="text"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="pages"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.order}</label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.status}</label>
                  <select
                    value={sectionForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setSectionForm({ ...sectionForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="true">{t.activeStatus}</option>
                    <option value="false">{t.inactiveStatus}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowSectionModal(false); setSelectedSection(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={selectedSection ? handleUpdateSection : handleCreateSection}
                disabled={saving || !sectionForm.title_uz || !sectionForm.slug}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {selectedItem ? t.editElement : t.newElement}
              </h3>
              <button
                onClick={() => { setShowItemModal(false); setSelectedItem(null) }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t.close}
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.sectionName} (UZ) *</label>
                <input
                  type="text"
                  value={itemForm.title_uz}
                  onChange={(e) => setItemForm({ ...itemForm, title_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.itemLink}</label>
                <input
                  type="text"
                  value={itemForm.link_url}
                  onChange={(e) => setItemForm({ ...itemForm, link_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.new_tab}
                    onChange={(e) => setItemForm({ ...itemForm, new_tab: e.target.checked })}
                    className="rounded text-[#00a6a6]"
                  />
                  <span className="text-sm dark:text-gray-300">{t.newTab}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowItemModal(false); setSelectedItem(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={selectedItem ? handleUpdateItem : handleCreateItem}
                disabled={saving || !itemForm.title_uz}
                className="flex-1 px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 disabled:opacity-50"
              >
                {saving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
