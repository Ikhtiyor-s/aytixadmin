const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface CategoryData {
  id?: number
  name_uz: string
  name_ru?: string
  name_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  icon?: string
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SubcategoryData {
  id?: number
  name_uz: string
  name_ru?: string
  name_en?: string
  category_id?: number
  order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CategoriesListParams {
  skip?: number
  limit?: number
  is_active?: boolean
}

export const categoriesApi = {
  async list(params: CategoriesListParams = {}): Promise<CategoryData[]> {
    const queryParams = new URLSearchParams()
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString())

    const response = await fetch(`${API_BASE_URL}/project-categories/?${queryParams}`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  async get(id: number): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/project-categories/${id}`)
    if (!response.ok) throw new Error('Failed to fetch category')
    return response.json()
  },

  async create(data: Omit<CategoryData, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/project-categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create category')
    }
    return response.json()
  },

  async update(id: number, data: Partial<CategoryData>, token: string): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/project-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update category')
    }
    return response.json()
  },

  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/project-categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete category')
    }
  },

  // Subcategories
  async listSubcategories(categoryId: number, isActive?: boolean): Promise<SubcategoryData[]> {
    const queryParams = new URLSearchParams()
    if (isActive !== undefined) queryParams.append('is_active', isActive.toString())

    const response = await fetch(`${API_BASE_URL}/project-categories/${categoryId}/subcategories?${queryParams}`)
    if (!response.ok) throw new Error('Failed to fetch subcategories')
    return response.json()
  },

  async createSubcategory(categoryId: number, data: Omit<SubcategoryData, 'id' | 'category_id' | 'created_at' | 'updated_at'>, token: string): Promise<SubcategoryData> {
    const response = await fetch(`${API_BASE_URL}/project-categories/${categoryId}/subcategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to create subcategory')
    }
    return response.json()
  },

  async updateSubcategory(subcategoryId: number, data: Partial<SubcategoryData>, token: string): Promise<SubcategoryData> {
    const response = await fetch(`${API_BASE_URL}/project-categories/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to update subcategory')
    }
    return response.json()
  },

  async deleteSubcategory(subcategoryId: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/project-categories/subcategories/${subcategoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete subcategory')
    }
  }
}
