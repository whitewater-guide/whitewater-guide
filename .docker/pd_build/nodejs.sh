#!/bin/bash
set -e
source /pd_build/buildconfig
set -x

echo "+ Enabling Node Source APT repo"
run curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo 'deb https://deb.nodesource.com/node_4.x xenial main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_4.x xenial main' >> /etc/apt/sources.list.d/nodesource.list && apt-get update

## Install Node.js (also needed for Rails asset compilation)
minimal_apt_get_install nodejs=4.8.3-1nodesource1~xenial1
echo "+ Updating npm"
run npm update npm -g
if [[ ! -e /usr/bin/node ]]; then
	ln -s /usr/bin/nodejs /usr/bin/node
fi