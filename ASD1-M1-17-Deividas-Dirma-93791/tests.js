// Plik tests.js: bieżące testy algorytmów, walidacji i historii oraz ich lista na tests.html.
// Najpierw wczytaj algorithms.js. W konsoli wywołaj uruchomTestyAlgorytmow(); strona robi to automatycznie.
// Bez argumentów: wykonuje testy i zwraca liczniki PASS/FAIL oraz listę wejść, oczekiwań i wyników.
function uruchomTestyAlgorytmow() {
    let wyniki = [];
    let zaliczone = 0;
    let niezaliczone = 0;
    // Przyjmuje nazwę, wejście, oczekiwanie i wynik; porównuje je, zmienia liczniki i wypisuje rezultat.
    function test(nazwa, wejscie, oczekiwane, rzeczywiste) {
        let ok = JSON.stringify(oczekiwane) === JSON.stringify(rzeczywiste);
        if (ok) { zaliczone++; } else { niezaliczone++; }
        let status = 'FAIL';
        if (ok) { status = 'PASS'; }
        wyniki.push({nazwa:nazwa,wejscie:wejscie,oczekiwane:oczekiwane,rzeczywiste:rzeczywiste,status:status});
        console.log(status + ' — ' + nazwa);
        console.log('Wejście: ' + JSON.stringify(wejscie));
        console.log('Oczekiwane: ' + JSON.stringify(oczekiwane));
        console.log('Rzeczywiste: ' + JSON.stringify(rzeczywiste));
    }
    // Z listy par granic tworzy i zwraca przedziały z różnymi ID, aby test nie odpadł z powodu duplikatów.
    function dane(granice) {
        let wynik = [];
        for (let i = 0; i < granice.length; i++) {
            wynik.push({id: 'P' + (i + 1), start: granice[i][0], end: granice[i][1]});
        }
        return wynik;
    }
    // Przyjmuje przedziały; zwraca wspólny opis wyników wszystkich metod, używany do porównania z oczekiwaniem.
    function podsumuj(przedzialy) {
        let konflikty = znajdzKonflikty(przedzialy);
        let laczenie = polaczPrzedzialy(przedzialy);
        let zdarzenia = obliczMaksimumZdarzeniami(przedzialy);
        let jednostki = obliczJednostkami(przedzialy);
        return {pary: konflikty.konflikty.length, pokrycie: laczenie.odcinki, dlugosc: laczenie.dlugosc,
            maksimum: zdarzenia.maksimum, odcinki: zdarzenia.odcinki,
            jednostki: {maksimum: jednostki.maksimum, odcinki: jednostki.odcinki}};
    }
    // Przyjmuje nazwę, granice i oczekiwane wartości; buduje dane i zgłasza jeden test wielu wyników.
    function przypadek(nazwa, granice, pary, pokrycie, dlugosc, maksimum, odcinki) {
        let wejscie = dane(granice);
        test(nazwa, wejscie, {pary: pary, pokrycie: pokrycie, dlugosc: dlugosc, maksimum: maksimum,
            odcinki: odcinki, jednostki: {maksimum: maksimum, odcinki: odcinki}}, podsumuj(wejscie));
    }
    // Bez rezerwacji nie ma par, pokrycia ani dodatniego maksimum.
    przypadek('Puste wejście', [], 0, [], 0, 0, []);
    // Jeden wpis nie tworzy pary; zajmuje 3 jednostki i sam wyznacza maksimum 1.
    przypadek('Jeden przedział', [[1,4]], 0, [{start:1,end:4}], 3, 1, [{start:1,end:4}]);
    // Wspólny odcinek to [2,4), dlatego istnieje jedna para i maksimum 2.
    przypadek('Dwa nakładające', [[1,4],[2,5]], 1, [{start:1,end:5}], 4, 2, [{start:2,end:4}]);
    // Chwila 5 nie należy do pierwszego wpisu; pokrycie mimo to jest ciągłe.
    przypadek('Stykanie bez konfliktu', [[2,5],[5,8]], 0, [{start:2,end:8}], 6, 1, [{start:2,end:8}]);
    // Przykład karty: nakładają się tylko pierwsze dwa wpisy; ostatnie dwa jedynie się stykają.
    przypadek('Przykład z opisu w rozmowie', [[1,4],[2,5],[5,7]], 1, [{start:1,end:7}], 6, 2, [{start:2,end:4}]);
    // Dwie różne rezerwacje mogą mieć te same granice; oba wpisy liczą się do maksimum.
    przypadek('Identyczne granice, różne ID', [[2,5],[2,5]], 1, [{start:2,end:5}], 3, 2, [{start:2,end:5}]);
    // Na [3,4) aktywne są wszystkie trzy wpisy, a najdłuższy zachowuje całe pokrycie.
    przypadek('Pełne zagnieżdżenie', [[0,10],[2,8],[3,4]], 3, [{start:0,end:10}], 10, 3, [{start:3,end:4}]);
    // Zmiana zestawu ID w czasie 5 nie przerywa poziomu 2, więc odcinki maksimum się łączą.
    przypadek('Wspólny czas końców i początków', [[0,5],[1,5],[5,8],[5,9]], 2, [{start:0,end:9}], 9, 2, [{start:1,end:8}]);
    // Między grupami jest przerwa, więc wynik musi zachować dwa osobne odcinki.
    przypadek('Dwa oddzielne maksima', [[1,3],[2,4],[6,8],[7,9]], 2, [{start:1,end:4},{start:6,end:9}], 6, 2, [{start:2,end:3},{start:7,end:8}]);
    // Sprawdzamy końce dozwolonej osi; przedział [99,100) ma jeszcze dodatnią długość.
    przypadek('Granice 0 i 100', [[0,100],[99,100]], 1, [{start:0,end:100}], 100, 2, [{start:99,end:100}]);
    // Algorytm sortuje kopię i łączy styki niezależnie od kolejności wejścia.
    przypadek('Wejście nieposortowane', [[8,10],[1,3],[3,8]], 0, [{start:1,end:10}], 9, 1, [{start:1,end:10}]);
    // WALIDACJA: każdy przykład łamie co najmniej jedną zasadę; oczekujemy niepustej listy błędów.
    let zle = [
        ['start = end', [{id:'A',start:4,end:4}]],
        ['start > end', [{id:'A',start:5,end:4}]],
        ['Brak ID', [{start:1,end:2}]],
        ['Puste ID', [{id:' ',start:1,end:2}]],
        ['Powtórzone ID', [{id:'A',start:1,end:2},{id:'A',start:2,end:3}]],
        ['Liczbowe ID', [{id:1,start:1,end:2}]],
        ['Skrajne spacje ID', [{id:' A',start:1,end:2}]],
        ['Start ujemny', [{id:'A',start:-1,end:2}]],
        ['Koniec powyżej 100', [{id:'A',start:1,end:101}]],
        ['Ułamek', [{id:'A',start:1.5,end:2}]],
        ['Napis zamiast liczby', [{id:'A',start:'1',end:2}]],
        ['null zamiast przedziału', [null]],
        ['Brak tablicy', null],
        ['NaN', [{id:'A',start:NaN,end:2}]],
        ['Infinity', [{id:'A',start:1,end:Infinity}]]
    ];
    for (let i = 0; i < zle.length; i++) {
        test('Walidacja: ' + zle[i][0], zle[i][1], true, sprawdzDane(zle[i][1]).length > 0);
    }
    // Granica limitu: 30 wpisów jest poprawne, 31 już nie; dla 30 identycznych jest 30·29/2 = 435 par.
    let trzydziesci = [];
    for (let i = 0; i < 30; i++) { trzydziesci.push({id:'P'+i,start:0,end:100}); }
    test('30 przedziałów poprawnych', trzydziesci, [], sprawdzDane(trzydziesci));
    test('30 identycznych przedziałów', '30 x [0,100)', {pary:435,maksimum:30}, {pary:znajdzKonflikty(trzydziesci).konflikty.length,maksimum:obliczMaksimumZdarzeniami(trzydziesci).maksimum});
    trzydziesci.push({id:'P30',start:0,end:100});
    test('31 przedziałów odrzuconych', '31 x [0,100)', true, sprawdzDane(trzydziesci).length > 0);
    test('Walidacja pustej tablicy', [], [], sprawdzDane([]));
    // STANY POŚREDNIE: kontrolujemy decyzję w pętli, nie tylko końcową odpowiedź.
    let a = dane([[1,4],[2,5],[5,7]]);
    let historia = znajdzKonflikty(a, true).kroki;
    test('Stan pośredni konfliktu', a, {i:0,j:1,lewa:2,prawa:4,konflikt:true}, {i:historia[1].i,j:historia[1].j,lewa:historia[1].lewa,prawa:historia[1].prawa,konflikt:historia[1].konflikt});
    let b = dane([[2,5],[5,8]]);
    let przebieg = obliczZdarzenia(b, true);
    let zmiany = [];
    let poGrupie = [];
    for (let i = 0; i < przebieg.kroki.length; i++) {
        let k = przebieg.kroki[i];
        if (k.czas === 5) { zmiany.push({zmiana:k.zmiana,przed:k.przed,aktywne:k.aktywne}); }
        if (k.start === 5) { poGrupie.push({start:k.start,end:k.end,aktywne:k.aktywne}); }
    }
    test('Stany pośrednie: końce przed początkami', b, [{zmiana:-1,przed:1,aktywne:0},{zmiana:1,przed:0,aktywne:1}], zmiany);
    test('Odcinek dopiero po całej grupie', b, [{start:5,end:8,aktywne:1}], poGrupie);
    let sort = sortujPrzedzialy(dane([[8,9],[1,2],[4,5]]), true);
    let poczatki = [];
    for (let i = 0; i < sort.kroki[3].tablica.length; i++) { poczatki.push(sort.kroki[3].tablica[i].start); }
    test('Stan pośredni Insertion Sort', '[8,1,4] — po pierwszym wstawieniu', [1,8,4], poczatki);
    test('Dokładne liczniki sortowania', [8,1,4], {porownania:3,przesuniecia:2}, {porownania:sort.porownania,przesuniecia:sort.przesuniecia});
    // Porównanie przed i po sprawdza, czy sortowanie lub historia nie zmodyfikowały wejścia.
    let przed = JSON.stringify(a);
    polaczPrzedzialy(a, true); obliczMaksimumZdarzeniami(a,true); znajdzKonflikty(a,true); obliczJednostkami(a,true);
    test('Algorytmy nie zmieniają wejścia', przed, przed, JSON.stringify(a));
    let bez = obliczMaksimumZdarzeniami(a);
    test('Historia domyślnie wyłączona', a, [0,0,0,0], [bez.kroki.length,bez.przebieg.kroki.length,bez.przebieg.tworzenie.length,bez.przebieg.sortowanie.kroki.length]);
    let zHistoria = obliczMaksimumZdarzeniami(a,true);
    test('Historia nie zmienia wyniku', a, {maksimum:bez.maksimum,odcinki:bez.odcinki}, {maksimum:zHistoria.maksimum,odcinki:zHistoria.odcinki});
    test('Liczniki podstawowe', a, {pary:3,jednostki:300,zdarzenia:6}, {pary:znajdzKonflikty(a).sprawdzenia,jednostki:obliczJednostkami(a).sprawdzenia,zdarzenia:obliczZdarzenia(a).przetworzoneZdarzenia});
    // Dwie poniższe kontrole zbiorcze są dwiema pozycjami zestawu, nie tysiącami nowych testów PASS.
    let pelnaZgodnosc = true;
    let liczbaZestawow = 0;
    let mozliwe = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
    // Wszystkie ciągi długości 0..4 z sześciu możliwych przedziałów.
    for (let n = 0; n <= 4; n++) {
        let liczba = Math.pow(6,n);
        for (let kod = 0; kod < liczba; kod++) {
            let numer = kod;
            let granice = [];
            for (let i = 0; i < n; i++) {
                granice.push(mozliwe[numer % 6]);
                numer = Math.floor(numer / 6);
            }
            let p = dane(granice);
            let e = obliczMaksimumZdarzeniami(p);
            let u = obliczJednostkami(p);
            if (e.maksimum !== u.maksimum || JSON.stringify(e.odcinki) !== JSON.stringify(u.odcinki)) { pelnaZgodnosc = false; }
            liczbaZestawow++;
        }
    }
    test('Wyczerpująca zgodność metod', liczbaZestawow + ' zestawów, granice 0..3, n=0..4', true, pelnaZgodnosc);
    let ziarno = 17;
    // Bez argumentów: zmienia lokalne ziarno i zwraca kolejną liczbę; to samo ziarno daje powtarzalne dane.
    function losuj() { ziarno = (ziarno * 16807) % 2147483647; return ziarno; }
    let zgodne = true;
    for (let numer = 0; numer < 300; numer++) {
        let p = [];
        let n = numer % 31;
        for (let i = 0; i < n; i++) {
            let start = losuj() % 100;
            let end = start + 1 + losuj() % (100 - start);
            p.push({id:'P'+i,start:start,end:end});
        }
        let e = obliczMaksimumZdarzeniami(p);
        let u = obliczJednostkami(p);
        let pokrycie = polaczPrzedzialy(p);
        let dlugosc = 0;
        for (let t = 0; t < 100; t++) {
            let ile = 0;
            for (let i = 0; i < p.length; i++) { if (p[i].start <= t && t < p[i].end) { ile++; } }
            if (ile > 0) { dlugosc++; }
            let zeZdarzen = 0;
            for (let i = 0; i < e.przebieg.odcinki.length; i++) {
                let o = e.przebieg.odcinki[i];
                if (o.start <= t && t < o.end) { zeZdarzen = o.aktywne; }
            }
            if (ile !== zeZdarzen) { zgodne = false; }
        }
        if (sprawdzDane(p).length > 0 || e.maksimum !== u.maksimum || JSON.stringify(e.odcinki) !== JSON.stringify(u.odcinki) || dlugosc !== pokrycie.dlugosc) { zgodne = false; }
    }
    test('Pełny zakres: obciążenia, maksima i długość pokrycia', '300 powtarzalnych zestawów; n=0..30; granice 0..100; ziarno 17', true, zgodne);
    let karta = [{id:'A',start:1,end:4},{id:'B',start:2,end:5},{id:'C',start:5,end:7}];
    test('Dokładna para z karty', karta, [{id1:'A',id2:'B',start:2,end:4}], znajdzKonflikty(karta).konflikty);
    // Dla n identycznych [0,100) oczekujemy maksimum n, 2n zdarzeń i 100n sprawdzeń.
    let rozmiary = [5,15,30];
    for (let i = 0; i < rozmiary.length; i++) {
        let p = [];
        let n = rozmiary[i];
        for (let j = 0; j < n; j++) { p.push({id:'P'+j,start:0,end:100}); }
        let e = obliczMaksimumZdarzeniami(p);
        let u = obliczJednostkami(p);
        test('Liczniki dla n=' + n, n + ' x [0,100)', {maksimum:n,sprawdzenia:100*n,zdarzenia:2*n}, {maksimum:e.maksimum,sprawdzenia:u.sprawdzenia,zdarzenia:e.przebieg.przetworzoneZdarzenia});
        console.log('Sortowanie zdarzeń: porównania=' + e.przebieg.sortowanie.porownania + ', przesunięcia=' + e.przebieg.sortowanie.przesuniecia);
    }
    test('Historia sortowania zachowuje wcześniejszy stan', '[8,1,4] — początkowy stan po całym sortowaniu', [{id:'P1',start:8,end:9},{id:'P2',start:1,end:2},{id:'P3',start:4,end:5}], sort.kroki[0].tablica);
    console.log('PODSUMOWANIE: PASS ' + zaliczone + ', FAIL ' + niezaliczone);
    return {pass:zaliczone,fail:niezaliczone,wyniki:wyniki};
}


