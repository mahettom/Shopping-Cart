import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppinCartProviderProps = {
    children: ReactNode;
};

type CartItem = {
    id: number;
    quantity: number;
};

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    openCart: () => void;
    closeCart: () => void;
    cartQuantity: number;
    cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppinCartProviderProps) {

    const [isOpen, setIsOpen] = useState(false);

    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);

    // GET NUMBER OF PRODUCTS IN CART ——————————————————————————————————————————————————————————————
    const cartQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // OPEN CART
    const openCart = () => setIsOpen(true);

    // CLOSE CART
    const closeCart = () => setIsOpen(false);

    // GET QUANTITY ————————————————————————————————————————————————————————————————————————————————
    function getItemQuantity(id: number) {
        // if we have this item in cart give me the quantity
        // else quantity is 0
        return cartItems.find((item) => item.id === id)?.quantity || 0;
    }

    // INCREASE ————————————————————————————————————————————————————————————————————————————————————
    function increaseCartQuantity(id: number) {
        setCartItems((currentItems) => {
            const item = currentItems.find((item) => item.id === id);
            // if not already in Cart
            if (item == null) {
                // return all items + this one
                return [...currentItems, { id, quantity: 1 }];
            } else {
                // if you find product
                return currentItems.map((item) => {
                    // return all items with the quantity of this item increase
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        return item;
                    }
                });
            }
        });
    }

    // DECREASE ————————————————————————————————————————————————————————————————————————————————————
    function decreaseCartQuantity(id: number) {
        setCartItems((currentItems) => {
            // if quantity is 1, return every items to cart except him
            if (currentItems.find((item) => item.id)?.quantity === 1) {
                return currentItems.filter((item) => item.id !== id);
            } else {
                // if you find product, and it have more than 1 as quantity
                // return item in cart and remove 1 from his quantity
                return currentItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return item;
                    }
                });
            }
        });
    }

    // REMOVE ——————————————————————————————————————————————————————————————————————————————————————
    function removeFromCart(id: number) {
        setCartItems((currentItems) => {
            return currentItems.filter((item) => item.id !== id);
        });
    }

    // return the context for passing the logic("function") to all the app
    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                openCart,
                closeCart,
                cartItems,
                cartQuantity,
            }}
        >
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    );
}