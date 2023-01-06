class CountriesService {
    constructor() {
        this.searchInput = '';
    }
// функція, яка робить HTTP-запит на ресурс і повертає проміс з масивом країн - результатом запиту.
    fetchCountries() {
        const url = `https://restcountries.com/v3.1/name/${this.searchInput}?fields=name,capital,languages,population,flags`;
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
    }
}

export { CountriesService };