// Bez argumentów: wykonuje testy, wpisuje wyniki do DOM i zwraca ten sam raport.
// WIDOK TESTÓW: pokazuje te same wejścia, oczekiwania i wyniki, które zwraca funkcja testowa.
function pokazTesty() {
    let rezultat = uruchomTestyAlgorytmow();
    let lista = document.getElementById("wyniki-testow");
    lista.textContent = "";
    document.getElementById("status-testow").textContent = "PASS " + rezultat.pass + ", FAIL " + rezultat.fail;
    for (let i = 0; i < rezultat.wyniki.length; i++) {
        let r = rezultat.wyniki[i];
        let blok = document.createElement("div");
        blok.className = "test-wynik test-pass";
        if (r.status === "FAIL") { blok.className = "test-wynik test-fail"; }
        let tytul = document.createElement("h3");
        tytul.textContent = r.status + " — " + r.nazwa;
        blok.appendChild(tytul);
        let opis = document.createElement("pre");
        opis.textContent = "Wejście: " + JSON.stringify(r.wejscie) + "\nOczekiwane: " + JSON.stringify(r.oczekiwane) + "\nRzeczywiste: " + JSON.stringify(r.rzeczywiste);
        blok.appendChild(opis);
        lista.appendChild(blok);
    }
    return rezultat;
}

// Pozwala użyć tego samego pliku jako testów w konsoli bez strony.
if (typeof document !== "undefined") {
    document.getElementById("uruchom-testy").addEventListener("click", pokazTesty);
    pokazTesty();
}
