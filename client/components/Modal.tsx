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
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-2'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm p-4 sm:p-6'>
        {title && (
          <h3 className='text-base sm:text-lg font-bold mb-2'>{title}</h3>
        )}
        <p className='mb-6 text-gray-700 text-sm sm:text-base break-words'>
          {message}
        </p>
        <div className='flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2'>
          {showCancel && (
            <button
              className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 w-full sm:w-auto'
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            className='px-4 py-2 rounded bg-black text-white hover:bg-gray-800 w-full sm:w-auto'
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
