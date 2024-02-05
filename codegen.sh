#!/usr/bin/env bash

set -euo pipefail
IFS=$'\n\t'

SCRIPTPATH="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )"

cd _codegen
npm run codegen
cd ..

# Execute linting in parallel
(cd "${SCRIPTPATH}/expense-management" && npm run lint -- --fix) &
(cd "${SCRIPTPATH}/embedded-finance" && npm run lint -- --fix) &

wait
