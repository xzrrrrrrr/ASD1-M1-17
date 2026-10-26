// Plik algorithms.js: walidacja oraz algorytmy przedziałów; bez odczytu formularza i rysowania strony.
// ASD1-M1-17 — przedziały [start, end).
// Najpierw wywołaj sprawdzDane. Algorytmy zakładają poprawne dane.
// Drugi argument true włącza historię. Bez niego historia jest pusta.
// Numery „linia” odnoszą się do kroków pseudokodu opisanych w ETAP2.md.

// Sprawdza tablicę przedziałów; zwraca listę błędów. Pusta lista oznacza poprawne dane; wejścia nie zmienia.
// WALIDACJA: algorytmy niżej zakładają, że ta kontrola nie znalazła błędów.
function sprawdzDane(przedzialy) {
    let bledy = [];
    if (!Array.isArray(przedzialy)) {
        bledy.push("Dane muszą być tablicą przedziałów.");
        return bledy;
    }
    if (przedzialy.length > 30) {
        bledy.push("Można podać najwyżej 30 przedziałów.");
    }
    for (let i = 0; i < przedzialy.length; i++) {
        let p = przedzialy[i];
        if (p === null || typeof p !== "object" || Array.isArray(p)) {
            bledy.push("Pozycja " + (i + 1) + ": oczekiwano obiektu przedziału.");
            continue;
        }
        if (typeof p.id !== "string" || p.id.trim() === "") {
            bledy.push("Pozycja " + (i + 1) + ": ID musi być niepustym napisem.");
        } else if (p.id !== p.id.trim()) {
            bledy.push("Pozycja " + (i + 1) + ": ID nie może mieć skrajnych spacji.");
        }
        // Sprawdzamy tylko wcześniejsze pozycje, aby nie zgłaszać pary dwa razy.
        for (let j = 0; j < i; j++) {
            let poprzedni = przedzialy[j];
            if (poprzedni !== null && typeof poprzedni === "object" && poprzedni.id === p.id) {
                bledy.push("Pozycja " + (i + 1) + ": powtórzone ID.");
                break;
            }
        }
        if (!Number.isInteger(p.start) || !Number.isInteger(p.end)) {
            bledy.push("Pozycja " + (i + 1) + ": granice muszą być liczbami całkowitymi.");
        } else if (p.start < 0 || p.end > 100 || p.start >= p.end) {
            bledy.push("Pozycja " + (i + 1) + ": wymagane 0 <= start < end <= 100.");
        }
    }
    return bledy;
}

// Przyjmuje przedziały i zwraca nową tablicę z nowymi obiektami, aby sortowanie nie zmieniło wejścia.
function kopiujPrzedzialy(przedzialy) {
    let kopia = [];
    for (let i = 0; i < przedzialy.length; i++) {
        let p = przedzialy[i];
        kopia.push({ id: p.id, start: p.start, end: p.end });
    }
    return kopia;
}

// Przyjmuje zdarzenia i zwraca kopię ich tablicy oraz obiektów, także do zapisu historii.
function kopiujZdarzenia(zdarzenia) {
    let kopia = [];
    for (let i = 0; i < zdarzenia.length; i++) {
        let z = zdarzenia[i];
        kopia.push({ id: z.id, czas: z.czas, zmiana: z.zmiana });
    }
    return kopia;
}

// Sortuje kopię przedziałów po początku; zwraca kolejność, liczniki i opcjonalną historię (zapisujKroki=true).
function sortujPrzedzialy(przedzialy, zapisujKroki) {
    let wynik = kopiujPrzedzialy(przedzialy);
    // Zapis linia wskazuje numer pseudokodu; przechowujemy stan wykonanej operacji, nie ręczną animację.
    let kroki = [];
    let porownania = 0;
    let przesuniecia = 0;
    for (let i = 1; i < wynik.length; i++) {
        // Insertion Sort utrzymuje uporządkowaną część przed i; wybrany klucz trzeba dopiero w nią wstawić.
        let klucz = wynik[i];
        let j = i - 1;
        // Historia jest opcjonalna: kopia tablicy zachowa ten stan nawet po dalszym sortowaniu.
        if (zapisujKroki === true) {
            kroki.push({ linia: 1, opis: "Wybieramy przedział do wstawienia.", i: i, j: j, klucz: klucz, tablica: kopiujPrzedzialy(wynik) });
        }
        for (; j >= 0; j--) {
            porownania++;
            let przesun = wynik[j].start > klucz.start;
            if (zapisujKroki === true) {
                kroki.push({ linia: 2, opis: "Porównujemy początki.", i: i, j: j, klucz: klucz, przesun: przesun, tablica: kopiujPrzedzialy(wynik) });
            }
            if (!przesun) {
                break;
            }
            wynik[j + 1] = wynik[j];
            przesuniecia++;
            if (zapisujKroki === true) {
                kroki.push({ linia: 3, opis: "Przesuwamy większy początek w prawo.", i: i, j: j, klucz: klucz, tablica: kopiujPrzedzialy(wynik) });
            }
        }
        wynik[j + 1] = klucz;
        if (zapisujKroki === true) {
            kroki.push({ linia: 4, opis: "Wstawiamy wybrany przedział.", i: i, j: j, klucz: klucz, tablica: kopiujPrzedzialy(wynik) });
        }
    }
    return { przedzialy: wynik, kroki: kroki, porownania: porownania, przesuniecia: przesuniecia };
}

