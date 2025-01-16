#!/bin/sh
set -xe

DIRNAME=$(cd -- `dirname -- $0` && pwd)

export DATABASE_URL="file:$DIRNAME/release.db"
export JWT_SECRET=pikachu123
export JWT_ISSUER=wassupchat
export JWT_AUDIENCE=chatters

pnpm prisma db push
pnpm preview
