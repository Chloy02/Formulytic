#!/bin/bash
# Start LibreTranslate server for translation services
# Make sure you have Docker installed

echo "Starting LibreTranslate server..."
docker run -d --name libretranslate \
    -p 5005:5000 \
    -e LT_LOAD_ONLY=en,hi,kn \
    libretranslate/libretranslate:latest

echo "LibreTranslate server started on port 5005"
echo "You can access it at http://localhost:5005"