// Bada wszystkie pary przedziałów; zwraca konflikty, liczbę sprawdzeń i opcjonalne kroki.
function znajdzKonflikty(przedzialy, zapisujKroki) {
    let konflikty = [];
    let kroki = [];
    let sprawdzenia = 0;
    for (let i = 0; i < przedzialy.length; i++) {
        for (let j = i + 1; j < przedzialy.length; j++) {
            let lewa = Math.max(przedzialy[i].start, przedzialy[j].start);
            let prawa = Math.min(przedzialy[i].end, przedzialy[j].end);
            // Ostry znak < wyklucza styk: część wspólna musi mieć dodatnią długość.
            let konflikt = lewa < prawa;
            sprawdzenia++;
            if (zapisujKroki === true) {
                kroki.push({ linia: 1, opis: "Wyznaczamy granice części wspólnej.", i: i, j: j, id1: przedzialy[i].id, id2: przedzialy[j].id, lewa: lewa, prawa: prawa });
                kroki.push({ linia: 2, opis: "Sprawdzamy, czy część wspólna ma dodatnią długość.", i: i, j: j, lewa: lewa, prawa: prawa, konflikt: konflikt });
            }
            if (konflikt) {
                konflikty.push({ id1: przedzialy[i].id, id2: przedzialy[j].id, start: lewa, end: prawa });
            }
            if (zapisujKroki === true) {
                kroki.push({ linia: 3, opis: "Kończymy sprawdzanie pary.", i: i, j: j, konflikt: konflikt, liczbaKonfliktow: konflikty.length });
            }
        }
    }
    return { konflikty: konflikty, sprawdzenia: sprawdzenia, kroki: kroki };
}

// Przyjmuje przedziały; zwraca połączone pokrycie, jego długość oraz sortowanie i opcjonalną historię.
function polaczPrzedzialy(przedzialy, zapisujKroki) {
    let sortowanie = sortujPrzedzialy(przedzialy, zapisujKroki);
    let dane = sortowanie.przedzialy;
    let wynik = [];
    let kroki = [];
    let dlugosc = 0;
    for (let i = 0; i < dane.length; i++) {
        let p = dane[i];
        let ostatni = wynik.length - 1;
        let polacz = false;
        // W pokryciu używamy ≤: odcinki bez przerwy łączymy, choć styk nie jest konfliktem.
        if (ostatni >= 0 && p.start <= wynik[ostatni].end) {
            polacz = true;
        }
        if (zapisujKroki === true) {
            kroki.push({ linia: 1, opis: "Sprawdzamy, czy dołączyć bieżący przedział.", i: i, id: p.id, start: p.start, end: p.end, polacz: polacz, liczbaOdcinkow: wynik.length });
        }
        if (polacz) {
            // Nie skracamy pokrycia, jeśli bieżący przedział jest zagnieżdżony.
            wynik[ostatni].end = Math.max(wynik[ostatni].end, p.end);
        } else {
            wynik.push({ start: p.start, end: p.end });
        }
        ostatni = wynik.length - 1;
        if (zapisujKroki === true) {
            kroki.push({ linia: 2, opis: "Zapisujemy wynik decyzji.", i: i, polacz: polacz, start: wynik[ostatni].start, end: wynik[ostatni].end, liczbaOdcinkow: wynik.length });
        }
    }
    for (let i = 0; i < wynik.length; i++) {
        dlugosc = dlugosc + wynik[i].end - wynik[i].start;
        if (zapisujKroki === true) {
            kroki.push({ linia: 3, opis: "Dodajemy długość połączonego odcinka.", i: i, dlugosc: dlugosc });
        }
    }
    return { odcinki: wynik, dlugosc: dlugosc, sortowanie: sortowanie, kroki: kroki };
}

