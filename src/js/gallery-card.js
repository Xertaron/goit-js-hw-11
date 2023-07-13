export function createGalleryCards(cardInfo) {
  const imgCards = cardInfo.map(cardData => {
    return `<div class="photo-card">
        <a href="${cardData.largeImageURL}"><img src="${cardData.webformatURL}" alt="${cardData.tags}" loading="lazy" /></a>
        <div class="info">
            <p class="info-item"><b>Likes</b>${cardData.likes}</p>
            <p class="info-item"><b>Views</b>${cardData.views}</p>
            <p class="info-item"><b>Comments</b>${cardData.comments}</p>
            <p class="info-item"><b>Downloads</b>${cardData.downloads}</p>
        </div>
        </div> `;
  });
  return imgCards.join('');
}
