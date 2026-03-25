import api from '@/services/api'

export interface CategoryData {
  id?: number
  name_uz: string
  name_ru?: string
  name_en?: string
  description_uz?: string
  description_ru?: string
  description_en?: string
  icon?: string
  is_active?: boolean
  order?: number
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface SubcategoryData {
  id?: number
  category_id: number
  name_uz: string
  name_ru?: string
  name_en?: string
  is_active?: boolean
  order?: number
  order_index?: number
  created_at?: string
  updated_at?: string
}

export const categoriesApi = {
  async list(params: { skip?: number; limit?: number; is_active?: boolean } = {}): Promise<CategoryData[]> {
    const res = await api.get('/project-categories/', { params })
    return res.data
  },
  async get(id: number): Promise<CategoryData> {
    const res = await api.get(`/project-categories/${id}`)
    return res.data
  },
  async create(data: Partial<CategoryData>): Promise<CategoryData> {
    const res = await api.post('/project-categories/', data)
    return res.data
  },
  async update(id: number, data: Partial<CategoryData>): Promise<CategoryData> {
    const res = await api.put(`/project-categories/${id}`, data)
    return res.data
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/project-categories/${id}`)
  },
  async listSubcategories(categoryId: number, isActive?: boolean): Promise<SubcategoryData[]> {
    const res = await api.get(`/project-categories/${categoryId}/subcategories`, { params: isActive !== undefined ? { is_active: isActive } : {} })
    return res.data
  },
  async createSubcategory(categoryId: number, data: Partial<SubcategoryData>): Promise<SubcategoryData> {
    const res = await api.post(`/project-categories/${categoryId}/subcategories`, data)
    return res.data
  },
  async updateSubcategory(subcategoryId: number, data: Partial<SubcategoryData>): Promise<SubcategoryData> {
    const res = await api.put(`/project-categories/subcategories/${subcategoryId}`, data)
    return res.data
  },
  async deleteSubcategory(subcategoryId: number): Promise<void> {
    await api.delete(`/project-categories/subcategories/${subcategoryId}`)
  },
}