// Sortuje kopię zdarzeń po czasie i zmianie; zwraca kolejność, liczniki oraz opcjonalne kroki.
function sortujZdarzenia(zdarzenia, zapisujKroki) {
    let wynik = kopiujZdarzenia(zdarzenia);
    let kroki = [];
    let porownania = 0;
    let przesuniecia = 0;
    for (let i = 1; i < wynik.length; i++) {
        let klucz = wynik[i];
        let j = i - 1;
        if (zapisujKroki === true) {
            kroki.push({ linia: 1, opis: "Wybieramy zdarzenie do wstawienia.", i: i, j: j, klucz: klucz, tablica: kopiujZdarzenia(wynik) });
        }
        for (; j >= 0; j--) {
            porownania++;
            let przesun = false;
            if (wynik[j].czas > klucz.czas) {
                przesun = true;
            } else if (wynik[j].czas === klucz.czas && wynik[j].zmiana > klucz.zmiana) {
                // -1 musi poprzedzać +1, bo koniec nie należy do przedziału.
                przesun = true;
            }
            if (zapisujKroki === true) {
                kroki.push({ linia: 2, opis: "Porównujemy czas, a przy remisie zmianę.", i: i, j: j, klucz: klucz, przesun: przesun, tablica: kopiujZdarzenia(wynik) });
            }
            if (!przesun) {
                break;
            }
            wynik[j + 1] = wynik[j];
            przesuniecia++;
            if (zapisujKroki === true) {
                kroki.push({ linia: 3, opis: "Przesuwamy późniejsze zdarzenie w prawo.", i: i, j: j, klucz: klucz, tablica: kopiujZdarzenia(wynik) });
            }
        }
        wynik[j + 1] = klucz;
        if (zapisujKroki === true) {
            kroki.push({ linia: 4, opis: "Wstawiamy zdarzenie.", i: i, j: j, klucz: klucz, tablica: kopiujZdarzenia(wynik) });
        }
    }
    return { zdarzenia: wynik, kroki: kroki, porownania: porownania, przesuniecia: przesuniecia };
}

// Z przedziałów tworzy zdarzenia i obciążenia odcinków; zwraca także liczniki i opcjonalną historię.
function obliczZdarzenia(przedzialy, zapisujKroki) {
    let zdarzenia = [];
    let tworzenie = [];
    for (let i = 0; i < przedzialy.length; i++) {
        let p = przedzialy[i];
        zdarzenia.push({ id: p.id, czas: p.start, zmiana: 1 });
        zdarzenia.push({ id: p.id, czas: p.end, zmiana: -1 });
        if (zapisujKroki === true) {
            tworzenie.push({ linia: 1, opis: "Tworzymy początek +1 i koniec -1.", id: p.id, start: p.start, end: p.end, liczbaZdarzen: zdarzenia.length });
        }
    }
    let sortowanie = sortujZdarzenia(zdarzenia, zapisujKroki);
    let dane = sortowanie.zdarzenia;
    let odcinki = [];
    let kroki = [];
    // aktywne liczy rezerwacje po dotychczasowych zdarzeniach; obciążenie odcinka znamy dopiero po grupie czasu.
    let aktywne = 0;
    let przetworzoneZdarzenia = 0;
    for (let i = 0; i < dane.length; i++) {
        let z = dane[i];
        let przed = aktywne;
        aktywne = aktywne + z.zmiana;
        przetworzoneZdarzenia++;
        if (zapisujKroki === true) {
            kroki.push({ linia: 1, opis: "Zmieniamy licznik zgodnie ze zdarzeniem.", i: i, id: z.id, czas: z.czas, zmiana: z.zmiana, przed: przed, aktywne: aktywne });
        }
        // Odcinek oceniamy dopiero po wszystkich zdarzeniach w tej samej chwili.
        if (i + 1 < dane.length && z.czas < dane[i + 1].czas) {
            odcinki.push({ start: z.czas, end: dane[i + 1].czas, aktywne: aktywne });
            if (zapisujKroki === true) {
                kroki.push({ linia: 2, opis: "Znamy obciążenie do następnej chwili zdarzenia.", i: i, start: z.czas, end: dane[i + 1].czas, aktywne: aktywne });
            }
        }
    }
    return { zdarzenia: dane, odcinki: odcinki, tworzenie: tworzenie, sortowanie: sortowanie, kroki: kroki, przetworzoneZdarzenia: przetworzoneZdarzenia };
}

