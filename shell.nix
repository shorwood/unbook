{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    git
    pnpm_10
    nodejs_22
  ];
}
