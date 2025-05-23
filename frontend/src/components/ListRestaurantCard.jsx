import React from 'react'
import RestaurantCard from '../components/HomePageComponents/RestaurantCard'

/**
 * ListRestaurantCard — sadece restaurant prop’unu
 * RestaurantCard’a iletir, favorites ve toggleFavorite
 * prop’larını boş değerlerle set eder.
 */
export default function ListRestaurantCard({ restaurant }) {
    return (
        <RestaurantCard
            restaurant={restaurant}
            favorites={[]}                // artık undefined değil
            toggleFavorite={() => {}}     // tıklanma no-op
        />
    )
}
