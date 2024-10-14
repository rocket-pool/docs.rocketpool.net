{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs = {nixpkgs, ...}: let
    forAllSystems = function:
      nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed
      (system: function nixpkgs.legacyPackages.${system});
  in {
    formatter = forAllSystems (pkgs: pkgs.alejandra);
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          awscli
          stdenv
          corepack
          docker
          bun
          just
          nodejs
        ];
        shellHook = ''
          echo "Welcome to the RP dev shell!"
          export PATH=$PATH:$PWD/bin
          echo "Installing dependencies"
          bun i
          echo "Starting server"
          just serve
        '';
      };
    });
  };
}