'use client'

import { FooterContact, CONTACT_TYPE_ICONS } from '@/lib/api/footer'

interface FooterContactsTabProps {
  t: any
  contacts: FooterContact[]
  selectedContact: FooterContact | null
  showContactModal: boolean
  saving: boolean
  contactForm: Partial<FooterContact>
  contactTypes: { value: string; label: string }[]
  setContactForm: (form: Partial<FooterContact>) => void
  setSelectedContact: (contact: FooterContact | null) => void
  setShowContactModal: (show: boolean) => void
  resetContactForm: () => void
  handleCreateContact: () => void
  handleUpdateContact: () => void
  handleDeleteContact: (id: number) => void
  handleToggleContact: (id: number, is_active: boolean) => void
  openEditContact: (contact: FooterContact) => void
}

export default function FooterContactsTab({
  t,
  contacts,
  selectedContact,
  showContactModal,
  saving,
  contactForm,
  contactTypes,
  setContactForm,
  setSelectedContact,
  setShowContactModal,
  resetContactForm,
  handleCreateContact,
  handleUpdateContact,
  handleDeleteContact,
  handleToggleContact,
  openEditContact,
}: FooterContactsTabProps) {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white">{t.contacts}</h2>
          <button
            onClick={() => { resetContactForm(); setSelectedContact(null); setShowContactModal(true) }}
            className="px-4 py-2 bg-[#00a6a6] text-white rounded-lg hover:bg-[#00a6a6]/90 transition-colors"
          >
            + {t.addContact}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.length === 0 ? (
            <p className="col-span-full text-gray-500 text-center py-8">{t.noContacts}</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-gray-500">
                      <i className={contact.icon || CONTACT_TYPE_ICONS[contact.contact_type] || 'fas fa-info'}></i>
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{contact.contact_type}</p>
                      <p className="font-medium dark:text-white">{contact.value}</p>
                      {contact.label_uz && (
                        <p className="text-sm text-gray-500">{contact.label_uz}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleContact(contact.id!, !!contact.is_active)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${contact.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={contact.is_active ? t.inactiveStatus : t.activeStatus}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${contact.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                    <button
                      onClick={() => openEditContact(contact)}
                      className="p-1 text-gray-400 hover:text-[#00a6a6]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id!)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                {selectedContact ? t.editContact : t.addContact}
              </h3>
              <button
                onClick={() => { setShowContactModal(false); setSelectedContact(null) }}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contactType} *</label>
                <select
                  value={contactForm.contact_type}
                  onChange={(e) => setContactForm({ ...contactForm, contact_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {contactTypes.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contactValue} *</label>
                <input
                  type="text"
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contactLabel} (UZ)</label>
                <input
                  type="text"
                  value={contactForm.label_uz}
                  onChange={(e) => setContactForm({ ...contactForm, label_uz: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00a6a6] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Asosiy telefon"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowContactModal(false); setSelectedContact(null) }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={selectedContact ? handleUpdateContact : handleCreateContact}
                disabled={saving || !contactForm.value}
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