// Dopisuje [start,end) do podanej listy albo wydłuża ostatni odcinek; zmienia listę, nic nie zwraca.
function dodajOdcinekMaksimum(odcinki, start, end) {
    let ostatni = odcinki.length - 1;
    // Sąsiednie odcinki tego samego maksimum tworzą jeden dłuższy odcinek.
    if (ostatni >= 0 && odcinki[ostatni].end === start) {
        odcinki[ostatni].end = end;
    } else {
        odcinki.push({ start: start, end: end });
    }
}

// Skanuje odcinki z polem aktywne; zwraca największe obciążenie, wszystkie jego odcinki i opcjonalne kroki.
function znajdzMaksimum(odcinki, zapisujKroki) {
    let maksimum = 0;
    let wynik = [];
    let kroki = [];
    for (let i = 0; i < odcinki.length; i++) {
        let p = odcinki[i];
        let decyzja = "pomijamy";
        // Wyższy poziom unieważnia stare odcinki; równy dodatni zachowuje także kolejne, rozłączne miejsca.
        if (p.aktywne > maksimum) {
            maksimum = p.aktywne;
            wynik = [];
            dodajOdcinekMaksimum(wynik, p.start, p.end);
            decyzja = "nowe maksimum";
        } else if (p.aktywne === maksimum && maksimum > 0) {
            dodajOdcinekMaksimum(wynik, p.start, p.end);
            decyzja = "kolejny odcinek maksimum";
        }
        if (zapisujKroki === true) {
            kroki.push({ linia: 1, opis: "Porównujemy obciążenie z dotychczasowym maksimum.", i: i, start: p.start, end: p.end, aktywne: p.aktywne, maksimum: maksimum, decyzja: decyzja, liczbaOdcinkow: wynik.length });
        }
    }
    return { maksimum: maksimum, odcinki: wynik, kroki: kroki };
}

// Przyjmuje przedziały; zwraca maksimum i jego odcinki wraz z przebiegiem zdarzeń i opcjonalną historią.
function obliczMaksimumZdarzeniami(przedzialy, zapisujKroki) {
    let przebieg = obliczZdarzenia(przedzialy, zapisujKroki);
    let wynik = znajdzMaksimum(przebieg.odcinki, zapisujKroki);
    return { maksimum: wynik.maksimum, odcinki: wynik.odcinki, kroki: wynik.kroki, przebieg: przebieg };
}

// Bada przedziały w 100 jednostkach; zwraca obciążenia, maksimum, liczbę sprawdzeń i opcjonalną historię.
function obliczJednostkami(przedzialy, zapisujKroki) {
    let obciazenia = [];
    let kroki = [];
    let sprawdzenia = 0;
    for (let t = 0; t < 100; t++) {
        let aktywne = 0;
        for (let i = 0; i < przedzialy.length; i++) {
            let p = przedzialy[i];
            // Całkowite granice gwarantują stałe obciążenie w [t,t+1); koniec nie należy do przedziału.
            let nalezy = p.start <= t && t < p.end;
            sprawdzenia++;
            if (nalezy) {
                aktywne++;
            }
            if (zapisujKroki === true) {
                kroki.push({ linia: 1, opis: "Sprawdzamy jeden przedział w jednej jednostce czasu.", t: t, i: i, id: p.id, nalezy: nalezy, aktywne: aktywne });
            }
        }
        obciazenia.push({ start: t, end: t + 1, aktywne: aktywne });
        if (zapisujKroki === true) {
            kroki.push({ linia: 2, opis: "Zapisujemy obciążenie całej jednostki czasu.", t: t, aktywne: aktywne });
        }
    }
    let wynik = znajdzMaksimum(obciazenia, zapisujKroki);
    return { maksimum: wynik.maksimum, odcinki: wynik.odcinki, obciazenia: obciazenia, sprawdzenia: sprawdzenia, kroki: kroki, krokiMaksimum: wynik.kroki };
}
