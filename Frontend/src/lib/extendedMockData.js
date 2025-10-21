// Images
import whiteTee from "@/assets/products/white-tee.jpg"
import blazer from "@/assets/products/blazer.jpg"
import chinos from "@/assets/products/chinos.jpg"
import cashmere from "@/assets/products/cashmere.jpg"
import denimJacket from "@/assets/products/denim-jacket.jpg"
import oxford from "@/assets/products/oxford.jpg"
import boots from "@/assets/products/boots.jpg"
import midiDress from "@/assets/products/midi-dress.jpg"
import trench from "@/assets/products/trench.jpg"
import joggers from "@/assets/products/joggers.jpg"

export const extendedProducts = [
    {
        id: "1",
        name: "Essential Cotton Tee",
        price: 45,
        category: "unisex",
        images: [whiteTee, whiteTee],
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
        images: [blazer, blazer],
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
        images: [chinos, chinos],
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
        images: [cashmere, cashmere],
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
        images: [denimJacket, denimJacket],
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
        images: [oxford, oxford],
        description: "Timeless oxford cloth button-down shirt.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Blue", "Pink"],
        stock: 110
    },
    {
        id: "7",
        name: "Leather Ankle Boots",
        price: 245,
        category: "women",
        images: [boots, boots],
        description: "Premium leather ankle boots with a sleek silhouette.",
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Black", "Brown", "Cognac"],
        isNew: true,
        stock: 55
    },
    {
        id: "8",
        name: "Midi Wrap Dress",
        price: 165,
        category: "women",
        images: [midiDress, midiDress],
        description: "Elegant midi dress with flattering wrap design.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Navy", "Forest Green"],
        isFeatured: true,
        stock: 70
    },
    {
        id: "9",
        name: "Classic Trench Coat",
        price: 325,
        category: "women",
        images: [trench, trench],
        description: "Iconic trench coat in water-resistant fabric.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Beige", "Black", "Navy"],
        stock: 40
    },
    {
        id: "10",
        name: "Athletic Joggers",
        price: 68,
        category: "unisex",
        images: [joggers, joggers],
        description: "Comfortable cotton-blend joggers for active days.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Gray", "Black", "Navy"],
        isNew: true,
        stock: 150
    },
    {
        id: "11",
        name: "Merino Wool Cardigan",
        price: 145,
        category: "men",
        images: [cashmere, cashmere],
        description: "Soft merino wool cardigan with button closure.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Charcoal", "Oatmeal"],
        stock: 65
    },
    {
        id: "12",
        name: "Silk Blouse",
        price: 125,
        category: "women",
        images: [oxford, oxford],
        description: "Elegant silk blouse with delicate draping.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Ivory", "Blush", "Navy"],
        isFeatured: true,
        stock: 50
    },
    {
        id: "13",
        name: "Wide Leg Trousers",
        price: 115,
        category: "women",
        images: [chinos, chinos],
        description: "High-waisted wide leg trousers in fluid fabric.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Cream", "Navy"],
        isNew: true,
        stock: 75
    },
    {
        id: "14",
        name: "Quilted Vest",
        price: 95,
        category: "unisex",
        images: [denimJacket, denimJacket],
        description: "Lightweight quilted vest perfect for layering.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Olive"],
        stock: 85
    },
    {
        id: "15",
        name: "Linen Shorts",
        price: 72,
        category: "men",
        images: [chinos, chinos],
        description: "Breathable linen shorts with a modern fit.",
        sizes: ["30", "32", "34", "36"],
        colors: ["Khaki", "Navy", "Stone"],
        stock: 90
    },
    {
        id: "16",
        name: "Turtleneck Sweater",
        price: 88,
        category: "unisex",
        images: [cashmere, cashmere],
        description: "Classic turtleneck in soft cotton blend.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Cream", "Gray"],
        isNew: true,
        stock: 100
    },
    {
        id: "17",
        name: "Pleated Midi Skirt",
        price: 92,
        category: "women",
        images: [midiDress, midiDress],
        description: "Elegant pleated midi skirt in flowing fabric.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Navy", "Burgundy"],
        stock: 68
    },
    {
        id: "18",
        name: "Bomber Jacket",
        price: 175,
        category: "men",
        images: [denimJacket, denimJacket],
        description: "Classic bomber jacket with modern details.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Olive"],
        isFeatured: true,
        stock: 52
    },
    {
        id: "19",
        name: "Knit Maxi Dress",
        price: 158,
        category: "women",
        images: [midiDress, midiDress],
        description: "Comfortable knit maxi dress with elegant drape.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Camel", "Gray"],
        stock: 45
    },
    {
        id: "20",
        name: "Performance Polo",
        price: 65,
        category: "men",
        images: [whiteTee, whiteTee],
        description: "Moisture-wicking polo shirt in technical fabric.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Navy", "Black", "Gray"],
        isNew: true,
        stock: 125
    }
]
