# ASD1-M1-17 — Rezerwacje sali

**Autor: Deividas Dirma, indeks 93791.** Temat: Przedziały i zdarzenia na osi czasu.

## Cel i funkcje
Program edukacyjny pokazuje nakładanie rezerwacji (konflikty), łączny zajęty czas (pokrycie), początki i końce (zdarzenia) oraz największą liczbę rezerwacji naraz. Wynik sprawdza też metoda jednostkowa.

Dostępne są: dodawanie, edycja i usuwanie, walidacja, trzy scenariusze, pięć metod, Krok, Start/Pauza, Reset i tempo, pseudokod, zmienne, trzy pytania oraz porównanie 5/15/30. Główna oś pokazuje bieżący krok; osobna oś w „Wyniku końcowym” pokazuje wszystkie odcinki maksimum.

## Uruchomienie i testy
1. Rozpakuj **całą paczkę** i otwórz `index.html` w przeglądarce.
2. Zostaw pliki CSS i JS obok HTML. Program działa lokalnie, bez internetu i instalowania zależności.
3. Otwórz `tests.html`, aby uruchomić testy; można je powtórzyć przyciskiem.

Sprawdzenie agenta wykonane podczas przygotowania dokumentacji, 26.10.2026, Firefox 151.0.2: **46 PASS, 0 FAIL**. Osobno **16/16 kontroli interfejsu**. Porównanie dla 5/15/30 dało zgodne maksima 2/8/15 i odcinki. Szczegóły: `weryfikacja/dokumentacja/WYNIKI-NOWE.json`. Wyników nie sumuje się z ponowną kontrolą paczki opisaną w `weryfikacja/KONTROLA-PACZKI.md`. Nie sprawdzono fizycznego Maca, telefonu ani wszystkich przeglądarek.

## Najważniejsze pliki
- `index.html`, `style.css` — strona i wygląd.
- `algorithms.js` — algorytmy; pozostałe skrypty — widok, animacja, pytania i porównanie.
- `tests.html`, `tests.js` — testy z wejściem, oczekiwaniem i wynikiem.
- `DOKUMENTACJA.pdf` — 10 stron; `DOKUMENTACJA.docx` — edytowalne źródło.
- `prezentacja.pptx` — 10 slajdów z łatwiejszymi nazwami i notatkami; `prezentacja.pdf` — zgodny podgląd.

- `materialy/KARTA-ZADANIA.html` — karta; `materialy-dokumentacji/` i `materialy/` — źródłowe zrzuty.
- `weryfikacja/` — kontrola zebranego ZIP-a, wyniki testów i narzędzie do ponowienia sprawdzenia.

Kod zawiera polskie komentarze. Nie zmieniono algorytmów ani wyglądu.

## Ograniczenia i GitHub
Maksymalnie 30 przedziałów, całkowite granice 0–100, unikalne ID. Brak trwałego zapisu: odświeżenie przywraca pierwszy scenariusz. Reset cofa tylko animację. Insertion Sort daje zdarzeniom najgorszy koszt O(n²); liczniki nie mierzą czasu CPU.

Publikacja GitHub i przekazanie linku w Dzienniku **nie są potwierdzone**. Karta ich wymaga; w tej aktualizacji niczego nie publikowano.

## AI i własny wkład
Informacja autora: „Przy realizacji projektu korzystałem z agenta OpenClaw, do którego podłączony był Codex Sol 6.1 z ustawieniem rozumowania medium”. Nazwę konfiguracji podał autor.

Agent pomagał przygotować kod, algorytmy, animacje, testy i materiały, upraszczał interfejs oraz dodawał oś końcowego maksimum. ChatGPT/Codex pomagał przy przeglądzie i wskazówkach. Potwierdzony wkład autora: określanie oczekiwań, wybór wyglądu i nazw, zgłaszanie uwag oraz zlecanie poprawek. Nie przypisuje się autorowi napisania kodu ani wykonania testów agenta.

Wyniki AI kontrolowano przez zestawienie z kartą, konkretne przykłady, stany pośrednie, porównanie metod i uruchomienie w przeglądarce. Testy nie dowodzą poprawności dla wszystkich danych.
