#!/usr/bin/env bash
# Vercel engeli kalktıysa son commit'i production'a gönderir.
# Sadece commit'lenmiş dosyalar yüklenir (.env, telefoncum vb. asla gitmez).
# Çıkış kodu: 0 = deploy edildi, 2 = engel sürüyor, 1 = hata
set -uo pipefail
export MSYS_NO_PATHCONV=1

REPO="$(cd "$(dirname "$0")/.." && pwd)"
CFG="$APPDATA/xdg.data/com.vercel.cli"
V="npx --yes vercel@latest --global-config $CFG"
TEAM="team_yV3Bo5VcTw43KSaXkl40h0aC"
OUT="$(mktemp -d)"

cd "$OUT"
if $V api "/v2/teams/$TEAM" 2>/dev/null | grep -q '"softBlock": {'; then
  echo "BLOCKED: Vercel engeli hâlâ sürüyor"
  exit 2
fi

cd "$REPO"
git archive HEAD | tar -x -C "$OUT"
cp -r .vercel "$OUT/"
cd "$OUT"
if ! $V deploy --prod --yes > deploy.log 2>&1; then
  tail -20 deploy.log
  grep -q "fair use" deploy.log && exit 2
  exit 1
fi
tail -5 deploy.log

# Canlı doğrulama
fail=0
check() { local got; got=$(curl -s -o /dev/null -w "%{http_code}" "https://telefonmuhendisi.com$1"); [ "$got" = "$2" ] && echo "OK  $1 $got" || { echo "BAD $1 $got (beklenen $2)"; fail=1; }; }
check /api/v1/devices 404
check /api/test-env 404
check /api/orders 401
check /tmhackerz 308
check /tamir 200
exit $fail
