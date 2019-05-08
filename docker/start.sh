#!/bin/bash
name="$(./util/name.sh -1)"

docker run --detach \
    --hostname localhost \
    --publish 3000:3000 \
    --publish 7070:8080 \
    --name $name \
    --restart always \
    privatesky/csb_ui
