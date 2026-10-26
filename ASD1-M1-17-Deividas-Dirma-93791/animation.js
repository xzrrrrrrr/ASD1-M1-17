// Plik animation.js: przygotowuje i odtwarza historię obliczeń; nie liczy wyniku innym algorytmem.
// Odtwarzacz historii. Nie oblicza konfliktów ani obciążenia samodzielnie.
// krokiAnimacji to lista {etap,stan}; etap wybiera pseudokod, a stan zawiera wartości z obliczeń.
let krokiAnimacji = [];
// numerKroku jest indeksem widocznego zapisu, a nie wynikiem algorytmu.
let numerKroku = -1; // -1 oznacza, że nie pokazano jeszcze żadnego kroku.
// zegarAnimacji przechowuje uchwyt zegara; null pozwala rozpoznać pauzę bez zerowania indeksu.
let zegarAnimacji = null;

// Każda tablica odpowiada numerom „linia” zapisanym w algorithms.js.
let pseudokody = {
    konflikty: [
        "Dla pary i, j: lewa = max(start), prawa = min(end).",
        "konflikt = (lewa < prawa).",
        "Jeśli konflikt: dopisz parę; zakończ sprawdzanie pary."
    ],
    sortowaniePrzedzialow: [
        "klucz = tablica[i]; j = i - 1.",
        "Porównaj tablica[j].start > klucz.start; jeśli nie, przerwij.",
        "tablica[j + 1] = tablica[j]; zmniejsz j.",
        "tablica[j + 1] = klucz."
    ],
    laczenie: [
        "Dla p: sprawdź, czy p.start <= koniec ostatniego odcinka.",
        "Wydłuż ostatni koniec przez max albo dopisz nowy odcinek.",
        "Dla każdego połączonego odcinka: dlugosc += end - start."
    ],
    tworzenie: ["Dla przedziału: dopisz zdarzenie (start, +1) i (end, -1)."],
    sortowanieZdarzen: [
        "klucz = tablica[i]; j = i - 1.",
        "Porównaj czas; przy remisie -1 przed +1; jeśli kolejność dobra, przerwij.",
        "tablica[j + 1] = tablica[j]; zmniejsz j.",
        "tablica[j + 1] = klucz."
    ],
    zdarzenia: [
        "Dla zdarzenia: aktywne = aktywne + zmiana.",
        "Dopiero po całej grupie czasu: zapisz [czas, następny czas) i aktywne."
    ],
    maksimum: [
        "Porównaj aktywne z maksimum: zastąp wynik, dopisz równy dodatni lub pomiń."
    ],
    jednostki: [
        "Dla t i przedziału i: nalezy = (start <= t && t < end); jeśli tak, aktywne++.",
        "Po wszystkich przedziałach zapisz obciążenie jednostki [t, t + 1)."
    ]
};
let nazwyEtapow = {
    konflikty: "Wykrywanie konfliktów", sortowaniePrzedzialow: "Sortowanie przedziałów",
    laczenie: "Łączenie pokrycia", tworzenie: "Tworzenie zdarzeń",
    sortowanieZdarzen: "Sortowanie zdarzeń", zdarzenia: "Przejście po zdarzeniach",
    maksimum: "Szukanie maksimum", jednostki: "Sprawdzanie jednostek"
};

// Przyjmuje nazwę etapu i historię; dopisuje do krokiAnimacji wpisy {etap,stan}, nic nie zwraca.
function dolaczKroki(etap, historia) {
    // Opakowanie dodaje tylko nazwę etapu. „stan” to oryginalny wpis historii.
    for (let i = 0; i < historia.length; i++) {
        krokiAnimacji.push({ etap: etap, stan: historia[i] });
    }
}

// Z przebiegu dołącza tworzenie, sortowanie i przejście po zdarzeniach do wspólnej listy kroków.
function dolaczPrzebiegZdarzen(przebieg) {
    dolaczKroki("tworzenie", przebieg.tworzenie);
    dolaczKroki("sortowanieZdarzen", przebieg.sortowanie.kroki);
    dolaczKroki("zdarzenia", przebieg.kroki);
}

// Odczytuje metodę i dane; oblicza nową historię, zatrzymuje zegar i cofa odtwarzanie do początku.
// HISTORIA: najpierw liczymy i zapisujemy operacje, dopiero potem odtwarzamy ich stany.
function przygotujAnimacje() {
    zatrzymajAnimacje();
    krokiAnimacji = [];
    let metoda = document.getElementById("algorytm").value;
    // true włącza zapis faktycznie wykonywanych operacji w algorytmie.
    if (metoda === "konflikty") {
        let wynik = znajdzKonflikty(przedzialy, true);
        dolaczKroki("konflikty", wynik.kroki);
    } else if (metoda === "laczenie") {
        let wynik = polaczPrzedzialy(przedzialy, true);
        dolaczKroki("sortowaniePrzedzialow", wynik.sortowanie.kroki);
        dolaczKroki("laczenie", wynik.kroki);
    } else if (metoda === "zdarzenia") {
        dolaczPrzebiegZdarzen(obliczZdarzenia(przedzialy, true));
    } else if (metoda === "maksimum") {
        let wynik = obliczMaksimumZdarzeniami(przedzialy, true);
        dolaczPrzebiegZdarzen(wynik.przebieg);
        dolaczKroki("maksimum", wynik.kroki);
    } else {
        let wynik = obliczJednostkami(przedzialy, true);
        dolaczKroki("jednostki", wynik.kroki);
        dolaczKroki("maksimum", wynik.krokiMaksimum);
    }
    resetujAnimacje();
}

