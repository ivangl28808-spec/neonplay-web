# Genera las páginas de los tests desde match/plantilla.html:  python3 match/paginas.py
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS = {
    'match': dict(TITULO='¿Hacemos match?', NOMBRE_HTML='¿Hacemos <b>match</b>?', ICONO='💞',
                  CORTO='Test de compatibilidad en pareja', GANCHO='¿Qué tanto coinciden?',
                  DESC='Contesta 10 preguntas, mándale el enlace a tu pareja y descubran qué tanto coinciden. Gratis y sin registrarse.',
                  OG='Te retaron a ver qué tanto coinciden. Contesta 10 preguntas y descúbranlo.',
                  INICIO_SUB='Contesta 10 preguntas, mándale el enlace a esa persona y, cuando conteste, los dos ven qué tanto coinciden.',
                  LOCAL_1='Persona 1', LOCAL_2='Persona 2'),
    'conoces': dict(TITULO='¿Qué tanto me conoces?', NOMBRE_HTML='¿Qué tanto me <b>conoces</b>?', ICONO='🔍',
                    CORTO='Para pareja, amigos o familia', GANCHO='¿De verdad te conocen?',
                    DESC='Contesta 10 preguntas sobre ti, manda el enlace y descubre qué tanto te conocen. Gratis y sin registrarse.',
                    OG='¿Qué tanto sabes de su vida? Adivina sus respuestas y descúbrelo.',
                    INICIO_SUB='Contesta 10 preguntas sobre ti y manda el enlace: la otra persona tiene que adivinar qué contestaste.',
                    LOCAL_1='Quien contesta sobre sí', LOCAL_2='Quien adivina'),
    'amigos': dict(TITULO='¿Somos mejores amigos?', NOMBRE_HTML='¿Somos mejores <b>amigos</b>?', ICONO='👯',
                   CORTO='Test de amistad', GANCHO='¿Qué tan compas son?',
                   DESC='Contesta 10 preguntas, mándale el enlace a tu mejor amigo o amiga y descubran qué tanto coinciden. Gratis.',
                   OG='¿De verdad son mejores amigos? Contesta 10 preguntas y descúbranlo.',
                   INICIO_SUB='Contesta 10 preguntas, mándale el enlace a tu amigo o amiga y, cuando conteste, los dos ven qué tanto coinciden.',
                   LOCAL_1='Amigo 1', LOCAL_2='Amigo 2'),
}
plantilla = (RAIZ / 'match' / 'plantilla.html').read_text(encoding='utf-8')
for tipo, datos in PAGINAS.items():
    html = plantilla.replace('{{TIPO}}', tipo)
    for k, v in datos.items():
        html = html.replace('{{' + k + '}}', v)
    assert '{{' not in html, tipo
    destino = RAIZ / tipo / 'index.html'
    destino.parent.mkdir(exist_ok=True)
    destino.write_text(html, encoding='utf-8')
    print('ok', destino.relative_to(RAIZ))
