#!/usr/bin/env python3
# descarga de librerias
import sys
import json
import random

# establecer omw, wordnet y lematizadores a usar
import nltk
nltk.download("omw-2.0", quiet=True)
nltk.download("wordnet", quiet=True)

from nltk.corpus import wordnet as wn
from wordfreq import zipf_frequency

## inglés
from nltk.stem import WordNetLemmatizer
lematizador = WordNetLemmatizer()

## español
import spacy
from spacy import displacy
nlp = spacy.load("es_core_news_md")


# inicializar wordnet para que tengas otros idiomas
wn.synsets("perro", lang='spa')



# FUNCIONES PARA JUEGO
## para lematizar en inglés
def lematizar_en(palabra: str):
    palabra = palabra.split()
    respuesta = []
    for pal in palabra:
        respuesta.append(lematizador.lemmatize(pal, 'n'))
    return respuesta

## para lematizar en español
def lematizar_es(palabra: str):
    pal = nlp(palabra)
    respuesta = []
    for token in pal:
        respuesta.append(token.lemma_)
    return respuesta

## para lematizar en cualquiera de los 2 idiomas
def obtener_lema(texto_normalizado: str, idioma: str):
    if idioma == "es":
        lemas = lematizar_es(texto_normalizado)
    else:
        lemas = lematizar_en(texto_normalizado)
    return lemas

# para normalizar el texto y luego lematizar en cualquiera de los 2 idiomas
def normalizar(texto: str, idioma: str):
    texto = texto.replace("_", " ").lower()
    texto = " ".join(texto.split())
    return obtener_lema(texto, idioma)


# el juego en si
class GameState:

    # configuración del "modo" de juego
    def __init__(self, language: str, difficulty: int):
        self.language = language
        self.spanish = (language == "es")
        self.dificultad = int(difficulty)
        self.clues = []
        self.target_word = ""
        self.synset = None
        self.current_clue_index = 0
        self.guesses_count = 0
        self.finished = False

        self._generate_game()

    # generación de juego, elección de la categoria y sus pistas
    def _generate_game(self):

        # para establecer idiomas a utilzar internamente
        lang_wn = 'spa' if self.spanish else 'eng'
        lang_code = "es" if self.spanish else "en"

        all_synsets = list(wn.all_synsets(lang=lang_wn, pos=wn.NOUN))
        cant_pistas = 0


        while cant_pistas < 5: # que hayan disponibles al menos 5 palabras para usar de pistas

            # elección de synset y un lema de
            synset_random = random.choice(all_synsets)
            lemmas_list = synset_random.lemma_names(lang=lang_wn)
            if not lemmas_list:
                continue

            # ordenarlos y corroborar que no sean palabras muy raras con Zipf
            lema_random = sorted(lemmas_list, key=lambda x: zipf_frequency(x, lang_code),reverse=True)[0]

            if zipf_frequency(lema_random, lang_code) < self.dificultad:
                continue


            # generar hiponimos e hiperonimos, corroborar que no sean palabras muy raras con Zipf, y que no estén vacías
            pistas = [] # todos los hiperonimos e hiponimos del lema no muy raros

            for hipo in synset_random.hyponyms():
                lemmas = []
                for lemma in hipo.lemma_names(lang=lang_wn):
                    if lemma != lema_random and zipf_frequency(lemma, lang_code) > self.dificultad:
                        lemmas.append(lemma)
                if len(lemmas) > 0:
                    pistas.append(lemmas)

            for hyper in synset_random.hypernyms():
                lemmas = []
                for lemma in hyper.lemma_names(lang=lang_wn):
                    if lemma != lema_random and zipf_frequency(lemma, lang_code) > self.dificultad:
                        lemmas.append(lemma)
                if len(lemmas) > 0:
                    pistas.append(lemmas)

            pistas_finales = [] # pistas no repetidas (tomando en cuenta normalización), ordenadas según Zipf
            lemas_finales = []

            # ordenar pistas, eliminando repetidas (tomando en cuenta normalización) para elegir top 5
            for i in range(len(pistas)):
                pistas_ordenado = sorted(pistas[i], key=lambda x: zipf_frequency(x, lang_code), reverse=True)
                for j in range(len(pistas_ordenado)):
                    pista_normalizada = normalizar(pistas_ordenado[j], lang_code)
                    if pista_normalizada not in lemas_finales:
                        pistas_finales.append(pistas_ordenado[j])
                        lemas_finales.append(pista_normalizada)
                        break

            pistas_finales = sorted(pistas_finales, key=lambda x: zipf_frequency(x, lang_code), reverse=True)
            cant_pistas = len(pistas_finales)

        # establecer características
        self.synset = synset_random
        self.target_word = lema_random.replace('_', ' ')
        self.clues = [pistas_finales[4 - i].replace('_', ' ') for i in range(5)]
        self.current_clue_index = 0
        self.guesses_count = 0
        self.finished = False


    # chequeo de las respuestas del jugador
    def check_guess(self, guess: str) -> dict:
        if self.finished:
            return {"type": "error", "message": "Game already finished"}

        self.guesses_count += 1 # num de turnos

        # para establecer idiomas a utilzar internamente
        lang_code = "es" if self.spanish else "en"
        lang_wn = 'spa' if self.spanish else 'eng'

        # normalizar la respuesta dada por usuario
        guess_normalizada = normalizar(guess, lang_code)
        ganaste = False

        # checar si es alguno de los lemas (normalizados) dentro del synset
        for lema in self.synset.lemma_names(lang=lang_wn):
            if guess_normalizada == normalizar(lema, lang_code):
                ganaste = True
                break

        # mensaje si adivina correctamente
        if ganaste:
            self.finished = True
            return {
                "type": "game_finished",
                "result": "won",
                "answer": self.target_word
            }

        # mensaje si pierde
        if self.guesses_count >= 5:
            self.finished = True
            return {
                "type": "game_finished",
                "result": "lost",
                "answer": self.target_word
            }

        # el juego continua, más pistas
        return {"type": "guess_result", "correct": False}


# main del juego, conexión con front-end
def main():
    current_game = None


    sys.stdout.write(json.dumps({"type": "ready"}) + "\n")
    sys.stdout.flush()

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            action = req.get("action")

            if action == "new_game":
                language = req.get("language", "es")
                difficulty = req.get("difficulty", 4)
                current_game = GameState(language, difficulty)
                res = {
                    "type": "game_started",
                    "clues": current_game.clues
                }
                sys.stdout.write(json.dumps(res) + "\n")
                sys.stdout.flush()

            elif action == "guess":
                if not current_game:
                    res = {"type": "error", "message": "No active game. Start with new_game."}
                else:
                    value = req.get("value", "")
                    res = current_game.check_guess(value)
                sys.stdout.write(json.dumps(res) + "\n")
                sys.stdout.flush()

            else:
                sys.stdout.write(json.dumps({"type": "error", "message": f"Unknown action: {action}"}) + "\n")
                sys.stdout.flush()

        except Exception as e:
            sys.stdout.write(json.dumps({"type": "error", "message": str(e)}) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
