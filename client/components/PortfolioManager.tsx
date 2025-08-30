'use client'

import { useState, useEffect } from 'react'
import {
  PortfolioItem,
  fetchPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../utils/portfolioApi'
import dynamic from 'next/dynamic'
import { DropResult } from 'react-beautiful-dnd'
import CloudinaryImage from './CloudinaryImage'
import ImageUpload from './ImageUpload'
import {
  Plus,
  X,
  Edit2,
  Save,
  Trash2,
  Image,
  Filter,
  Calendar,
  Move,
  GripVertical,
} from 'lucide-react'
import Modal from './Modal'

// Dynamic import to avoid SSR issues
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.DragDropContext),
  { ssr: false }
)
const Droppable = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.Droppable),
  { ssr: false }
)
const Draggable = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.Draggable),
  { ssr: false }
)

interface PersistentPortfolioManagerProps {
  isAdmin?: boolean
}

export default function PersistentPortfolioManager({
  isAdmin = false,
}: PersistentPortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ category: 'wedding', title: '' })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [modal, setModal] = useState<{
    open: boolean
    message: string
    title: string
    onConfirm: (() => void) | null
    showCancel: boolean
  }>({
    open: false,
    message: '',
    title: '',
    onConfirm: null,
    showCancel: false,
  })

  const categories = ['all', 'wedding', 'portrait', 'fashion', 'commercial']

  useEffect(() => {
    async function loadPortfolio() {
      setLoading(true)
      try {
        const data = await fetchPortfolio()
        setItems(data)
      } catch (error) {
        console.error('Failed to load portfolio:', error)
        setModal({
          open: true,
          message: 'Failed to load portfolio. Please refresh the page.',
          title: 'Error',
          onConfirm: () => setModal((m) => ({ ...m, open: false })),
          showCancel: false,
        })
      } finally {
        setLoading(false)
      }
    }
    loadPortfolio()
  }, [])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !isAdmin) return

    const { source, destination } = result

    // Don't do anything if dropped in the same place
    if (source.index === destination.index) return

    const reorderedItems = Array.from(filteredItems)
    const [reorderedItem] = reorderedItems.splice(source.index, 1)
    reorderedItems.splice(destination.index, 0, reorderedItem)

    // Update local state immediately for better UX
    setItems((prevItems) => {
      const newItems = [...prevItems]
      reorderedItems.forEach((item, index) => {
        const itemIndex = newItems.findIndex((i) => i.id === item.id)
        if (itemIndex !== -1) {
          newItems[itemIndex] = { ...item, order: index + 1 }
        }
      })
      return newItems.sort((a, b) => (a.order || 0) - (b.order || 0))
    })

    // TODO: Implement reorder API call if needed
    // await reorderPortfolioItems(reorderedItems.map(item => item.id))
  }

  const handleUploadSuccess = async (cloudinaryData: any) => {
    try {
      const item: PortfolioItem = {
        category: newItem.category,
        title: newItem.title || cloudinaryData.original_filename,
        publicId: cloudinaryData.public_id,
        isCloudinary: true,
        cloudinaryUrl: cloudinaryData.secure_url || '',
        uploadedAt: new Date().toISOString(),
        order: items.length + 1,
      }
      const saved = await addPortfolioItem(item)
      setItems((prev) => [...prev, saved])
      setNewItem({ category: 'wedding', title: '' })
      setShowUpload(false)
    } catch (error) {
      console.error('Failed to save portfolio item:', error)
      setModal({
        open: true,
        message: 'Failed to save image. Please try again.',
        title: 'Upload Error',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
    }
  }

  const handleBulkDelete = async () => {
    const itemsToDelete = items.filter((item) =>
      selectedItems.includes(item.id || '')
    )
    const confirmMessage = `Are you sure you want to permanently delete ${
      selectedItems.length
    } image(s)?\n\nImages to be deleted:\n${itemsToDelete
      .map((item) => `• ${item.title}`)
      .join('\n')}\n\nThis action cannot be undone.`

    setModal({
      open: true,
      message: confirmMessage,
      title: 'Confirm Bulk Delete',
      showCancel: true,
      onConfirm: async () => {
        try {
          await Promise.all(selectedItems.map((id) => deletePortfolioItem(id)))
          setItems((prev) =>
            prev.filter((item) => !selectedItems.includes(item.id || ''))
          )
          setSelectedItems([])
          setShowBulkActions(false)
          setModal({
            open: true,
            message: `${itemsToDelete.length} image(s) deleted successfully`,
            title: 'Deleted',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        } catch (error) {
          console.error('Failed to delete items:', error)
          setModal({
            open: true,
            message: 'Failed to delete some items. Please try again.',
            title: 'Delete Error',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        }
      },
    })
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(
        filteredItems
          .map((item) => item.id)
          .filter((id): id is string => typeof id === 'string')
      )
    }
  }

  const handleDeleteItem = async (id: string) => {
    const itemToDelete = items.find((item) => item.id === id)
    const confirmMessage = itemToDelete
      ? `Are you sure you want to permanently delete "${itemToDelete.title}"?\n\nThis action cannot be undone and will remove the image from:\n• Portfolio gallery\n• Hero slideshow (if selected)\n• All categories`
      : 'Are you sure you want to delete this item?'

    setModal({
      open: true,
      message: confirmMessage,
      title: 'Confirm Delete',
      showCancel: true,
      onConfirm: async () => {
        try {
          await deletePortfolioItem(id)
          setItems((prev) => prev.filter((item) => item.id !== id))
          setModal({
            open: true,
            message: `"${itemToDelete?.title || 'Image'}" deleted successfully`,
            title: 'Deleted',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        } catch (error) {
          console.error('Failed to delete item:', error)
          setModal({
            open: true,
            message: 'Failed to delete image. Please try again.',
            title: 'Delete Error',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
            showCancel: false,
          })
        }
      },
    })
  }

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      const updated = await updatePortfolioItem(
        editingItem.id || '',
        editingItem
      )
      setItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updated : item))
      )
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to update item:', error)
      setModal({
        open: true,
        title: 'Save Error',
        message: 'Failed to save changes. Please try again.',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
        showCancel: false,
      })
    }
  }

  // Filter items based on active filter and sort by order
  const filteredItems = (
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.category === activeFilter)
  ).sort((a, b) => (a.order || 0) - (b.order || 0))

  if (loading) {
    return (
      <div className='flex items-center justify-center p-16'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={
          modal.onConfirm || (() => setModal((m) => ({ ...m, open: false })))
        }
        showCancel={modal.showCancel}
      />

      <div className='space-y-10 px-2 sm:px-4 md:px-8'>
        {/* Admin Controls */}
        {isAdmin && (
          <div className='bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-8 py-6 border-b border-gray-200'>
              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6'>
                <div className='flex items-center space-x-4'>
                  <div className='p-3 bg-black rounded-xl'>
                    <Image className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      Portfolio Management
                    </h3>
                    <p className='text-gray-600 mt-1'>
                      Manage your photography portfolio with ease
                    </p>
                    <div className='flex flex-wrap items-center space-x-2 mt-2'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-2 sm:mb-0'>
                        {items.length} images
                      </span>
                      <span className='text-sm text-gray-500'>
                        Face detection enabled • Drag grip handles to reorder
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4'>
                  <button
                    onClick={() => setShowUpload(!showUpload)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      showUpload
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    } w-full sm:w-auto`}
                  >
                    {showUpload ? <X size={18} /> : <Plus size={18} />}
                    <span>{showUpload ? 'Close' : 'Add New Image'}</span>
                  </button>

                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        setShowBulkActions(!showBulkActions)
                        if (showBulkActions) {
                          setSelectedItems([])
                        }
                      }}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        showBulkActions
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } w-full sm:w-auto`}
                    >
                      <Trash2 size={18} />
                      <span>{showBulkActions ? 'Cancel' : 'Bulk Delete'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showUpload && (
              <div className='p-8'>
                <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-6'>
                    Upload New Image
                  </h4>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Category
                      </label>
                      <select
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all'
                      >
                        {categories
                          .filter((cat) => cat !== 'all')
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Image Title
                      </label>
                      <input
                        type='text'
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder='Enter a descriptive title'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all'
                      />
                    </div>
                  </div>

                  <ImageUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(error) => {
                      console.error('Upload error:', error)
                      setModal({
                        open: true,
                        message: 'Upload failed. Please try again.',
                        title: 'Upload Error',
                        onConfirm: () =>
                          setModal((m) => ({ ...m, open: false })),
                        showCancel: false,
                      })
                    }}
                    className='mb-6'
                  />

                  <div className='flex justify-end space-x-3'>
                    <button
                      onClick={() => setShowUpload(false)}
                      className='px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-medium'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {showBulkActions && isAdmin && (
          <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={
                      selectedItems.length === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={toggleSelectAll}
                    className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    Select All ({filteredItems.length})
                  </span>
                </label>
                {selectedItems.length > 0 && (
                  <span className='text-sm text-blue-600 font-medium'>
                    {selectedItems.length} item(s) selected
                  </span>
                )}
              </div>

              {selectedItems.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className='flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium'
                >
                  <Trash2 size={16} />
                  <span>Delete Selected ({selectedItems.length})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className='flex justify-center'>
          <div
            className='flex flex-row flex-nowrap items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm'
            style={{ minWidth: '440px', maxWidth: '100%' }}
          >
            <Filter className='w-4 h-4 text-gray-500 ml-3 mr-2 flex-shrink-0' />
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all duration-300 text-xs sm:text-sm uppercase tracking-widest rounded-lg mx-1 ${
                  activeFilter === filter
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
                style={{ minWidth: '80px' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        {filteredItems.length === 0 ? (
          <div className='text-center py-10 px-2 sm:px-8'>
            <div className='max-w-md mx-auto'>
              <div className='p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
                <Image className='w-8 h-8 text-gray-400' />
              </div>
              <h4 className='text-lg sm:text-xl font-semibold text-gray-900 mb-3'>
                No images found
                {activeFilter !== 'all' ? ` in ${activeFilter} category` : ''}
              </h4>
              <p className='text-gray-500 mb-6'>
                {isAdmin
                  ? 'Upload your first image to get started with your portfolio'
                  : 'Check back soon for new portfolio additions'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowUpload(true)}
                  className='inline-flex items-center space-x-2 bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-xs sm:text-base'
                >
                  <Plus size={18} />
                  <span>Upload Your First Image</span>
                </button>
              )}
            </div>
          </div>
        ) : isAdmin ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='portfolio-grid'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-colors duration-200 ${
                    snapshot.isDraggingOver
                      ? 'bg-blue-50/50 rounded-lg p-4'
                      : ''
                  }`}
                >
                  {filteredItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id || ''}
                      index={index}
                      isDragDisabled={!isAdmin}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 ${
                            index % 4 === 0
                              ? 'lg:col-span-2 aspect-[3/2]'
                              : index % 3 === 0
                              ? 'md:row-span-2 aspect-[4/5]'
                              : 'aspect-square'
                          } ${
                            snapshot.isDragging
                              ? 'rotate-2 scale-105 shadow-2xl border-blue-400 z-50'
                              : 'hover:-translate-y-1'
                          }`}
                        >
                          {/* Drag Handle (Admin Only) */}
                          {isAdmin && (
                            <div
                              {...provided.dragHandleProps}
                              className='absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 cursor-grab hover:cursor-grabbing hover:bg-white transition-all duration-200 hover:scale-110'
                              title='Drag to reorder'
                            >
                              <GripVertical
                                size={16}
                                className='text-gray-600'
                              />
                            </div>
                          )}

                          {/* Selection Checkbox (Bulk Delete Mode) */}
                          {showBulkActions && isAdmin && (
                            <div className='absolute top-3 left-3 z-30'>
                              <label className='flex items-center cursor-pointer'>
                                <input
                                  type='checkbox'
                                  checked={
                                    item.id
                                      ? selectedItems.includes(item.id)
                                      : false
                                  }
                                  onChange={() =>
                                    item.id && toggleItemSelection(item.id)
                                  }
                                  className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white/90 backdrop-blur-sm shadow-lg'
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </label>
                            </div>
                          )}

                          {/* Image */}
                          <div className='relative overflow-hidden'>
                            <CloudinaryImage
                              publicId={item.publicId ?? ''}
                              width={600}
                              height={600}
                              alt={item.title}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                              gravity='faces'
                              highQuality={true}
                            />
                          </div>

                          {/* Overlay */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-8'>
                            <div className='text-center text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-300'>
                              <div className='w-16 h-0.5 bg-white mx-auto mb-4 opacity-80'></div>
                              <h3 className='text-xl font-bold mb-2'>
                                {item.title}
                              </h3>
                              <p className='text-sm opacity-90 uppercase tracking-[0.2em] font-medium mb-2'>
                                {item.category}
                              </p>
                              <div className='flex items-center justify-center space-x-2 text-xs opacity-70 mb-4'>
                                <Calendar className='w-3 h-3' />
                                <span>
                                  {new Date(
                                    item.uploadedAt || Date.now()
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Admin Actions */}
                              {isAdmin && (
                                <div className='flex justify-center space-x-3'>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditItem(item)
                                    }}
                                    className='p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-110'
                                    title='Edit image details'
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      item.id && handleDeleteItem(item.id)
                                    }}
                                    className='p-3 bg-red-500/30 backdrop-blur-sm rounded-lg hover:bg-red-500/50 transition-all duration-200 border border-red-400/50 hover:scale-110 hover:border-red-300'
                                    title='Delete image permanently'
                                  >
                                    <Trash2
                                      size={16}
                                      className='text-red-100 hover:text-white'
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Delete Button */}
                          {isAdmin && !showBulkActions && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                item.id && handleDeleteItem(item.id)
                              }}
                              className='absolute top-3 right-12 z-30 p-2 bg-red-500/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-red-400/50 hover:bg-red-600 hover:scale-110 shadow-lg'
                              title='Delete image permanently'
                            >
                              <Trash2 size={16} className='text-white' />
                            </button>
                          )}

                          {/* Category Badge */}
                          <div className='absolute top-3 left-3 z-20'>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm border border-white/20'>
                              {item.category.toUpperCase()}
                            </span>
                          </div>

                          {/* Position Badge */}
                          {isAdmin && (
                            <div className='absolute bottom-3 left-3 z-20'>
                              <span className='inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-blue-500/80 text-white backdrop-blur-sm border border-white/20'>
                                {index + 1}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // Static grid for non-admin users
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 ${
                  index % 4 === 0
                    ? 'lg:col-span-2 aspect-[3/2]'
                    : index % 3 === 0
                    ? 'md:row-span-2 aspect-[4/5]'
                    : 'aspect-square'
                }`}
              >
                <div className='relative overflow-hidden'>
                  <CloudinaryImage
                    publicId={item.publicId ?? ''}
                    width={600}
                    height={600}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    gravity='faces'
                    highQuality={true}
                  />
                </div>

                {/* Image overlay for non-admin */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-8'>
                  <div className='text-center text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-300'>
                    <div className='w-16 h-0.5 bg-white mx-auto mb-4 opacity-80'></div>
                    <h3 className='text-xl font-bold mb-2'>{item.title}</h3>
                    <p className='text-sm opacity-90 uppercase tracking-[0.2em] font-medium mb-2'>
                      {item.category}
                    </p>
                    <div className='flex items-center justify-center space-x-2 text-xs opacity-70'>
                      <Calendar className='w-3 h-3' />
                      <span>
                        {new Date(
                          item.uploadedAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {filteredItems.length > 0 && (
          <div className='flex justify-center'>
            <div className='inline-flex flex-wrap items-center space-x-2 sm:space-x-6 bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-200 w-full max-w-lg'>
              <span className='text-xs sm:text-sm text-gray-600'>
                Showing{' '}
                <span className='font-semibold text-gray-900'>
                  {filteredItems.length}
                </span>{' '}
                of{' '}
                <span className='font-semibold text-gray-900'>
                  {items.length}
                </span>{' '}
                images
              </span>
              {activeFilter !== 'all' && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className='text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline'
                >
                  View all categories
                </button>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200'>
              <div className='px-8 py-6 border-b border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900'>
                  Edit Portfolio Item
                </h3>
                <p className='text-gray-600 text-sm mt-1'>
                  Update the details for this image
                </p>
              </div>

              <div className='p-8 space-y-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Image Title
                  </label>
                  <input
                    type='text'
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all'
                    placeholder='Enter a descriptive title'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-900 mb-3'>
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all'
                  >
                    {categories
                      .filter((cat) => cat !== 'all')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className='px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3'>
                <button
                  onClick={() => setEditingItem(null)}
                  className='px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-medium'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className='bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all flex items-center space-x-2 font-semibold shadow-lg'
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
