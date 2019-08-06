with import <nixpkgs> {};

stdenv.mkDerivation {
	name = "node-build";
	buildInputs = [
		nodejs-10_x
		yarn
		pkgconfig
		autoconf
		automake
		libudev
		libtool
		libusb
                libusb1
		nasm
		autogen
		zlib
		nodePackages_10_x.node-gyp
  	nodePackages_10_x.node-gyp-build
  	nodePackages_10_x.node-pre-gyp
		python27
		python27Packages.pip
		python27Packages.setuptools
	];
	shellHook = ''
	'';
}
