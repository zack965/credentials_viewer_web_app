import { Cridential } from "./Cridential"

export interface Category {
    categorie_id: number
    categorie_name: string
    categorie_description: string
    created_at: string
    updated_at: string
    user_id: number
    parent_categories: Category[]
    child_categories: Category[]
    cridentials: Cridential[]
}