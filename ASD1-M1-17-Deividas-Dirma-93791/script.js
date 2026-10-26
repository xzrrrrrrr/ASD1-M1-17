// Plik script.js: dane formularza, scenariusze i wynik końcowy; łączy obliczenia z elementami strony.
// Stan aplikacji: zwykła tablica i indeks edytowanego przedziału.
// przedzialy to bieżące dane w pamięci strony; odświeżenie strony ich nie zachowuje.
let przedzialy = [];
// edytowanyIndeks wskazuje zmieniany wpis; −1 oznacza dodawanie nowego.
let edytowanyIndeks = -1;

// Z tagu, klasy i tekstu tworzy element DOM; zwraca go bez dołączania do strony.
function utworzElement(tag, klasa, tekst) {
    let element = document.createElement(tag);
    element.className = klasa;
    // textContent wyświetla tekst, zamiast interpretować go jako HTML.
    element.textContent = tekst;
    return element;
}

// Przyjmuje obiekt z start i end; zwraca czytelny zapis przedziału półotwartego.
function tekstOdcinka(p) {
    return "[" + p.start + ", " + p.end + ")";
}

// Przyjmuje listę odcinków; zwraca ich zapis tekstowy albo słowo „brak” dla pustej listy.
function listaOdcinkow(odcinki) {
    let teksty = [];
    for (let i = 0; i < odcinki.length; i++) {
        teksty.push(tekstOdcinka(odcinki[i]));
    }
    if (teksty.length === 0) {
        return "brak";
    }
    return teksty.join(", ");
}

// Przeszukuje bieżące przedzialy i zwraca wolne ID P1–P31; przy limicie 30 zawsze znajdzie kandydata.
function znajdzWolneId() {
    // Przy najwyżej 30 przedziałach jeden z 31 kandydatów na pewno jest wolny.
    for (let numer = 1; numer <= 31; numer++) {
        let id = "P" + numer;
        let zajete = false;
        for (let i = 0; i < przedzialy.length; i++) {
            if (przedzialy[i].id === id) {
                zajete = true;
            }
        }
        if (!zajete) {
            return id;
        }
    }
}

// Przyjmuje tekst i znacznik błędu; zmienia treść oraz klasę komunikatu na stronie, nic nie zwraca.
function pokazKomunikat(tekst, blad) {
    let komunikat = document.getElementById("komunikat");
    komunikat.textContent = tekst;
    komunikat.className = "komunikat";
    if (blad) {
        komunikat.classList.add("blad");
    }
}

// Bez argumentów: czyści formularz i indeks edycji, ustawia następne ID oraz stan przycisków.
function zakonczEdycje() {
    edytowanyIndeks = -1;
    document.getElementById("formularz-przedzialu").reset();
    document.getElementById("id-przedzialu").value = znajdzWolneId();
    document.getElementById("tytul-formularza").textContent = "Dodaj przedział";
    document.getElementById("zapisz-przedzial").textContent = "Dodaj przedział";
    document.getElementById("zapisz-przedzial").disabled = przedzialy.length >= 30;
    document.getElementById("anuluj-edycje").hidden = true;
}

// Obsługuje wysłanie formularza (event); po walidacji zmienia dane i odświeża widok, bez przeładowania strony.
// OBSŁUGA DANYCH: formularz jest sprawdzany przed zatwierdzeniem nowej listy.
function zapiszPrzedzial(event) {
    // Bez tego formularz przeładowałby stronę i utracił dane w pamięci.
    event.preventDefault();
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    if (start.trim() === "" || end.trim() === "") {
        pokazKomunikat("Błąd: wpisz początek i koniec przedziału.", true);
        return;
    }
    let p = {
        id: document.getElementById("id-przedzialu").value,
        start: Number(start),
        end: Number(end)
    };
    // Sprawdzamy kopię: błędne dane nie mogą zmienić działającego widoku.
    let nowe = kopiujPrzedzialy(przedzialy);
    if (edytowanyIndeks === -1) {
        nowe.push(p);
    } else {
        nowe[edytowanyIndeks] = p;
    }
    let bledy = sprawdzDane(nowe);
    if (bledy.length > 0) {
        pokazKomunikat("Błąd: " + bledy.join(" "), true);
        return;
    }
    przedzialy = nowe;
    zakonczEdycje();
    odswiezWidok();
    pokazKomunikat("Zapisano przedział " + p.id + ". Wyniki zostały przeliczone.", false);
}

