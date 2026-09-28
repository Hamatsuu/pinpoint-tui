#!/usr/bin/env sh
# Create the Python backend environment with uv.
set -e
cd "$(dirname "$0")"

uv venv
uv pip install nltk wordfreq spacy pip
uv run python -m spacy download es_core_news_md

echo "Done. Run: bun start"
