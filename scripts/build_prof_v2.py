import re
exec(open('scripts/build_accueil_v2.py',encoding='utf-8').read().split("main=open")[0])
main=open('scripts/main_prof.html',encoding='utf-8').read()
main=re.sub(r'\{\{ic:(\w+):(#[0-9A-Fa-f]+)\}\}',ic,main)
s=open('public/devenir-prof.html',encoding='utf-8').read()
i=s.index('<main id="main">'); j=s.index('</main>')+len('</main>')
s=s[:i]+main.strip()+s[j:]
if 'accueil-v2.css' not in s:
    s=s.replace('<link rel="stylesheet" href="/css/prof-gpt11.css" />','<link rel="stylesheet" href="/css/prof-gpt11.css" />\n  <link rel="stylesheet" href="/css/accueil-v2.css" />')
s=s.replace('<title>Devenir Kalmeur — enseigner près de chez vous avec OKALM CI</title>','<title>Devenir Kalmeur — enseigner près de chez vous avec OKALM CI</title>')
open('public/devenir-prof.html','w',encoding='utf-8').write(s)
# portée des variables
c=open('public/css/accueil-v2.css',encoding='utf-8').read()
c=c.replace('body.page-accueil-lot5{--terra','body.page-accueil-lot5,body.theme-kalmeur{--terra',1)
open('public/css/accueil-v2.css','w',encoding='utf-8').write(c)
print('ok')