// Z klikniętego przycisku (event) odczytuje indeks; wypełnia formularz i ustawia tryb edycji.
function rozpocznijEdycje(event) {
    edytowanyIndeks = Number(event.currentTarget.dataset.indeks);
    let p = przedzialy[edytowanyIndeks];
    document.getElementById("id-przedzialu").value = p.id;
    document.getElementById("start").value = p.start;
    document.getElementById("end").value = p.end;
    document.getElementById("tytul-formularza").textContent = "Edytuj przedział " + p.id;
    document.getElementById("zapisz-przedzial").textContent = "Zapisz zmiany";
    document.getElementById("zapisz-przedzial").disabled = false;
    document.getElementById("anuluj-edycje").hidden = false;
    pokazKomunikat("Edytujesz " + p.id + ". ID pozostaje bez zmian.", false);
    document.getElementById("start").focus();
}

// Bez argumentów: kończy edycję i pokazuje komunikat; nie zapisuje zmian do listy.
function anulujEdycje() {
    zakonczEdycje();
    pokazKomunikat("Anulowano edycję. Dane nie zostały zmienione.", false);
}

// Z przycisku (event) odczytuje indeks; usuwa wpis, kończy edycję i przelicza widok.
function usunPrzedzial(event) {
    let indeks = Number(event.currentTarget.dataset.indeks);
    let id = przedzialy[indeks].id;
    przedzialy.splice(indeks, 1);
    // Usunięcie zmienia indeksy w tablicy, dlatego kończymy ewentualną edycję.
    zakonczEdycje();
    odswiezWidok();
    pokazKomunikat("Usunięto przedział " + id + ". Wyniki zostały przeliczone.", false);
}

// Odczytuje wybór ze strony; zastępuje listę gotowym przykładem i przygotowuje nowy przebieg.
function wczytajScenariusz() {
    let numer = document.getElementById("scenariusz").value;
    if (numer === "1") {
        przedzialy = [
            { id: "A", start: 1, end: 4 },
            { id: "B", start: 2, end: 5 },
            { id: "C", start: 5, end: 7 }
        ];
    } else if (numer === "2") {
        przedzialy = [
            { id: "A", start: 10, end: 70 },
            { id: "B", start: 20, end: 50 },
            { id: "C", start: 20, end: 50 },
            { id: "D", start: 30, end: 40 }
        ];
    } else {
        przedzialy = [
            { id: "A", start: 10, end: 30 },
            { id: "B", start: 20, end: 40 },
            { id: "C", start: 60, end: 80 },
            { id: "D", start: 70, end: 90 }
        ];
    }
    zakonczEdycje();
    odswiezWidok();
    pokazKomunikat("Wczytano scenariusz " + numer + ". Poprzednie dane zostały zastąpione.", false);
}

