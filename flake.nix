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
          gum
        ];
        shellHook = ''
          gum style	--foreground 208 --border-foreground 208 --border double	--align center --width 50 --margin "1 2" --padding "2 4"	'Welcome to the 🚀RP dev shell!'
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