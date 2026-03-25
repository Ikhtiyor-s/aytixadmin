'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { messagesApi, MessageData } from '@/lib/api/messages'
import { Icons } from './Icons'
import { Translations } from '@/lib/admin/translations'

interface MessagesPageProps {
  t: Translations
}

export default function MessagesPage({ t }: MessagesPageProps) {
  const { token, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<MessageData[]>([])
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 })
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && token) {
      loadData()
    }
  }, [token, authLoading])

  const loadData = async () => {
    try {
      setLoading(true)
      const [messagesData, statsData] = await Promise.all([
        messagesApi.list(),
        messagesApi.getStats()
      ])
      setMessages(messagesData)
      setStats(statsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return
    try {
      await messagesApi.update(selectedMessage.id, { reply: replyText })
      setShowModal(false)
      setReplyText('')
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await messagesApi.update(id, { status })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteMessageConfirm)) return
    try {
      await messagesApi.delete(id)
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      read: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
    const labels: Record<string, string> = { new: t.newMsgStatus, read: t.readMsgStatus, replied: t.repliedMsgStatus, archived: t.archivedLabel }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{labels[status]}</span>
  }

  const filteredMessages = statusFilter === 'all' ? messages : messages.filter(m => m.status === statusFilter)

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a6a6]"></div></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.messages}</h1>
          <p className="text-sm text-gray-500">{t.messagesDesc}</p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-xl text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {t.refresh}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: t.total, value: stats.total, color: 'from-[#00a6a6] to-[#0a2d5c]' },
          { label: t.newMsgStatus, value: stats.new, color: 'from-blue-500 to-blue-600' },
          { label: t.readMsgStatus, value: stats.read, color: 'from-gray-500 to-gray-600' },
          { label: t.repliedMsgStatus, value: stats.replied, color: 'from-green-500 to-green-600' },
          { label: t.archivedLabel, value: stats.archived, color: 'from-yellow-500 to-yellow-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2`}>
              {Icons.messages}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">{t.status}:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm dark:text-white">
            <option value="all">{t.all}</option>
            <option value="new">{t.newMsgStatus}</option>
            <option value="read">{t.readMsgStatus}</option>
            <option value="replied">{t.repliedMsgStatus}</option>
            <option value="archived">{t.archivedLabel}</option>
          </select>
          <span className="ml-auto text-sm text-gray-500">{filteredMessages.length} {t.messageCount}</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t.messagesNotFound}</div>
        ) : filteredMessages.map((msg) => (
          <div key={msg.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {msg.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{msg.name}</span>
                  {getStatusBadge(msg.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{msg.subject}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(msg.created_at)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setSelectedMessage(msg); setShowModal(true); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title={t.view}>{Icons.eye}</button>
                <button onClick={() => handleStatusChange(msg.id, 'archived')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title={t.archiveAction}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </button>
                <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500" title={t.delete}>{Icons.trash}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View/Reply Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.messageModal}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00a6a6] to-[#0a2d5c] flex items-center justify-center text-white font-medium">
                  {selectedMessage.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                </div>
                {getStatusBadge(selectedMessage.status)}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="font-medium text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</p>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                <p className="text-xs text-gray-400 mt-3">{formatDate(selectedMessage.created_at)}</p>
              </div>
              {selectedMessage.reply && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">{t.replyAnswer}:</p>
                  <p className="text-gray-600 dark:text-gray-300">{selectedMessage.reply}</p>
                </div>
              )}
              {!selectedMessage.reply && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.writeReply}</label>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder={t.replyPlaceholder} />
                  <button onClick={handleReply} disabled={!replyText.trim()} className="mt-3 w-full px-4 py-2.5 bg-[#00a6a6] hover:bg-[#008f8f] disabled:opacity-50 text-white rounded-xl text-sm font-medium">
                    {t.sendReply}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
