// Plik comparison.js: porównuje dwie metody maksimum na tych samych, powtarzalnych danych.
// Powtarzalne dane i liczniki operacji, bez zegara i bez historii animacji.
// Przyjmuje liczbę n; zwraca n poprawnych przedziałów z deterministycznego wzoru, bez zmiany formularza.
function generujDane(n) {
    let dane = [];
    for (let i = 0; i < n; i++) {
        let start = (17 * i + 7) % 90;
        let end = start + 1 + (11 * i + 3) % (100 - start);
        dane.push({ id: "P" + (i + 1), start: start, end: end });
    }
    return dane;
}

// Przyjmuje n; zwraca wyniki obu metod i oddzielne liczniki operacji dla wygenerowanych danych.
function porownajMetody(n) {
    // Porównujemy maksimum i jego odcinki; liczba konfliktujących par odpowiada na inne pytanie.
    let dane = generujDane(n);
    // Bez true: koszt historii nie wpływa na liczniki badanych metod.
    let e = obliczMaksimumZdarzeniami(dane);
    let u = obliczJednostkami(dane);
    let s = e.przebieg.sortowanie;
    // Liczniki opisują różne operacje, nie czas CPU; przygotowanie i sortowanie są liczone oddzielnie.
    return {
        n: n, dane: dane,
        maksimumZdarzeniami: e.maksimum, maksimumJednostkami: u.maksimum,
        odcinki: e.odcinki,
        zgodne: e.maksimum === u.maksimum && JSON.stringify(e.odcinki) === JSON.stringify(u.odcinki),
        utworzoneZdarzenia: 2 * n, kopiowaneZdarzenia: 2 * n,
        porownaniaSortowania: s.porownania, przesunieciaSortowania: s.przesuniecia,
        wstawieniaSortowania: Math.max(0, 2 * n - 1),
        przetworzoneZdarzenia: e.przebieg.przetworzoneZdarzenia,
        odcinkiSkanuMaksimum: e.przebieg.odcinki.length,
        sprawdzeniaJednostek: u.sprawdzenia,
        zapisaneJednostki: u.obciazenia.length, jednostkiSkanuMaksimum: u.obciazenia.length
    };
}

// Bez argumentów: oblicza porównanie 5/15/30 i zastępuje wiersze tabeli na stronie.
function pokazPorownanie() {
    let tabela = document.getElementById("wiersze-porownania");
    tabela.textContent = "";
    let rozmiary = [5, 15, 30];
    for (let i = 0; i < rozmiary.length; i++) {
        let r = porownajMetody(rozmiary[i]);
        let wartosci = [r.n, r.maksimumZdarzeniami + " / " + r.maksimumJednostkami,
            r.utworzoneZdarzenia, r.kopiowaneZdarzenia,
            r.porownaniaSortowania, r.przesunieciaSortowania, r.wstawieniaSortowania,
            r.przetworzoneZdarzenia, r.odcinkiSkanuMaksimum, r.sprawdzeniaJednostek,
            r.zapisaneJednostki, r.jednostkiSkanuMaksimum, r.zgodne ? "TAK" : "NIE"];
        let wiersz = document.createElement("tr");
        for (let j = 0; j < wartosci.length; j++) {
            let pole = document.createElement("td");
            pole.textContent = wartosci[j];
            wiersz.appendChild(pole);
        }
        tabela.appendChild(wiersz);
    }
}
