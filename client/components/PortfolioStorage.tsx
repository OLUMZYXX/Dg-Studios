'use client'

interface PortfolioItem {
  id: string
  category: string
  title: string
  publicId: string
  cloudinaryUrl: string
  uploadedAt: string
  order: number
  isCloudinary?: boolean
  image?: string
}

// Portfolio storage utilities
export class PortfolioStorage {
  private static STORAGE_KEY = 'dg_studio_portfolio'
  private static SHOWCASE_KEY = 'dg_studio_portfolio_showcase'
  // Save showcase IDs
  static setShowcaseIds(ids: string[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SHOWCASE_KEY, JSON.stringify(ids))
    }
  }

  // Get showcase IDs
  static getShowcaseIds(): string[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.SHOWCASE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  }

  // Save portfolio items to localStorage
  static savePortfolio(items: PortfolioItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items))
    }
  }

  // Load portfolio items from localStorage
  static loadPortfolio(): PortfolioItem[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  }

  // Add a new item
  static addItem(
    item: Omit<PortfolioItem, 'id' | 'uploadedAt' | 'order'>
  ): PortfolioItem {
    const items = this.loadPortfolio()
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
      order: items.length, // Set order to current length (append to end)
    }

    items.push(newItem)
    this.savePortfolio(items)
    return newItem
  }

  // Remove an item
  static removeItem(id: string): PortfolioItem[] {
    const items = this.loadPortfolio().filter((item) => item.id !== id)
    this.savePortfolio(items)
    return items
  }

  // Update an item
  static updateItem(
    id: string,
    updates: Partial<PortfolioItem>
  ): PortfolioItem[] {
    const items = this.loadPortfolio().map((item) =>
      item.id === id ? { ...item, ...updates } : item
    )
    this.savePortfolio(items)
    return items
  }

  // Get items by category
  static getByCategory(category: string): PortfolioItem[] {
    return this.loadPortfolio().filter(
      (item) => category === 'all' || item.category === category
    )
  }

  // Reorder items within a specific category
  static reorderItemsInCategory(
    category: string,
    reorderedIds: string[]
  ): PortfolioItem[] {
    const allItems = this.loadPortfolio()
    const categoryItems = allItems.filter((item) =>
      category === 'all' ? true : item.category === category
    )
    const otherItems = allItems.filter((item) =>
      category === 'all' ? false : item.category !== category
    )

    // Create a map of current items for quick lookup
    const itemMap = new Map(categoryItems.map((item) => [item.id, item]))

    // Reorder the category items based on the new order
    const reorderedCategoryItems = reorderedIds
      .map((id) => itemMap.get(id))
      .filter(Boolean) as PortfolioItem[]

    // Update order values for reordered items
    const updatedCategoryItems = reorderedCategoryItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    // Combine with other category items and save
    const finalItems = [...otherItems, ...updatedCategoryItems].sort(
      (a, b) => a.order - b.order
    )

    this.savePortfolio(finalItems)
    return finalItems
  }

  // Get items sorted by order
  static getItemsSortedByOrder(): PortfolioItem[] {
    return this.loadPortfolio().sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  // Fix missing order values for existing items
  static fixMissingOrders(): void {
    const items = this.loadPortfolio()
    let hasChanges = false

    const fixedItems = items.map((item, index) => {
      if (item.order === undefined || item.order === null) {
        hasChanges = true
        return { ...item, order: index }
      }
      return item
    })

    if (hasChanges) {
      this.savePortfolio(fixedItems)
    }
  }
}

export type { PortfolioItem }
