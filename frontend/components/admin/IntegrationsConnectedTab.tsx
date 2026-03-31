'use client'

import { Icons } from './Icons'
import {
  AVAILABLE_INTEGRATIONS,
  IntegrationConfig,
  categoryIcons,
} from './integrations-data'

interface IntegrationsConnectedTabProps {
  connectedIntegrations: IntegrationConfig[]
  u: Record<string, string>
  categoryLabels: Record<string, string>
  setActiveTab: (tab: 'hub' | 'projects' | 'available' | 'connected') => void
  openConnectModal: (integration: typeof AVAILABLE_INTEGRATIONS[0], existingConfig?: IntegrationConfig) => void
  handleDisconnect: (config: IntegrationConfig) => void
}

export default function IntegrationsConnectedTab({
  connectedIntegrations,
  u,
  categoryLabels,
  setActiveTab,
  openConnectModal,
  handleDisconnect,
}: IntegrationsConnectedTabProps) {
  if (connectedIntegrations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">
          🔌
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {u.empty_no_connected}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {u.empty_no_connected_desc}
        </p>
        <button
          onClick={() => setActiveTab('available')}
          className="px-4 py-2 bg-[#00a6a6] hover:bg-[#008f8f] text-white rounded-lg text-sm font-medium"
        >
          {u.btn_view_available}
        </button>
      </div>
    )
  }

  // Mijozlar bo'yicha guruhlash
  const grouped = connectedIntegrations.reduce((acc, conn) => {
    const projectName = conn.integration_project?.name_uz || u.without_client
    const projectId = conn.integration_project_id || 0
    if (!acc[projectId]) {
      acc[projectId] = {
        name: projectName,
        integrations: []
      }
    }
    acc[projectId].integrations.push(conn)
    return acc
  }, {} as Record<number, { name: string, integrations: IntegrationConfig[] }>)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([projectId, group]) => (
        <div key={projectId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Mijoz sarlavhasi */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#00a6a6]/10 to-[#0a2d5c]/10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏢</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
              <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {group.integrations.length} {u.integration_word}
              </span>
            </div>
          </div>

          {/* Ulangan servislar */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.integrations.map(conn => {
                const integrationInfo = AVAILABLE_INTEGRATIONS.find(i => i.id === conn.integration_id)
                if (!integrationInfo) return null

                return (
                  <div
                    key={conn.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                      {integrationInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {conn.name}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${conn.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {categoryIcons[integrationInfo.category]} {categoryLabels[integrationInfo.category]}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openConnectModal(integrationInfo, conn)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500"
                        title={u.btn_settings}
                      >
                        {Icons.settings}
                      </button>
                      <button
                        onClick={() => handleDisconnect(conn)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                        title={u.btn_delete}
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
