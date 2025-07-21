export interface Admin {
  id: string
  email: string
  nom: string
  role: string
  dateCreation: string
}

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved"
}

export interface Order {
  id: string
  tableId: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "served" | "cancelled"
  total: number
  createdAt: string
  customerName?: string
}

export interface OrderItem {
  dishId: string
  quantity: number
  price: number
  dish?: Dish
}

export interface AuthContextType {
  admin: Admin | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

