FROM nixos/nix

RUN nix-channel --add https://nixos.org/channels/nixpkgs-18.09-darwin nixpkgs
RUN nix-channel --update

RUN nix-env -ibA nixpkgs.git
RUN nix-env -ibA cachix -f https://cachix.org/api/v1/install

COPY . ./

CMD ["true"]