// Z bieżących danych buduje tabelę, przyciski edycji/usuwania i licznik; zmienia DOM, nie dane.
function pokazListe() {
    let lista = document.getElementById("lista-przedzialow");
    lista.textContent = "";
    for (let i = 0; i < przedzialy.length; i++) {
        let p = przedzialy[i];
        let wiersz = document.createElement("tr");
        wiersz.appendChild(utworzElement("td", "", p.id));
        wiersz.appendChild(utworzElement("td", "", tekstOdcinka(p)));
        let dzialania = utworzElement("td", "dzialania", "");
        let edytuj = utworzElement("button", "maly drugorzedny", "Edytuj");
        edytuj.type = "button";
        edytuj.dataset.indeks = i;
        edytuj.setAttribute("aria-label", "Edytuj przedział " + p.id);
        edytuj.addEventListener("click", rozpocznijEdycje);
        let usun = utworzElement("button", "maly drugorzedny usun", "Usuń");
        usun.type = "button";
        usun.dataset.indeks = i;
        usun.setAttribute("aria-label", "Usuń przedział " + p.id);
        usun.addEventListener("click", usunPrzedzial);
        dzialania.appendChild(edytuj);
        dzialania.appendChild(usun);
        wiersz.appendChild(dzialania);
        lista.appendChild(wiersz);
    }
    document.getElementById("liczba-przedzialow").textContent = przedzialy.length + " / 30";
    document.getElementById("pusta-lista").hidden = przedzialy.length > 0;
}

// Przyjmuje tor, granice, klasę i opis; dodaje pasek do DOM z położeniem oraz etykietą, nic nie zwraca.
function dodajPasek(tor, start, end, klasa, opis) {
    let pasek = utworzElement("div", "pasek " + klasa, "");
    // Oś ma zakres 0–100, więc jednostka czasu odpowiada jednemu procentowi szerokości.
    pasek.style.left = start + "%";
    pasek.style.width = (end - start) + "%";
    pasek.title = opis;
    pasek.setAttribute("role", "img");
    pasek.setAttribute("aria-label", opis);
    tor.appendChild(pasek);
}

// Przyjmuje nagłówki i wiersze; dopisuje tabelę do szczegółów końcowego wyniku.
function pokazTabele(naglowki, wiersze) {
    let tabela = document.createElement("table");
    let gora = document.createElement("thead");
    let naglowek = document.createElement("tr");
    for (let i = 0; i < naglowki.length; i++) {
        let pole = utworzElement("th", "", naglowki[i]);
        pole.scope = "col";
        naglowek.appendChild(pole);
    }
    gora.appendChild(naglowek);
    tabela.appendChild(gora);
    let dol = document.createElement("tbody");
    for (let i = 0; i < wiersze.length; i++) {
        let wiersz = document.createElement("tr");
        for (let j = 0; j < wiersze[i].length; j++) {
            wiersz.appendChild(utworzElement("td", "", wiersze[i][j]));
        }
        dol.appendChild(wiersz);
    }
    tabela.appendChild(dol);
    document.getElementById("szczegoly-wyniku").appendChild(tabela);
}

// Z gotowego wyniku maksimum rysuje osobną oś i opis zakresów; nie korzysta ze stanu animacji.
function pokazOsMaksimum(maksimum) {
    // To oś gotowej odpowiedzi: jeden pasek na każdy zwrócony odcinek, niezależnie od numerKroku.
    let os = document.getElementById("os-maksimum");
    os.textContent = "";
    let skala = utworzElement("div", "wiersz-osi", "");
    skala.appendChild(utworzElement("div", "etykieta-osi", "Czas 0–100"));
    let podzialka = utworzElement("div", "tor", "");
    for (let czas = 0; czas <= 100; czas += 10) {
        let znacznik = utworzElement("span", "znacznik-czasu", czas);
        znacznik.style.left = czas + "%";
        podzialka.appendChild(znacznik);
    }
    skala.appendChild(podzialka);
    os.appendChild(skala);
    let wiersz = utworzElement("div", "wiersz-osi", "");
    let rzeczownik = "rezerwacji";
    if (maksimum.maksimum === 1) {
        rzeczownik = "rezerwacja";
    } else if (maksimum.maksimum % 10 >= 2 && maksimum.maksimum % 10 <= 4 && (maksimum.maksimum < 12 || maksimum.maksimum > 14)) {
        rzeczownik = "rezerwacje";
    }
    wiersz.appendChild(utworzElement("div", "etykieta-osi", "Maksimum: " + maksimum.maksimum + " " + rzeczownik + " naraz"));
    let tor = utworzElement("div", "tor", "");
    // Nie wybieramy tylko pierwszego maksimum: pętla narysuje również wszystkie oddzielne okresy.
    for (let i = 0; i < maksimum.odcinki.length; i++) {
        let p = maksimum.odcinki[i];
        dodajPasek(tor, p.start, p.end, "maksimum-koncowe", "Końcowe maksimum: " + maksimum.maksimum + ", " + tekstOdcinka(p));
    }
    wiersz.appendChild(tor);
    os.appendChild(wiersz);
    let opis = "Brak odcinków maksimum";
    if (maksimum.odcinki.length > 0) {
        opis = "Odcinki końcowego maksimum: " + listaOdcinkow(maksimum.odcinki) + ".";
    }
    document.getElementById("odcinki-maksimum").textContent = opis;
}

