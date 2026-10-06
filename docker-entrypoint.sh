#!/bin/sh
set -e

yarn migrate

exec node build/index.js
