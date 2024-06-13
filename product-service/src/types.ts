type ProductId = string
type ImageUrl = string

export interface Product {
  id: ProductId
  name: string
  description: string
  price: number
  count: number
  image: ImageUrl
}
