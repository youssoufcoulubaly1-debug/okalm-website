import re
I={'cap':'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1 3 3 6 3s6-2 6-3v-5"/>','doc':'<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>','id':'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h4M6 16c1-2 5-2 6 0"/>','swap':'<path d="M4 8h14l-3-3M20 16H6l3 3"/>','shield':'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>','star':'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>','wave':'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18"/>','target':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>','chart':'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>','pin':'<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>','tag':'<path d="M3 12l9-9h9v9l-9 9z"/><circle cx="16.5" cy="7.5" r="1.5"/>'}
def ic(m):
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="%s" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'%(m.group(2),I[m.group(1)])
main=open('scripts/main_v2.html',encoding='utf-8').read()
main=re.sub(r'\{\{ic:(\w+):(#[0-9A-Fa-f]+)\}\}',ic,main)
s=open('public/index.html',encoding='utf-8').read()
i=s.index('<main id="main">'); j=s.index('</main>')+len('</main>')
s=s[:i]+main.strip()+s[j:]
if 'accueil-v2.css' not in s:
    s=s.replace('<link rel="stylesheet" href="/css/accueil-lot5.css" />','<link rel="stylesheet" href="/css/accueil-lot5.css" />\n  <link rel="stylesheet" href="/css/accueil-v2.css" />')
    s=s.replace('family=Inter:wght@400;500;600;700&display=swap','family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700;900&display=swap')
    s=s.replace('<script src="/2026.js" defer></script>','<script src="/2026.js" defer></script>\n<script src="/js/okalm-prix.js" defer></script>\n<script src="/js/accueil-v2.js" defer></script>')
s=s.replace('<a href="#pourquoi">Exemple de rapport</a>','<a href="#pourquoi">Exemple de rapport</a>\n          <a href="#qualite">La qualité</a>')
open('public/index.html','w',encoding='utf-8').write(s)
print('ok',len(s))
