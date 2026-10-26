// Plik education.js: pytanie o bieżący stan animacji i wyjaśnienie odpowiedzi.
// Trzecie pytanie korzysta z faktycznie widocznego zapisu historii.
// Odczytuje widoczny krok; czyści poprzednią odpowiedź i włącza pytanie tylko, gdy stan zawiera aktywne.
function odswiezPytanie() {
    let pytanie = document.getElementById("pytanie-stanu");
    let odpowiedz = document.getElementById("odpowiedz-stanu");
    let przycisk = document.getElementById("sprawdz-odpowiedz");
    document.getElementById("ocena-odpowiedzi").textContent = "";
    odpowiedz.value = "";
    przycisk.disabled = true;
    if (numerKroku < 0 || krokiAnimacji[numerKroku].stan.aktywne === undefined) {
        pytanie.textContent = "3. Wybierz zdarzenia, maksimum lub jednostki i przejdź do kroku zawierającego zmienną aktywne.";
        return;
    }
    pytanie.textContent = "3. Jaką wartość ma aktywne w widocznym kroku " + (numerKroku + 1) + "? Zinterpretuj ten licznik, zanim sprawdzisz odpowiedź.";
    przycisk.disabled = false;
}

// Porównuje wpis z licznikiem aktualnego stanu; zmienia ocenę i wyjaśnienie, nie stan algorytmu.
function sprawdzOdpowiedz() {
    if (numerKroku < 0) { return; }
    let s = krokiAnimacji[numerKroku].stan;
    if (s.aktywne === undefined) { return; }
    let wpis = document.getElementById("odpowiedz-stanu").value;
    let tekst = "Niepoprawnie. ";
    if (wpis.trim() !== "" && Number(wpis) === s.aktywne) { tekst = "Poprawnie. "; }
    tekst += "Zapis wykonania podaje aktywne = " + s.aktywne + ". ";
    let etap = krokiAnimacji[numerKroku].etap;
    // Poprawna liczba może być jeszcze częściowa: trzeba wyjaśnić, czy zakończono grupę czasu lub całą jednostkę.
    if (etap === "zdarzenia" && s.linia === 1) {
        tekst += "To licznik po tym zdarzeniu. Obciążenie odcinka oceniamy dopiero po wszystkich zdarzeniach tej chwili.";
    } else if (etap === "jednostki" && s.linia === 1) {
        tekst += "Sprawdzono dopiero przedziały od indeksu 0 do i. To jeszcze nie musi być licznik całej jednostki.";
    } else {
        tekst += "To obciążenie badanego odcinka lub całej jednostki. Maksimum porównujemy tylko na odcinkach dodatniej długości.";
    }
    document.getElementById("ocena-odpowiedzi").textContent = tekst;
}

document.getElementById("sprawdz-odpowiedz").addEventListener("click", sprawdzOdpowiedz);
