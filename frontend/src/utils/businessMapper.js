

export function mapBusiness(raw) {

    const coverPhoto = raw.photos?.find(p => p.cover) || raw.photos?.[0] || {}; // İlk fotoğraf ana fotoğraf gibi olsun dedim

    return {

        raw, // tüm veri

        id: raw.id,
        name: raw.name,
        type: raw.description,
        priceRange: raw.priceRange,
        rating: raw.avgRating,
        createdAt: raw.createdAt,


        image: coverPhoto.url || '',
        hasActivePromo: Boolean(raw.settings?.hasActivePromo),
        promoDetails: raw.settings?.promoDetails || '',
        distance: raw.distance || '—',


        address: raw.address,
        tags: raw.tags || [],
        settings: raw.settings || {},
    };
}
