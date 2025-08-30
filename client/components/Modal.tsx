import React from 'react'

interface ModalProps {
  isOpen: boolean
  title?: string
  message: string
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
      <div className='bg-white rounded-lg shadow-lg max-w-sm w-full p-6'>
        {title && <h3 className='text-lg font-bold mb-2'>{title}</h3>}
        <p className='mb-6 text-gray-700'>{message}</p>
        <div className='flex justify-end space-x-2'>
          {showCancel && (
            <button
              className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800'
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
