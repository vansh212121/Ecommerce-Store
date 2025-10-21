export const mockProducts = [
    {
        id: "1",
        name: "Essential Cotton Tee",
        price: 45,
        category: "unisex",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description:
            "Premium organic cotton t-shirt with a relaxed fit. Perfect for everyday wear.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Navy", "Stone"],
        isNew: true,
        isFeatured: true,
        stock: 120
    },
    {
        id: "2",
        name: "Tailored Wool Blazer",
        price: 285,
        category: "women",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description:
            "Elegant wool blazer with structured shoulders and a modern silhouette.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Charcoal", "Camel", "Navy"],
        isFeatured: true,
        stock: 45
    },
    {
        id: "3",
        name: "Slim Fit Chinos",
        price: 98,
        category: "men",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description: "Modern slim-fit chinos crafted from stretch cotton twill.",
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Khaki", "Navy", "Olive", "Black"],
        isNew: true,
        stock: 80
    },
    {
        id: "4",
        name: "Cashmere Sweater",
        price: 195,
        category: "women",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description: "Luxuriously soft cashmere crewneck sweater.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Ivory", "Blush", "Charcoal"],
        stock: 60
    },
    {
        id: "5",
        name: "Relaxed Denim Jacket",
        price: 135,
        category: "unisex",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description: "Classic denim jacket with a comfortable relaxed fit.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Light Wash", "Dark Wash", "Black"],
        isNew: true,
        isFeatured: true,
        stock: 95
    },
    {
        id: "6",
        name: "Oxford Button-Down",
        price: 78,
        category: "men",
        images: ["/placeholder.svg", "/placeholder.svg"],
        description: "Timeless oxford cloth button-down shirt.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Blue", "Pink"],
        stock: 110
    }
]

export const mockOrders = [
    {
        id: "ORD-001",
        date: "2025-10-15",
        status: "delivered",
        total: 323,
        items: []
    },
    {
        id: "ORD-002",
        date: "2025-10-18",
        status: "shipped",
        total: 195,
        items: []
    }
]
