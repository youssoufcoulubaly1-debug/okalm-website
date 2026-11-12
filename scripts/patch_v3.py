import re
def sub(path, pairs):
    s=open(path,encoding='utf-8').read()
    for a,b in pairs:
        assert a in s,(path,a[:60]); s=s.replace(a,b,1)
    open(path,'w',encoding='utf-8').write(s)
sub('public/css/accueil-v2.css',[
 ('.g-cats span{background:#B0451A;color:#fff;','.g-cats span{background:#fff;color:#0C5136;'),
 ('.g-cat{background:#B0451A;color:#fff;','.g-cat{background:#0C5136;color:#fff;'),
 ('.sec--terra{background:#FFE3D3}','.sec--terra{background:#F7F1E8}'),
 ('.mini4 .px b{color:var(--terra)}\n',''),
 ('.mini4 .px u{text-decoration:none;font-weight:800;color:var(--terra);white-space:nowrap}','.mini4 .px u{text-decoration:none;font-weight:800;color:#1C1712;white-space:nowrap}'),
 ('.c-eco small{display:block;font-size:12px;color:#047857}.c-eco b{display:block;font-size:26px;font-weight:900;color:#065F46;white-space:nowrap}','.c-eco small{display:block;font-size:12px;color:#047857}.c-eco b{display:block;font-size:22px;font-weight:900;color:#065F46;white-space:nowrap}'),
])
sub('public/js/accueil-v2.js',[
 ("""'<div class="c-eco"><small>Avec le suivi commun, vous économisez</small><b>' + fmt(s.totalFcfa - r.totalFcfa) + "</b></div></div>" +""",
  """'<div class="c-eco"><small>Avec le suivi commun</small><b>Vous économisez</b><b>' + fmt(s.totalFcfa - r.totalFcfa) + "</b></div></div>" +"""),
 ('(ouv.length ? "Bientôt disponibles" : "Ouverture prochaine")','"Très bientôt disponibles"'),
])
sub('scripts/main_v2.html',[
 ("{{ic:tag:#B0451A}}","{{ic:tag:#B26A00}}"),
 ("{{ic:wave:#B26A00}}</span><b>Paiement sécurisé","{{ic:wave:#B0451A}}</span><b>Paiement sécurisé"),
 ("""<p class="zones__more">Votre commune n'est pas dans la liste ? Dites-le-nous.
      <a href="https://wa.me/2250509185121?text=Bonjour%2C%20pr%C3%A9venez-moi%20quand%20ma%20commune%20ouvre">Prévenez-moi sur WhatsApp</a>.</p>""",
  """<p class="zones__more">Votre commune n'est pas encore ouverte ? Inscrivez-vous sur la liste d'attente dans l'application. Nous vous prévenons dès son ouverture.
      <a href="/get-app-okalm/">Télécharger l'application</a>.</p>"""),
])
print('ok')
