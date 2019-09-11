with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "build-env";
  buildInputs = [
    docker
    docker_compose
    nodejs-10_x
    yarn
    pkgconfig
    autoconf
    automake
    libudev
    libtool
    libusb
    libusb.dev
    libusb1
    libusb1.dev
    nasm
    autogen
    zlib
    nodePackages_10_x.node-gyp
    nodePackages_10_x.node-gyp-build
    nodePackages_10_x.node-pre-gyp
    #python36
    #python36Packages.pip
    #python36Packages.setuptools
    kubectl
    git
    awscli
    aws-iam-authenticator
  ];
}
