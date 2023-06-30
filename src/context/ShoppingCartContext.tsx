import { ReactNode, createContext, useContext, useState } from "react"


type ShoppinCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void

}

type CartItem = {
    id: number
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)


// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}


export function ShoppingCartProvider({ children }: ShoppinCartProviderProps) {

    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // GET QUANTITY ————————————————————————————————————————————————————————————————————————————————
    function getItemQuantity(id: number) {
        // if we have this item in cart give me the quantity
        // else quantity is 0
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    // INCREASE ————————————————————————————————————————————————————————————————————————————————————
    function increaseCartQuantity(id: number) {
        setCartItems(currentItems => {
            const item = currentItems.find(item => item.id === id)
            // if not already in Cart
            if (item == null) {
                // return all items + this one
                return [...currentItems, { id, quantity: 1 }]

            } else {  // if you find product
                return currentItems.map(item => {
                    // return all items with this itemQuantity increase
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else { return item }
                })

            }
        })
    }

    // DECREASE ————————————————————————————————————————————————————————————————————————————————————
    function decreaseCartQuantity(id: number) {
        setCartItems(currentItems => {

            // if quantity is 1, return every items to cart except him
            if (currentItems.find(item => item.id)?.quantity === 1) {
                return currentItems.filter(item => item.id !== id)

            } else {    // if you find product, and it have more than 1 as quantity 
                // return item in cart and remove 1 from quantity 
                return currentItems.map(item => {

                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else { return item }
                })

            }
        })
    }

    // REMOVE ——————————————————————————————————————————————————————————————————————————————————————
    function removeFromCart(id: number) {
        setCartItems(currentItems => {
            return currentItems.filter(item => item.id !== id)
        })
    }


    return <ShoppingCartContext.Provider value={{ getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart }}>{children}</ShoppingCartContext.Provider>
}