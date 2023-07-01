import { useShoppingCart } from "../context/ShoppingCartContext"
import { Stack, Button } from "react-bootstrap"
import storeItems from '../data/items.json'
import { formatCurrency } from "../utilities/formatCurrency"


type CartItemProps = {
    id: number
    quantity: number
}


export function CartItem({ id, quantity }: CartItemProps) {

    const { removeFromCart } = useShoppingCart()


    const item = storeItems.find(item => item.id === id)
    if (item === null) return null


    return (

        <Stack direction='horizontal' gap={2} className='d-flex align-items-center'>

            <img src={item?.imgUrl} style={{ width: '125px', height: '75px', objectFit: 'cover' }} alt={`Picture of ${item?.name}`} />

            <div className='me-auto'>
                <div>

                    {item?.name}
                    {quantity > 1 &&
                        <span className='text-muted' style={{ fontSize: '.65rem' }}>
                            x{quantity}
                        </span>}

                </div>

                {/* bug when trying to display item */}
                {/* so i need to check before that item is defined */}
                <div className='text-muted' style={{ fontSize: '.75rem' }}>
                    {item && formatCurrency(item?.price)}
                </div>
            </div>
            <div> {item && formatCurrency(item?.price * quantity)} </div>
            <Button variant='outline-danger' size='sm' onClick={() => item && removeFromCart(item?.id)}>&times;</Button>
        </Stack>
    )
}