// Bez argumentów: usuwa działający zegar i przywraca napis Start; zachowuje dane oraz numer kroku.
// STEROWANIE: pauza, reset i tempo zmieniają odtwarzanie, nie końcowy wynik obliczeń.
function zatrzymajAnimacje() {
    // null oznacza brak pracującego zegara. Uchwyt zwraca setInterval.
    if (zegarAnimacji !== null) {
        clearInterval(zegarAnimacji);
        zegarAnimacji = null;
    }
    document.getElementById("start-pauza").textContent = "Start";
}

// Bez argumentów: zatrzymuje zegar, cofa indeks i czyści bieżące oznaczenia; nie usuwa danych ani wyniku końcowego.
function resetujAnimacje() {
    zatrzymajAnimacje();
    numerKroku = -1;
    document.getElementById("pseudokod").textContent = "";
    document.getElementById("pelny-stan").textContent = "Brak wykonanego kroku.";
    document.getElementById("zmienne-kroku").textContent = "Brak wykonanego kroku.";
    document.getElementById("etap-animacji").textContent = "Pseudokod — pojawi się po wybraniu Krok lub Start";
    document.getElementById("opis-kroku").textContent = "Naciśnij Krok lub Start, aby rozpocząć.";
    // Reset czyści tylko bieżący widok; osobna oś os-maksimum pozostaje nienaruszona.
    document.getElementById("status-animacji").textContent = "Gotowe. Krok 0 / " + krokiAnimacji.length + ".";
    document.getElementById("aktywne-kroku").textContent = "Rozpatrywane ID: brak.";
    if (krokiAnimacji.length === 0) {
        document.getElementById("status-animacji").textContent = "Brak operacji dla tych danych. Krok 0 / 0.";
        document.getElementById("opis-kroku").textContent = "Nie tworzymy sztucznych kroków. Wynik końcowy jest poniżej.";
    }
    document.getElementById("krok").disabled = krokiAnimacji.length === 0;
    document.getElementById("start-pauza").disabled = krokiAnimacji.length === 0;
    rysujStanKroku([], {});
    odswiezPytanie();
}

// Bez argumentów: przesuwa indeks i wyświetla zapis historii; po ostatnim kroku zatrzymuje odtwarzanie.
function wykonajKrok() {
    if (numerKroku + 1 >= krokiAnimacji.length) {
        zatrzymajAnimacje();
        return;
    }
    numerKroku++;
    pokazKrok();
    if (numerKroku + 1 === krokiAnimacji.length) {
        zatrzymajAnimacje();
        document.getElementById("krok").disabled = true;
        document.getElementById("start-pauza").disabled = true;
        document.getElementById("status-animacji").textContent += " Koniec. Reset pozwala zacząć od nowa.";
    }
}

// Obsługuje ręczny Krok: najpierw zatrzymuje zegar, potem pokazuje kolejny stan; nic nie zwraca.
function krokReczny() {
    zatrzymajAnimacje();
    wykonajKrok();
}

// Odczytuje tempo; zapisuje uchwyt setInterval i zmienia przycisk na Pauza, bez zmiany danych.
function uruchomZegar() {
    let czas = Number(document.getElementById("tempo").value);
    // Przekazujemy funkcję bez (), by wykonał ją zegar, a nie to przypisanie.
    zegarAnimacji = setInterval(wykonajKrok, czas);
    document.getElementById("start-pauza").textContent = "Pauza";
}

// Bez argumentów: przełącza działanie zegara; po pauzie wznawia od zachowanego numeru kroku.
function startLubPauza() {
    if (zegarAnimacji !== null) {
        zatrzymajAnimacje();
    } else if (numerKroku + 1 < krokiAnimacji.length) {
        uruchomZegar();
    }
}

// Bez argumentów: jeśli zegar działa, zastępuje go nowym z wybranym odstępem; indeks pozostaje ten sam.
function zmienTempo() {
    if (zegarAnimacji !== null) {
        zatrzymajAnimacje();
        uruchomZegar();
    }
}

