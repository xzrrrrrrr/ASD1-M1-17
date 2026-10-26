# Kontrola zebranego projektu — 26.10.2026

Wykonawca: agent OpenClaw. Autor: Deividas Dirma, indeks 93791.

## Wybór wersji
- Kod: ostatnia kopia KOMENTARZE. Nie wybrano go tylko po nazwie: sprawdzono pochodzenie i identyczność struktury składniowej sześciu JS z MAKSIMUM. Pliki w paczce są bajtowo identyczne z wybraną kopią z komentarzami.
- Prezentacja: ostatnia wersja LATWIEJSZE-NAZWY, z pytaniami zamiast trudnych nazw, formalnymi terminami w nawiasach i slajdem 9 o OpenClaw. Zachowano PPTX i jego zgodny PDF bajtowo.
- Dokumentacja i README: ostatnia aktualizacja DOKUMENTACJA-2026-10-26. W DOCX/Markdown/PDF zmieniono jedynie ścieżkę do raportu, aby przenieść go do weryfikacja/. README dopasowano do faktycznej zawartości paczki i rozdzielenia uruchomień.
- SHA256 źródeł i ścieżki pochodzenia: WYBOR-WERSJI.json. Wcześniejsze foldery i archiwa zachowano.

## Materiały i odwołania
- PPTX: dokładnie 10 slajdów, 10 zestawów notatek. Otwarcie przez LibreOffice Impress i ponowny eksport: 10 stron; tekst wszystkich stron zgodny z dołączonym prezentacja.pdf.
- DOKUMENTACJA.pdf: dokładnie 10 stron. DOCX otwarto w LibreOffice Writer i wyeksportowano. Treść poza zmianą ścieżki identyczna z ostatnim PDF dokumentacji.
- Wyrenderowano i obejrzano wszystkie 10 stron dokumentacji oraz 10 slajdów prezentacji. Sprawdzono też granice tekstu, autora, indeks, polskie znaki i podpisy obrazów.
- Zweryfikowano lokalne src/href w HTML, obrazy Markdown, wewnętrzne zasoby i relacje DOCX/PPTX oraz nazwy plików w README.
- Informacja o OpenClaw, Codex Sol 6.1 i medium jest podana jako informacja autora. Wkład autora i agenta pozostaje rozdzielony. Nie ma wskazanych placeholderów ani starej nazwy konfiguracji AI w materiałach.
- Algorytmów ani wyglądu nie zmieniano. node --check: sześć bieżących plików JS poprawnych składniowo.

## Wyniki nowego uruchomienia folderu
- Firefox 151.0.2 headless przez file://, HTTP i HTTPS kierowane na zamknięty lokalny port proxy 127.0.0.1:9. To praktyczna kontrola pracy bez WWW, nie rejestracja pakietów sieciowych.
- tests.html: PASS 46, FAIL 0. Pełne wejścia, oczekiwania i wyniki: WYNIKI-KONTROLI-FOLDERU.json.
- Osobno 16/16 kontroli UI: przykład karty, cztery przypadki osi maksimum, po jednym kroku pięciu metod, dodawanie, błędny zakres, edycja, usunięcie, Reset oraz Start/Pauza.
- Porównanie 5/15/30: zgodne maksimum 2/8/15 i wszystkie odcinki, liczniki operacji zapisane osobno od przygotowania i sortowania.
- 1555 małych i 300 powtarzalnych wejść są kontrolami wewnątrz dwóch pozycji testów; nie dodaje się ich drugi raz do 46 PASS.

## Pochodzenie wyników w materiałach
Slajd 8 podaje 15/15 kontroli UI z wcześniejszego uruchomienia tej samej wersji działania. Dokumentacja podaje 16/16 z późniejszej kontroli. To inne zakresy sprawdzeń, nie sprzeczne wyniki ani jedna sumowana seria. Zachowano tylko raporty źródłowe potrzebne do tych materiałów: prezentacja/ZRODLO-SLAJDU-8.json i dokumentacja/WYNIKI-NOWE.json. Dane z nich nie są przedstawiane jako nowe wykonanie ZIP-a.

## Pozostałe uwagi
- W notatce prelegenta slajdu 5 jest powtórzenie „sześć par nakładających się par”. Treść slajdu poprawnie wskazuje 6 par i 4 rezerwacje naraz; prezentacji nie poprawiano podczas składania paczki.
- Nie sprawdzono PowerPointa na fizycznym Macu, Safari/Chrome, telefonu ani pełnej dostępności. Testy nie dowodzą poprawności dla wszystkich danych.
- Publikacja GitHub i przekazanie linku w Dzienniku są niepotwierdzone i nie wykonano ich teraz. Demonstracja i samodzielne odpowiedzi pozostają po stronie autora.

## Archiwum
Archiwum ma jeden folder główny ASD1-M1-17-Deividas-Dirma-93791. Integralność, zgodność plików po rozpakowaniu i uruchomienie rozpakowanej kopii są opisane w WYNIKI-ZIP.json oraz WYNIKI-PO-ROZPAKOWANIU.json. Ponowne wykonanie tego samego zestawu nie zwiększa liczby testów.
