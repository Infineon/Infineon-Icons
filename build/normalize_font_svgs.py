import argparse
from pathlib import Path

from picosvg.svg import SVG


def normalize_directory(source_dir: Path, target_dir: Path) -> None:
    target_dir.mkdir(parents=True, exist_ok=True)

    for source_file in sorted(source_dir.glob("*.svg")):
        try:
            normalized_svg = SVG.parse(source_file).topicosvg(ndigits=6).tostring()
            normalized_svg = normalized_svg.replace(' clip-rule="evenodd"', "")
        except Exception as error:
            raise RuntimeError(f"Failed to normalize {source_file.name}") from error

        (target_dir / source_file.name).write_text(normalized_svg, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Normalize SVGs for icon-font generation with picosvg."
    )
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("target_dir", type=Path)
    args = parser.parse_args()

    normalize_directory(args.source_dir, args.target_dir)


if __name__ == "__main__":
    main()