export function mapBusiness(raw) {
    const coverPhoto = raw.photos?.find(p => p.cover) || raw.photos?.[0] || {};

    const mappedPromotions = raw.promotions.map(promo => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        startDate: promo.startat,
        endDate: promo.endat,
        amount: promo.amount,
        isActive: promo.active,
        createdAt: promo.createdAt, // Ekledik
    }));

    // createdAt'i en güncel olan promo'nun title'ı
    const latestPromoTitle = mappedPromotions.length
        ? mappedPromotions.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
        }).title
        : '';
    const latestPromoAmount = mappedPromotions.length
        ? mappedPromotions.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
        }).amount
        : '';
    const latestPromoDescription = mappedPromotions.length
    ? mappedPromotions.reduce((latest, current) => {
        return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
        }).description
        : '';

    return {
        raw,

        id: raw.id,
        name: raw.name,
        type: raw.description,
        priceRange: raw.priceRange,
        rating: raw.avgRating.toFixed(1),
        createdAt: raw.createdAt,

        image: coverPhoto.url || '',
        hasActivePromo: Boolean(mappedPromotions?.find(p => p.isActive)),
        promoDetails: latestPromoDescription,
        promoAmount: latestPromoAmount ? `%${latestPromoAmount}` : '',
        promoTitle: latestPromoTitle,
        distance: raw.distance || '—',
        operatingHours: raw.operatingHours || [],
        address: raw.address,
        promotions: mappedPromotions,
        tags: raw.tags || [],
        settings: raw.settings || {},
    };
}