// Z numerKroku odczytuje zapis; aktualizuje opis, zmienne, pseudokod, bieżącą oś i pytanie.
function pokazKrok() {
    let krok = krokiAnimacji[numerKroku];
    let s = krok.stan;
    let etap = krok.etap;
    document.getElementById("status-animacji").textContent = "Krok " + (numerKroku + 1) + " / " + krokiAnimacji.length + ".";
    document.getElementById("etap-animacji").textContent = nazwyEtapow[etap];
    document.getElementById("opis-kroku").textContent = s.opis;
    // Pełne tablice są dostępne po rozwinięciu; obok pseudokodu zostają krótkie zmienne.
    document.getElementById("pelny-stan").textContent = JSON.stringify(s, null, 2);
    pokazZmienne(s);
    let lista = document.getElementById("pseudokod");
    lista.textContent = "";
    for (let i = 0; i < pseudokody[etap].length; i++) {
        let wiersz = utworzElement("li", "", pseudokody[etap][i]);
        // W historii linia liczy od 1, a indeks tablicy od 0; stąd i+1 przy wyróżnianiu pseudokodu.
        if (i + 1 === s.linia) {
            wiersz.classList.add("aktywna-linia");
            wiersz.setAttribute("aria-current", "step");
        }
        lista.appendChild(wiersz);
    }
    let ids = [];
    if (etap === "konflikty") {
        ids.push(przedzialy[s.i].id, przedzialy[s.j].id);
    } else if (s.id !== undefined) {
        ids.push(s.id);
    } else if (s.klucz !== undefined) {
        ids.push(s.klucz.id);
        if (s.j >= 0 && s.tablica[s.j] !== undefined) {
            ids.push(s.tablica[s.j].id);
        }
    } else if (etap === "laczenie" && s.linia === 2) {
        // i oznacza pozycję w posortowanych danych, nie w wejściu.
        let dane = sortujPrzedzialy(przedzialy).przedzialy;
        ids.push(dane[s.i].id);
    }
    document.getElementById("aktywne-kroku").textContent = "Rozpatrywane ID: " + (ids.join(", ") || "brak — oceniamy odcinek lub licznik") + ".";
    rysujStanKroku(ids, s);
    odswiezPytanie();
}

// Przyjmuje stan kroku; wyświetla wybrane pola zamiast całej historii, nic nie zwraca.
function pokazZmienne(stan) {
    let wiersze = [];
    let nazwy = ["i", "j", "id", "czas", "t", "start", "end", "lewa", "prawa", "konflikt", "nalezy", "aktywne", "maksimum", "dlugosc"];
    for (let i = 0; i < nazwy.length; i++) {
        let nazwa = nazwy[i];
        if (stan[nazwa] !== undefined) {
            wiersze.push(nazwa + " = " + stan[nazwa]);
        }
    }
    if (stan.klucz !== undefined) {
        wiersze.push("klucz = " + JSON.stringify(stan.klucz));
    }
    document.getElementById("zmienne-kroku").textContent = wiersze.join("\n");
}

// Przyjmuje wyróżniane ID i stan; odtwarza bieżącą oś z danych, badanego odcinka i czasu zdarzenia.
function rysujStanKroku(ids, s) {
    let os = document.getElementById("os-animacji");
    os.textContent = "";
    let wiersz = utworzElement("div", "wiersz-osi", "");
    wiersz.appendChild(utworzElement("div", "etykieta-osi", "Czas kroku"));
    let tor = utworzElement("div", "tor", "");
    wiersz.appendChild(tor);
    os.appendChild(wiersz);
    for (let t = 0; t <= 100; t += 10) {
        let znacznik = utworzElement("span", "znacznik-czasu", t);
        znacznik.style.left = t + "%";
        if (t === 0) { znacznik.style.transform = "none"; }
        if (t === 100) { znacznik.style.transform = "translateX(-100%)"; }
        tor.appendChild(znacznik);
    }
    // Badany odcinek jest częścią aktualnego kroku; nie musi być miejscem końcowego maksimum.
    let start = s.start;
    let end = s.end;
    if (s.t !== undefined) { start = s.t; end = s.t + 1; }
    if (s.lewa !== undefined && s.prawa > s.lewa) { start = s.lewa; end = s.prawa; }
    if (start !== undefined && end > start) {
        dodajPasek(tor, start, end, "badany-odcinek", "Badany odcinek " + start + "–" + end);
    }
    if (s.czas !== undefined) {
        let znacznik = utworzElement("span", "kursor-kroku", "");
        znacznik.style.left = s.czas + "%";
        znacznik.title = "Czas zdarzenia: " + s.czas;
        tor.appendChild(znacznik);
    }
    for (let i = 0; i < przedzialy.length; i++) {
        let p = przedzialy[i];
        let aktywny = false;
        for (let j = 0; j < ids.length; j++) {
            if (ids[j] === p.id) { aktywny = true; }
        }
        let w = utworzElement("div", "wiersz-osi", "");
        let opis = p.id + " " + tekstOdcinka(p);
        let klasa = "zwykly";
        if (aktywny) { klasa += " aktywny-przedzial"; opis = "▶ " + opis; }
        w.appendChild(utworzElement("div", "etykieta-osi", opis));
        let t = utworzElement("div", "tor", "");
        dodajPasek(t, p.start, p.end, klasa, opis);
        w.appendChild(t);
        os.appendChild(w);
    }
}

// animation.js jest wczytany przed script.js; obsługa kliknięć nastąpi już po inicjalizacji.
document.getElementById("krok").addEventListener("click", krokReczny);
document.getElementById("start-pauza").addEventListener("click", startLubPauza);
document.getElementById("reset-animacji").addEventListener("click", resetujAnimacje);
document.getElementById("tempo").addEventListener("change", zmienTempo);
