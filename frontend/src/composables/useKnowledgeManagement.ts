import { ref } from 'vue'
import type { KnowledgeItem, KnowledgePage } from '@/types/knowledge'
import { knowledgeService } from '@/services/knowledge'

export function useKnowledgeManagement(agentId: string, organizationId: string) {
  // Knowledge list state
  const knowledgeItems = ref<KnowledgeItem[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Modal and upload state
  const showKnowledgeModal = ref(false)
  const activeTab = ref('pdf')
  const files = ref<File[]>([])
  const urls = ref<string[]>([])
  const newUrl = ref('')
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const successMessage = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  // Link state
  const showLinkModal = ref(false)
  const orgKnowledgeItems = ref<KnowledgeItem[]>([])
  const orgCurrentPage = ref(1)
  const orgTotalPages = ref(0)
  const isLoadingOrg = ref(false)

  // Delete state
  const showDeleteConfirm = ref(false)
  const knowledgeToDelete = ref<number | null>(null)

  // Add new state for URL form errors
  const urlFormError = ref<string | null>(null)

  // Add upload error state
  const uploadError = ref<string | null>(null)

  // Fetch knowledge data
  const fetchKnowledge = async () => {
    try {
      isLoading.value = true
      isLoadingOrg.value = true
      error.value = null

      // Fetch both agent and org knowledge in parallel
      const [agentResponse, orgResponse] = await Promise.all([
        knowledgeService.getKnowledgeByAgent(agentId, currentPage.value, pageSize.value),
        knowledgeService.getKnowledgeByOrganization(
          organizationId,
          orgCurrentPage.value,
          pageSize.value,
        ),
      ])

      // Update agent knowledge
      knowledgeItems.value = agentResponse.knowledge
      totalPages.value = agentResponse.pagination.total_pages

      // Update org knowledge
      orgKnowledgeItems.value = orgResponse.knowledge
      orgTotalPages.value = orgResponse.pagination.total_pages
    } catch (err) {
      error.value = 'Failed to load knowledge sources'
      console.error(err)
    } finally {
      isLoading.value = false
      isLoadingOrg.value = false
    }
  }

  // Pagination handler
  const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchKnowledge()
  }

  // Date formatting
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get earliest creation date
  const getFirstCreated = (pages: KnowledgePage[]): string | null => {
    return pages.reduce(
      (earliest, page) => {
        if (!page.created_at) return earliest
        if (!earliest) return page.created_at
        return page.created_at < earliest ? page.created_at : earliest
      },
      null as string | null,
    )
  }

  // URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // File handling methods
  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      files.value = Array.from(input.files)
    }
  }

  const handleFileUpload = async () => {
    if (!files.value.length) return

    try {
      isUploading.value = true
      uploadError.value = null // Clear previous errors
      
      const response = await knowledgeService.uploadPdfFiles(
        files.value,
        organizationId,
        agentId,
        (progress) => {
          uploadProgress.value = progress
        },
      )
      if (response.message) {
        successMessage.value = response.message
        await fetchKnowledge() // Refresh knowledge list
      }
      files.value = []
      if (fileInput.value) fileInput.value.value = ''
    } catch (error: any) {
      console.error('Upload failed:', error)
      uploadError.value = error.message || 'Failed to upload files'
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  // URL handling methods
  const handleUrlAdd = () => {
    if (!newUrl.value) return

    // Clean the URL
    const cleanUrl = newUrl.value.trim()

    // Basic URL validation
    if (!isValidUrl(cleanUrl)) {
      urlFormError.value = 'Please enter a valid URL'
      return
    }

    // Check if URL already exists in knowledgeItems or orgKnowledgeItems
    const urlExistsInAgent = knowledgeItems.value.some((item) => item.name === cleanUrl)
    const urlExistsInOrg = orgKnowledgeItems.value.some((item) => item.name === cleanUrl)

    if (urlExistsInAgent || urlExistsInOrg) {
      urlFormError.value = 'This URL already exists in your knowledge base'
      newUrl.value = ''
      return
    }

    // Check if URL is already in the current batch
    if (urls.value.includes(cleanUrl)) {
      urlFormError.value = 'This URL has already been added to the current batch'
      newUrl.value = ''
      return
    }

    // Add URL to batch
    urls.value.push(cleanUrl)
    newUrl.value = ''
    urlFormError.value = null
  }

  const removeUrl = (index: number) => {
    urls.value.splice(index, 1)
  }

  const handleUrlUpload = async () => {
    if (!urls.value.length) return

    try {
      isUploading.value = true
      uploadError.value = null // Clear previous errors
      
      const response = await knowledgeService.addUrls(
        organizationId,
        urls.value,
        agentId,
        (progress) => {
          uploadProgress.value = progress
        },
      )
      if (response.message) {
        successMessage.value = response.message
        await fetchKnowledge() // Refresh knowledge list
      }
      urls.value = []
    } catch (error: any) {
      console.error('URL upload failed:', error)
      uploadError.value = error.message || 'Failed to upload URLs'
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  const fetchOrgKnowledge = async () => {
    try {
      isLoadingOrg.value = true
      const response = await knowledgeService.getKnowledgeByOrganization(
        organizationId,
        orgCurrentPage.value,
        pageSize.value,
      )
      orgKnowledgeItems.value = response.knowledge
      orgTotalPages.value = response.pagination.total_pages
    } catch (err) {
      console.error(err)
    } finally {
      isLoadingOrg.value = false
    }
  }

  const handleOrgPageChange = (page: number) => {
    orgCurrentPage.value = page
    fetchOrgKnowledge()
  }

  const linkKnowledge = async (knowledgeId: number) => {
    try {
      await knowledgeService.linkToAgent(knowledgeId, agentId)
      await fetchKnowledge() // Refresh agent knowledge
    } catch (error) {
      console.error('Error linking knowledge:', error)
    }
  }

  const unlinkKnowledge = async (knowledgeId: number) => {
    try {
      await knowledgeService.unlinkFromAgent(knowledgeId, agentId)
      await fetchKnowledge() // Refresh agent knowledge
    } catch (error) {
      console.error('Error unlinking knowledge:', error)
    }
  }

  // Delete methods
  const confirmDelete = (knowledgeId: number) => {
    knowledgeToDelete.value = knowledgeId
    showDeleteConfirm.value = true
  }

  const handleDelete = async () => {
    if (!knowledgeToDelete.value) return

    try {
      await knowledgeService.deleteKnowledge(knowledgeToDelete.value)
      await fetchKnowledge() // Refresh the list
      showDeleteConfirm.value = false
      knowledgeToDelete.value = null
    } catch (err) {
      console.error('Error deleting knowledge:', err)
      error.value = 'Failed to delete knowledge source'
    }
  }

  const cancelDelete = () => {
    showDeleteConfirm.value = false
    knowledgeToDelete.value = null
  }

  return {
    // State
    knowledgeItems,
    currentPage,
    pageSize,
    totalPages,
    isLoading,
    error,
    showKnowledgeModal,
    activeTab,
    files,
    urls,
    newUrl,
    isUploading,
    uploadProgress,
    successMessage,
    fileInput,
    showLinkModal,
    orgKnowledgeItems,
    orgCurrentPage,
    orgTotalPages,
    isLoadingOrg,
    showDeleteConfirm,
    knowledgeToDelete,
    urlFormError,
    uploadError,

    // Methods
    fetchKnowledge,
    handlePageChange,
    formatDate,
    getFirstCreated,
    isValidUrl,
    triggerFileInput,
    handleFileSelect,
    handleFileUpload,
    handleUrlAdd,
    removeUrl,
    handleUrlUpload,
    fetchOrgKnowledge,
    handleOrgPageChange,
    linkKnowledge,
    unlinkKnowledge,
    confirmDelete,
    handleDelete,
    cancelDelete,
  }
}
