# Propuesta de mejoras para repetto-a.com

Documento de trabajo para Alejandro. Marca qué cubre ya este PR (draft #7) y qué falta o necesita datos.

## Qué cubre ya este PR

- Identidad: Software Engineer enfocado en IA, estudiante avanzado de Ingeniería en Sistemas.
- Hero en una línea: "Ayudo a empresas y builders a pasar de hablar de IA a ejecutarla".
- Nexa con +50 comunidades y +300.000 builders, link a https://nexa.builders.
- BOTR visible en hero (CTA), about (bloque propio), contacto y footer. Link: https://www.buildersofftherecord.com.
- Docencia en la Diplomatura en IA Aplicada al Ejercicio Profesional de UCEL (bloque propio en about).
- Consultor/trainer en CRIA, adopción de IA para equipos técnicos y ejecutivos (bloque propio en about).
- SpaceXAI Ambassador, SupaSquad, Rosario Tech Week, Shippear, NASA Space Apps Rosario, Argentina Space (Salta, 11 al 13 de noviembre de 2026).
- Premios verificados en copy y JSON-LD: NASA Space Apps / Farm Hero, Vercel Hackathon 2026 2do + Nvidia, Platanus Hack 2026 favorito del jurado, ETHGlobal.
- SEO: title, description, OG, Twitter, JSON-LD Person (jobTitle, description, worksFor, affiliation, award, sameAs).
- Proyectos nuevos con copy sacada del README o de la descripción del repo, más repo y demo solo si existían:
  - Consentinel
  - Harness & Loop Engineering Academy
  - Clippy
  - Smart Sales AI (agents_orchestrator)
  - NovaBank
  - Prognosia Health
- Se mantienen las 7 cards que ya estaban (FarmHero, Seismic, Brain Tumor, Zorrito, Roxium, Real Estate, Cotibot).

## Home: estructura actual vs propuesta

Hoy la home es: nav, hero, about, skills, awards (3 cards), projects (grid), contact, footer.

Propuesta de orden, sin rediseñar el lenguaje visual:

1. Hero (una línea + CTAs: proyectos, CV, BOTR).
2. Roles (Nexa, BOTR, UCEL, CRIA) como están ahora, más visibles.
3. Proyectos destacados (máximo 6-9 en home, el resto en /projects).
4. Premios (las 3 cards actuales + Vercel 2026 y Platanus 2026 cuando haya nombre de proyecto, stack y prueba).
5. Charlas / speaker (sección corta que apunte a /charlas).
6. Contacto.

Pendiente: recortar la grilla de 13 proyectos en home. Ahora se listan todos para no esconder trabajo; conviene un flag `featured` cuando Alejandro elija el corte.

## Contenido que falta (pendiente o sin fuente pública)

No se publicó nada de esto porque no hay repo público bajo github.com/Repetto-A, o el README no alcanza:

| Item | Por qué no está | Qué hace falta |
| --- | --- | --- |
| Nexa como card de producto | No hay repo público `Repetto-A/Nexa` | Repo o copy oficial, screenshots, demo |
| Peritia, peritia-distill, peritia-capture | No hay repos públicos con esos nombres | URL de repo, README, demo |
| grok-bot-arena | No hay repo público | URL de repo, README, demo |
| ig-discovery-pipeline | No hay repo público | URL de repo, README, demo |
| agromaq-landing | No hay repo público; Cotibot sí cubre el sistema de cotización Agromaq | Repo de landing o URL en producción |
| Cards de Vercel Hackathon 2026 y Platanus Hack 2026 | El copy menciona el premio; no hay nombre de proyecto ni stack verificados para una card extra (Consentinel es el kernel de permisos, no se afirma que sea el ganador de Platanus) | Nombre del proyecto, repo, demo, una frase de Alejandro |
| Fotos de los 6 proyectos nuevos | Los READMEs no traen assets de portfolio | 1-3 capturas por proyecto |
| UTN | No estaba en los datos verificados de esta ronda | Confirmar si va como filiación |
| URLs de UCEL, CRIA, SpaceXAI, X/Twitter | No hay URL en el repo, solo el handle `@repetto_a` | Links oficiales |
| Disponibilidad (consultoría / freelance / full-time) | El bloque ya existía; no hay dato nuevo | Confirmar si sigue vigente |

Repos públicos revisados y no agregados a propósito:

- branded-content-platform: el README es el template "Img Gen Playground" de Vercel Labs; no hay copy propia suficiente.
- AIAdCreator: README default de Next/v0, sin descripción de producto.
- ML-FaceRecognizer (Somos Huella): README fuerte, pero el propio repo lo marca en planificación + migración. Candidato a card cuando Alejandro confirme estado y que somoshuella.org se puede listar.
- colinet-trotta-simulator: el homepage apunta al mismo demo que FarmHero.
- Catalogo-Academico-MDW, LinkedIn-automation, ImageCreationPlayground, Bridgify, VirgIA: o son TP/forks/sin README de producto, o no son el corte de "destacados".

## Página Charlas / speaker

No se implementa en este PR. Faltan datos de Alejandro.

Estructura propuesta (`/charlas` o sección `#charlas` en home):

1. Intro de una frase (qué tipo de charlas da: adopción de IA, SDD, comunidades).
2. Próxima fecha (si hay).
3. Lista de charlas pasadas: fecha, evento, ciudad, título, formato (keynote / taller / panel), link a slides o video, foto.
4. Temas en los que puede hablar (lista corta, escrita por Alejandro).
5. CTA de invitación a speaker (mail o form).

Datos que tiene que mandar Alejandro para cada charla:

- Fecha (día, mes, año)
- Nombre del evento y organizador
- Ciudad / país o si fue online
- Título de la charla
- Abstract de 2-4 líneas
- Formato y duración
- Audiencia (devs, ejecutivos, mix)
- Link a slides (el repo harness-loop-academy ya tiene decks en Vercel: https://charla-ia-alejandrorepetto.vercel.app, pero no sabemos qué fecha/evento corresponde a cada deck)
- Link a video o nota de prensa
- Foto horizontal del escenario o del speaker (archivo, no screenshot de LinkedIn)
- Idioma (es / en)
- Si se puede republicar el material

Sin ese listado no se arma la página: inventar fechas o nombres de eventos rompe la regla de este trabajo.

Candidato a seed, solo si Alejandro lo confirma: el deploy de harness-loop-academy como "material de capacitación", no como charla fechada.

## SEO

Cubierto en el PR: title, description, OG es_AR, Twitter, JSON-LD Person, sameAs (GitHub, LinkedIn, Nexa, BOTR).

Pendiente:

- `html lang` sigue en `en` y el i18n default también. Si el sitio es rioplatense, conviene `es` por default y `hreflang` es/en.
- Sitemap hoy solo lista la home. Debería listar `/projects/[id]` y, cuando exista, `/charlas`.
- OG image estática `/og-image.png` no refleja la identidad 2026. Regenerarla.
- JSON-LD de cada proyecto nuevo (el helper `generateProjectSchema` ya existe en páginas de proyecto).
- Pedir a Alejandro una bio de 155 caracteres si quiere una description distinta a la actual.

## Diseño

Este PR no cambia el sistema visual (tipo, color, cards, dark/light).

Pendiente, si Alejandro quiere una pasada de diseño:

- Fotos reales de los proyectos nuevos (hoy las cards nuevas van sin thumbnail).
- Foto de perfil (sigue el placeholder).
- Recorte de skills: la lista es larga y no comunica roles (docencia, comunidades, agentes).
- Home más corta: featured + "ver todos".
- Página /charlas con grilla de eventos, no un CV en prosa.
- BOTR podría tener un embed o un episodio destacado; hace falta URL de episodio y permiso.

## Datos que necesita Alejandro para la próxima ronda

1. Lista de charlas (ver sección anterior).
2. Confirmación de qué 6-9 proyectos van en home.
3. Screenshots de Consentinel, Clippy, NovaBank, Prognosia, Smart Sales AI, Harness Academy.
4. Repos o copy oficial de Nexa producto, Peritia, grok-bot-arena, ig-discovery-pipeline, agromaq-landing.
5. Si Consentinel es el proyecto de Platanus Hack 2026 favorito del jurado (el README lo describe como kernel de permisos / Platanus, no afirma el premio).
6. URLs oficiales de UCEL, CRIA y SpaceXAI.
7. Foto de perfil y, si hay, reel o clip de BOTR para el hero.
8. Si la disponibilidad (consultoría / freelance / full-time) sigue igual.