// Przyjmuje wyniki konfliktów, pokrycia i maksimum; opisuje wybraną metodę w sekcji końcowej.
function pokazWyniki(konflikty, pokrycie, maksimum) {
    let wybor = document.getElementById("algorytm").value;
    let nazwa = document.getElementById("nazwa-wyniku");
    let opis = document.getElementById("opis-metody");
    let wynik = document.getElementById("podsumowanie-wyniku");
    let wiersze = [];
    document.getElementById("szczegoly-wyniku").textContent = "";
    if (wybor === "konflikty") {
        nazwa.textContent = "Konflikty przedziałów";
        opis.textContent = "Każdą parę sprawdzamy raz: max(początków) < min(końców). Sam styk nie jest konfliktem.";
        wynik.textContent = "Konfliktujące pary: " + konflikty.konflikty.length + ". Sprawdzone pary: " + konflikty.sprawdzenia + ".";
        for (let i = 0; i < konflikty.konflikty.length; i++) {
            let k = konflikty.konflikty[i];
            wiersze.push([k.id1 + " i " + k.id2, tekstOdcinka(k)]);
        }
        if (wiersze.length === 0) {
            wynik.textContent = wynik.textContent + " Brak konfliktów.";
        }
        pokazTabele(["Para ID", "Wspólny odcinek"], wiersze);
    } else if (wybor === "laczenie") {
        nazwa.textContent = "Połączone pokrycie";
        opis.textContent = "Sortujemy kopię własnym Insertion Sort. Łączymy nakładające się i stykające odcinki.";
        wynik.textContent = "Pokrycie: " + listaOdcinkow(pokrycie.odcinki) + ". Łączna długość: " + pokrycie.dlugosc + ".";
        let kolejnosc = [];
        for (let i = 0; i < pokrycie.sortowanie.przedzialy.length; i++) {
            let p = pokrycie.sortowanie.przedzialy[i];
            kolejnosc.push(p.id + " " + tekstOdcinka(p));
        }
        opis.textContent = opis.textContent + " Kolejność po sortowaniu: " + kolejnosc.join(" → ") + ".";
        for (let i = 0; i < pokrycie.odcinki.length; i++) {
            let p = pokrycie.odcinki[i];
            wiersze.push([tekstOdcinka(p), p.end - p.start]);
        }
        pokazTabele(["Połączony odcinek", "Długość"], wiersze);
    } else if (wybor === "zdarzenia") {
        nazwa.textContent = "Zdarzenia początku i końca";
        opis.textContent = "Początek daje +1, koniec −1. Przy wspólnym czasie końce są przed początkami. Obciążenie odcinka oceniamy po całej grupie.";
        let aktywne = 0;
        for (let i = 0; i < maksimum.przebieg.zdarzenia.length; i++) {
            let z = maksimum.przebieg.zdarzenia[i];
            let przed = aktywne;
            aktywne = aktywne + z.zmiana;
            let typ = "Koniec −1";
            if (z.zmiana === 1) {
                typ = "Początek +1";
            }
            wiersze.push([z.czas, z.id, typ, przed + " → " + aktywne]);
        }
        wynik.textContent = "Liczba zdarzeń: " + maksimum.przebieg.przetworzoneZdarzenia + ". Licznik po ostatnim zdarzeniu: " + aktywne + ".";
        pokazTabele(["Czas", "ID", "Zdarzenie", "Licznik przed → po"], wiersze);
        let obciazenia = [];
        for (let i = 0; i < maksimum.przebieg.odcinki.length; i++) {
            let p = maksimum.przebieg.odcinki[i];
            obciazenia.push([tekstOdcinka(p), p.aktywne]);
        }
        pokazTabele(["Odcinek po grupie zdarzeń", "Aktywne"], obciazenia);
    } else if (wybor === "maksimum") {
        nazwa.textContent = "Maksymalne obciążenie";
        opis.textContent = "Szukamy największego obciążenia na niepustych odcinkach. Zachowujemy wszystkie miejsca maksimum, także rozłączne.";
        wynik.textContent = "Maksimum: " + maksimum.maksimum + ". Odcinki maksimum: " + listaOdcinkow(maksimum.odcinki) + ".";
        for (let i = 0; i < maksimum.odcinki.length; i++) {
            wiersze.push([tekstOdcinka(maksimum.odcinki[i]), maksimum.maksimum]);
        }
        pokazTabele(["Odcinek maksimum", "Aktywne"], wiersze);
    } else {
        let jednostki = obliczJednostkami(przedzialy);
        nazwa.textContent = "Sprawdzanie jednostek czasu";
        opis.textContent = "Dla każdej jednostki [t,t+1), t=0…99, sprawdzamy każdy przedział. Metoda jest dokładna dzięki całkowitym granicom.";
        wynik.textContent = "Maksimum: " + jednostki.maksimum + ". Odcinki maksimum: " + listaOdcinkow(jednostki.odcinki) + ". Sprawdzenia przedziałów: " + jednostki.sprawdzenia + ".";
        for (let i = 0; i < jednostki.obciazenia.length; i++) {
            let p = jednostki.obciazenia[i];
            wiersze.push([tekstOdcinka(p), p.aktywne]);
        }
        pokazTabele(["Jednostka czasu", "Aktywne"], wiersze);
    }
}

