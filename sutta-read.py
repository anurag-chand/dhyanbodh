import requests
import sys
import argparse
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text

console = Console()

# Reference Data for Sutta Ranges
SUTTA_RANGES = {
    "DN": {"name": "Dīgha Nikāya", "range": "1 - 34", "format": "dn[number]", "example": "dn16"},
    "MN": {"name": "Majjhima Nikāya", "range": "1 - 152", "format": "mn[number]", "example": "mn10"},
    "SN": {"name": "Saṁyutta Nikāya", "range": "1.1 - 56.131", "format": "sn[chapter].[sutta]", "example": "sn56.11"},
    "AN": {"name": "Aṅguttara Nikāya", "range": "1.1 - 11.1147", "format": "an[chapter].[sutta]", "example": "an3.65"},
    "DHP": {"name": "Dhammapada", "range": "1 - 423", "format": "dhp[number]", "example": "dhp1"}
}

def show_ranges():
    """Display a beautiful table of sutta ranges."""
    table = Table(title="SuttaCentral Numbering Reference", header_style="bold yellow")
    table.add_column("Collection", style="cyan")
    table.add_column("Name", style="italic")
    table.add_column("Range", justify="center")
    table.add_column("ID Format", style="green")
    table.add_column("Example", style="magenta")

    for key, info in SUTTA_RANGES.items():
        table.add_row(key, info["name"], info["range"], info["format"], info["example"])
    
    console.print(table)
    console.print("\n[dim]Note: SN and AN use decimal points for Chapter.Sutta numbering.[/dim]")

def fetch_sutta(sutta_id, lang="en", author=None):
    """Fetch sutta data from SuttaCentral API."""
    sutta_id = sutta_id.lower().strip()
    info_url = f"https://suttacentral.net/api/suttas/{sutta_id}"
    
    try:
        response = requests.get(info_url)
        if response.status_code == 404:
            console.print(f"[red]Error: Sutta ID '{sutta_id}' not found.[/red]")
            console.print("[yellow]Use --ranges to see valid IDs and numbering.[/yellow]")
            return
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        console.print(f"[red]Error fetching sutta info: {e}[/red]")
        return

    # Find the translation
    translations = data.get("translations", [])
    translation = None
    
    if author:
        translation = next((t for t in translations if t["author_uid"] == author), None)
    else:
        # Priority: requested language, then english
        translation = next((t for t in translations if t["lang"] == lang), None)
        if not translation and lang != "en":
            translation = next((t for t in translations if t["lang"] == "en"), None)

    if not translation:
        available_langs = list(set([t["lang"] for t in translations]))
        console.print(f"[yellow]No translation found for {sutta_id} in {lang}.[/yellow]")
        console.print(f"Available languages: {', '.join(available_langs)}")
        return

    author_uid = translation["author_uid"]
    content_url = f"https://suttacentral.net/api/suttas/{sutta_id}/{author_uid}?lang={lang}"
    
    try:
        content_res = requests.get(content_url)
        content_res.raise_for_status()
        sutta_data = content_res.json()
    except Exception as e:
        console.print(f"[red]Error fetching content: {e}[/red]")
        return

    display_sutta(sutta_data, lang)

def display_sutta(data, lang):
    """Format and display the sutta using Rich."""
    root_title = data.get("root_text", {}).get("title", "Untitled")
    trans_title = data.get("translation", {}).get("title", "Untitled")
    author = data.get("translation", {}).get("author", "Unknown")

    console.print("\n")
    console.print(Panel(
        Text.assemble(
            (f"{trans_title}\n", "bold cyan"),
            (f"({root_title})\n", "italic"),
            (f"Translated by {author}", "dim")
        ),
        title=f"SuttaCentral - {data.get('uid', '').upper()}",
        expand=False,
        border_style="bright_blue"
    ))

    table = Table(show_header=True, header_style="bold magenta", box=None, padding=(0, 2))
    table.add_column("Pali (Root)", style="dim", width=50)
    table.add_column(f"Translation ({lang.upper()})", width=60)

    root_segments = data.get("root_text", {}).get("text", {})
    trans_segments = data.get("translation", {}).get("text", {})

    for key in trans_segments:
        pali = root_segments.get(key, "")
        eng = trans_segments.get(key, "")
        if pali or eng:
            table.add_row(pali, eng)

    console.print(table)
    console.print(f"\n[dim]Source: suttacentral.net/{data.get('uid', '')}[/dim]\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Read SuttaCentral suttas in the terminal.")
    parser.add_argument("id", nargs="?", help="Sutta ID (e.g., dn1, mn10, sn56.11)")
    parser.add_argument("--lang", default="en", help="Language code (en, hi, etc.)")
    parser.add_argument("--author", help="Specific author UID (e.g., sujato, bodhi)")
    parser.add_argument("--ranges", action="store_true", help="Show numbering ranges for collections")

    args = parser.parse_args()
    
    if args.ranges:
        show_ranges()
    elif args.id:
        fetch_sutta(args.id, args.lang, args.author)
    else:
        parser.print_help()
        console.print("\n[yellow]Hint: Try 'python sutta-read.py --ranges' to see available collections.[/yellow]")
