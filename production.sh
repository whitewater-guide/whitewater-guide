#!/usr/bin/env bash

show_help() {
cat << EOF
Usage: ${0##*/} [OPTIONS...]

Does any or all of following steps: builds web-client and backend for production and deploys them

    -c, --client        Should build web-client
    -s, --server        Should build backend
    -d, --deploy        Should deploy everything
    --help          Display this help and exit.
EOF
}

#On mac this is required to install proper getopt
#brew install gnu-getopt
#brew link --force gnu-getopt
#brew install gnu-tar
#ln -s /usr/local/bin/gtar /usr/local/bin/gnutar


OPTS="$(getopt -o csd --long client,server,deploy,help -n "$0" -- "$@")"
eval set -- "$OPTS"

BUILD_CLIENT=false
BUILD_SERVER=false
DEPLOY=false
NODE_ENV=production

while true ; do
    case "$1" in
        --help) show_help; exit 0 ;;
        -c|--client) BUILD_CLIENT=true; shift ;;
        -s|--server) BUILD_SERVER=true; shift ;;
        -d|--deploy) DEPLOY=true; shift ;;
        --) shift ; break ;;
        *) echo "Internal error!" ; exit 1 ;;
    esac
done

exec > >(tee -i build/production.log)
exec 2>&1

if [ "$BUILD_SERVER" = true ]
then
    echo "----------- BUILDING METEOR BUNDLER IMAGE -------------"
    docker build --force-rm -f ./.docker/meteor_bundler.docker --tag docker_bundler_image .
    echo "----------- BUNDLING METEOR INSIDE DOCKER CONTAINER -------------"
    docker run --rm --volume `pwd`/backend/build:/build docker_bundler_image
    echo "----------- BUNDLING COMPLETE ------------"
    docker rmi docker_bundler_image
fi

if [ "$BUILD_CLIENT" = true ]
then
    echo "----------- BUNDLING CLIENT CODE ------------"
    cd web-client
    yarn run build
    cd ../
    echo "----------- CLIENT CODE BUNDLED ------------"
fi

if [ "$DEPLOY" = true ]
then
    echo "----------- REMOVING OLD BUNDLE ------------"
    rm build/bundle.tar.gz
    echo "----------- COMPRESSING CLIENT AND SERVER BUNDLE ------------"
    tar -czf build/bundle.tar.gz \
        -C backend/build . \
        --transform 's,^build,bundle/public,' -C ../../web-client build
    echo "----------- DOCKER ENV WWGUIDE ------------"
    eval $(docker-machine env wwguide)

    # In production, we have to down everything, otherwise we will run out of memory
    # while building new images
    echo "----------- STOP OLD CONTAINERS ------------"
    docker-compose -f ${NODE_ENV}.yml down
    docker rm $(docker ps -a -q)
    docker rmi $(docker images --quiet --filter "dangling=true")
    echo "----------- RUN DOCKER COMPOSE ------------"
    docker-compose -f ${NODE_ENV}.yml up -d --build
fi

echo "DONE"