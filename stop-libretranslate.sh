#!/bin/bash
# Stop LibreTranslate server

echo "Stopping LibreTranslate server..."
docker stop libretranslate
docker rm libretranslate
echo "LibreTranslate server stopped"
