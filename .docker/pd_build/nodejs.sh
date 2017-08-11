#!/bin/bash
set -e
source /pd_build/buildconfig
set -x

echo "+ Installing Node 4.8.3"
run apt-get install -y rlwrap
run curl https://deb.nodesource.com/node_4.x/pool/main/n/nodejs/nodejs_4.8.3-1nodesource1~xenial1_amd64.deb -o /tmp/node.deb
run dpkg --install /tmp/node.deb
run rm /tmp/node.deb
echo "+ Updating npm"
run npm update npm -g
if [[ ! -e /usr/bin/node ]]; then
	ln -s /usr/bin/nodejs /usr/bin/node
fi