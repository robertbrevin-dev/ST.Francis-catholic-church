from pathlib import Path

root = Path('src')
count = 0
for path in root.rglob('*'):
    if path.suffix not in {'.ts', '.tsx', '.css'}:
        continue
    text = path.read_text(encoding='utf-8')
    out = []
    i = 0
    n = len(text)
    state = 'code'
    quote = None
    escape = False
    while i < n:
        ch = text[i]
        nxt = text[i+1] if i+1 < n else ''
        if state == 'code':
            if ch == '/' and nxt == '*':
                i += 2
                state = 'block_comment'
                continue
            if path.suffix in {'.ts', '.tsx'} and ch == '/' and nxt == '/':
                i += 2
                while i < n and text[i] != '\n':
                    i += 1
                continue
            if ch in {'"', "'", '`'}:
                quote = ch
                out.append(ch)
                i += 1
                state = 'string'
                continue
            out.append(ch)
            i += 1
        elif state == 'string':
            out.append(ch)
            if escape:
                escape = False
                i += 1
                continue
            if ch == '\\':
                escape = True
                i += 1
                continue
            if ch == quote:
                state = 'code'
                quote = None
            i += 1
        elif state == 'block_comment':
            if ch == '*' and nxt == '/':
                i += 2
                state = 'code'
            else:
                i += 1
    new_text = ''.join(out)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        count += 1
print(f'Processed {count} files')