// Bez argumentów: przelicza wynik z przedzialy, aktualizuje listę i oś maksimum, potem odbudowuje animację.
// WYNIKI: obliczenia końcowe i historia animacji powstają osobno dla tych samych danych.
function odswiezWidok() {
    // Podgląd końcowy liczymy bez historii. Animacja ma oddzielny stan.
    let konflikty = znajdzKonflikty(przedzialy);
    let pokrycie = polaczPrzedzialy(przedzialy);
    let maksimum = obliczMaksimumZdarzeniami(przedzialy);
    pokazListe();
    document.getElementById("liczba-konfliktow").textContent = konflikty.konflikty.length;
    document.getElementById("dlugosc-pokrycia").textContent = pokrycie.dlugosc;
    document.getElementById("wartosc-maksimum").textContent = maksimum.maksimum;
    pokazOsMaksimum(maksimum);
    pokazWyniki(konflikty, pokrycie, maksimum);
    przygotujAnimacje();
}

// Wpisywanie danych również zatrzymuje przebieg, nawet przed ich zapisaniem.
document.getElementById("formularz-przedzialu").addEventListener("input", resetujAnimacje);
document.getElementById("scenariusz").addEventListener("change", resetujAnimacje);
// Skrypty są na końcu HTML, więc elementy strony już istnieją.
document.getElementById("formularz-przedzialu").addEventListener("submit", zapiszPrzedzial);
document.getElementById("anuluj-edycje").addEventListener("click", anulujEdycje);
document.getElementById("wczytaj-scenariusz").addEventListener("click", wczytajScenariusz);
document.getElementById("algorytm").addEventListener("change", odswiezWidok);
wczytajScenariusz();

document.getElementById("przelicz-porownanie").addEventListener("click", pokazPorownanie);
pokazPorownanie();
