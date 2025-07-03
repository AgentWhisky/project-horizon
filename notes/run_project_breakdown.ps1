$files = git ls-files --cached --others --exclude-standard
$files | Sort-Object | ForEach-Object {
    $depth = ($_ -split '[\\/]').Count - 1
    ('  ' * $depth) + ($_ -split '[\\/]' | Select-Object -Last 1)
} | Out-File -Encoding UTF8 project-structure.txt
