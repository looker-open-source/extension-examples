#!/usr/bin/env bash
package_flag=''
version_flag=''
while getopts 'p:v:' flag; do
case "${flag}" in
    p) package_flag="${OPTARG}" ;;
    v) version_flag="${OPTARG}" ;;
  esac
done
export PKG=$package_flag
export VERS=$version_flag
echo "Ok, going to update all extension-examples to ${PKG}@${VERS}... Cancel this command within 5 seconds if you don't want to do this!"
sleep 5
echo "Updating!"
find . -type d -not -path '*/node_modules*' \
-exec sh -c 'shopt -s failglob; ( : "$1"/*.lock ) 2>/dev/null && cd {} && yarn add "${PKG}@${VERS}"' - {} \;

