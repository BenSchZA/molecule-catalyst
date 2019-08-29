#!/bin/sh
set -o errexit -o nounset -o pipefail

rm index.js

cat <<EOF >> index.js
let contracts = {
EOF

for file in ./artifacts/*.json; do
  echo "  '$(basename $file .json)': require('$file'),"
done >> index.js

cat <<EOF >> index.js
};

module.exports = contracts;
EOF
