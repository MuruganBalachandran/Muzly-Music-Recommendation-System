#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Debug Info ---"
python --version
pip --version
uname -a
echo "------------------"

python -m pip install --upgrade pip
pip install -r requirements.txt

# Pre-download models so they are baked into the image
python -c "from transformers import CLIPProcessor, CLIPModel; CLIPModel.from_pretrained('openai/clip-vit-base-patch32'); CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')"
