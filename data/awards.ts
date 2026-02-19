export type PressLink = {
  id: string
  type: "article" | "video"
  title: string
  source: string
  url: string
}

export type PressData = {
  enabled: boolean
  links: PressLink[]
}

export type LocalizedString = {
  en: string
  es: string
}

export type Award = {
  id: string
  order: number
  visible: boolean
  title: LocalizedString
  description: LocalizedString
  year: string
  event: string
  projectId: string
  projectName: string
  category: string
  shortSummary: LocalizedString
  proofUrl: string | null
  tags: string[]
  icon: "award" | "trophy" | "lightbulb" | "globe"
  color: string
  borderColor: string
  badgeColor: string
  press?: PressData
  caseStudy: {
    summary: string
    technicalDetails: string[]
    repoUrl?: string
    demoUrl?: string
    readmeExcerpt?: string
  }
}

export const awards: Award[] = [
  {
    id: "eth-argentina-powerhouse-2025",
    order: 1,
    visible: true,
    title: {
      en: "Roxium DAO Ops",
      es: "Roxium DAO Ops",
    },
    description: {
      en: "We built a system that brings transparency and reduces the administrative burden of managing DAOs by letting them track proposals, see where bottlenecks are, and study internal trends to detect patterns and intervene fast before damage spreads.\nWe were awarded Best PowerHouse App for the technical excellence we delivered under 48 hours of build time.",
      es: "Desarrollamos un sistema que brinda transparencia y reduce la carga administrativa que conlleva gestionar DAOs al permitirles llevar control de sus proposals, conocer en qué estado están, dónde está el cuello de botella y hasta les permite estudiar tendencias internas para detección de patrones y así lograr una rápida intervención que mitigue los daños.\nFuimos galardonados con el premio a la mejor aplicación del ecosistema PowerHouse por la excelencia técnica con la que llevamos a cabo el proyecto y por los altos estándares de resolución para el escaso tiempo de menos de 48hs que tuvimos.",
    },
    year: "2025 ETH Argentina",
    event: "ETH Argentina",
    projectId: "roxium-dao-ops",
    projectName: "Roxium DAO Ops",
    category: "DAOs / Web3",
    shortSummary: {
      en: "Recognized for best PowerHouse implementation showcasing exceptional technical execution and rapid prototyping in blockchain technology.",
      es: "Reconocido por la mejor implementacion de PowerHouse, demostrando ejecucion tecnica excepcional y prototipado rapido en tecnologia blockchain.",
    },
    proofUrl: null,
    tags: ["TypeScript", "Next.js", "React", "PowerHouse", "Vetra", "LangChain", "GraphQL", "Tailwind CSS"],
    icon: "award",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    caseStudy: {
      summary:
        "Awarded 1st Prize for Powerhouse Award at ETH Argentina 2025, recognizing outstanding innovation and technical excellence in implementing PowerHouse infrastructure for DAO operations management.",
      technicalDetails: [
        "Best PowerHouse implementation among all submissions",
        "Innovative architecture for decentralized DAO operations management",
        "Rapid prototyping and deployment in 48-hour timeframe",
        "Clean code architecture with comprehensive testing suite",
        "Production-ready smart contract design with security best practices",
      ],
      repoUrl: "https://github.com/Repetto-A/Roxium-DAO-Ops",
    },
  },
  {
    id: "nasa-spaceapps-2025",
    order: 2,
    visible: true,
    title: {
      en: "FarmHero",
      es: "FarmHero",
    },
    description: {
      en: "Educational simulator using real NASA and CONAE satellite data to teach kids sustainable agriculture, resource management, and strategic planning in the agricultural sector in a realistic and precise way.\nWe won regionally and reached the global nomination thanks to the maturity our project had at submission time. We had under 30 hours to build it and still managed to design and develop a functional simulator with assets created from scratch, while being at 1/3 the team size of most competing teams.",
      es: "Simulador educativo que utiliza datos satelitales reales de la NASA y CONAE para lograr (de una manera fehaciente y precisa) enseñar a chicos sobre agricultura sostenible, cómo realizar una correcta gestión de recursos, y la importancia del planeamiento estratégico en el sector agrícola.\nFuimos ganadores regionales y alcanzamos la nominación global por el gran impacto y el nivel de maduración que tuvo nuestro proyecto al momento de entregarlo. Contamos con menos de 30hs para realizarlo y aún así conseguimos diseñar y desarrollar un simulador funcional, con assets creados por nosotros desde 0 y en gran desventaja ya que nuestro equipo era de 1/3 la cantidad de integrantes que tenían la mayoría de equipos.",
    },
    year: "2025 NASA Global Nominee",
    event: "NASA Space Apps Challenge",
    projectId: "farmhero",
    projectName: "FarmHero",
    category: "Game / AgTech",
    shortSummary: {
      en: "Educational agricultural simulator using real NASA and CONAE satellite data to teach sustainable farming and resource management.",
      es: "Simulador agricola educativo que usa datos satelitales reales de NASA y CONAE para ensenar agricultura sostenible y gestion de recursos.",
    },
    proofUrl: null,
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NASA & CONAE Data"],
    icon: "lightbulb",
    color: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/30",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    press: {
      enabled: true,
      links: [
        {
          id: "telefe-article",
          type: "article",
          title: "Farm Hero — un simulador educativo que usa datos de la NASA",
          source: "Telefe (Rosario)",
          url: "https://rosario.mitelefe.com/rosario-y-la-region/farm-hero-un-simulador-educativo-que-usa-datos-de-la-nasa-para-salvar-tierras-degradadas-gano-el-space-apps-rosario-pid2107290",
        },
        {
          id: "lacapital-article",
          type: "article",
          title: "Estudian la UTN: FarmHero usa datos satelitales",
          source: "La Capital",
          url: "https://www.lacapital.com.ar/la-ciudad/estudian-la-utn-crearon-un-videojuego-que-usa-datos-satelitales-y-seran-evaluados-la-nasa-n10226894.html",
        },
        {
          id: "ecobiz-article",
          type: "article",
          title: "Crean un videojuego sobre agricultura sostenible",
          source: "Ecobiz",
          url: "https://ecobiz.com.ar/nota/1165-Crean-un-videojuego-sobre-agricultura-sostenible-y-ganan-competencia-de-la-Nasa",
        },
        {
          id: "rosarionet-article",
          type: "article",
          title: "Gano el NASA Space Apps Rosario: simulador educativo",
          source: "Rosarionet",
          url: "https://rosarionet.com.ar/contenido/8439/gano-el-nasa-space-apps-rosario-un-simulador-educativo-para-salvar-tierras-degra",
        },
        {
          id: "rts-article",
          type: "article",
          title: "Farm Hero — un simulador rosarino compite en la NASA",
          source: "RTS Medios",
          url: "https://rtsmedios.com.ar/farm-hero-un-simulador-rosarino-compite-en-la-nasa/",
        },
        {
          id: "conclusion-article",
          type: "article",
          title: "Space Apps: el hackaton donde Rosario es protagonista",
          source: "Conclusion",
          url: "https://www.conclusion.com.ar/info-general/space-apps-el-prestigioso-hackaton-de-la-nasa-en-donde-rosario-es-protagonista/11/2020/",
        },
        {
          id: "elciudadano-article",
          type: "article",
          title:
            "La decima edicion de la NASA Space Apps Rosario tuvo como ganador un simulador educativo",
          source: "El Ciudadano",
          url: "https://elciudadanoweb.com/la-decima-edicion-de-la-nasa-space-apps-rosario-tuvo-como-ganador-un-simulador-educativo-para-salvar-tierras-degradadas/",
        },
        {
          id: "socialday-article",
          type: "article",
          title: "Es parejense y gano la decima edicion del NASA Space Apps",
          source: "SocialDay",
          url: "https://socialday.com.ar/es-parejense-y-gano-la-decima-edicion-del-nasa-space-apps-rosario/",
        },
        {
          id: "diariocanada-article",
          type: "article",
          title: "Un joven de Las Parejas triunfa en NASA Space Apps",
          source: "Diario Canada",
          url: "https://xn--diariocaada-8db.com/index.php/general/73390-un-joven-de-las-parejas-triunfa-en-el-nasa-space-apps-challenge-rosario",
        },
        {
          id: "radiofonica-article",
          type: "article",
          title: "Dos estudiantes de la UTN crearon un proyecto y seran evaluados por la NASA",
          source: "Radiofonica",
          url: "https://radiofonica.com/dos-estudiantes-de-la-utn-crearon-un-proyecto-y-seran-evaluados-por-la-nasa/",
        },
        {
          id: "fmchalet-article",
          type: "article",
          title: "Estudian en la UTN y crearon un videojuego... seran evaluados por la NASA",
          source: "FM Chalet",
          url: "https://fmchalet.org/estudian-en-la-utn-de-rosario-y-crearon-un-videojuego-que-usa-datos-satelitales-seran-evaluados-por-la-nasa/",
        },
        {
          id: "telefe-video",
          type: "video",
          title: "Telefe — Videonota",
          source: "YouTube (Telefe)",
          url: "https://www.youtube.com/watch?v=AKmk02azm70",
        },
        {
          id: "rts-video",
          type: "video",
          title: "RTS — Videonota",
          source: "YouTube (RTS)",
          url: "https://www.youtube.com/watch?v=RYA8Xdl2PdY",
        },
        {
          id: "rosario-video",
          type: "video",
          title: "Rosario La Ciudad Media — Streaming",
          source: "YouTube",
          url: "https://youtu.be/D8zE0SKV-QI",
        },
        {
          id: "wox-streaming",
          type: "video",
          title: "WOX Streaming - Mentes brillantes",
          source: "YouTube (WOX)",
          url: "https://youtu.be/OmlAqSCBfN0",
        },
        {
          id: "laoficina-podcast",
          type: "video",
          title: "La Oficina Podcast - Mentes que transforman",
          source: "YouTube (La Oficina)",
          url: "https://www.youtube.com/watch?v=RoDSLxLI_xM",
        },
      ],
    },
    caseStudy: {
      summary:
        "FarmHero is an educational simulator that uses real NASA and CONAE satellite data to teach resource management and sustainable agriculture decisions. Players restore degraded land by managing limited capital and choosing interventions whose short and long-term effects the game simulates.",
      technicalDetails: [
        "Simulation of agricultural interventions with short and long-term effects",
        "Real data ingestion and normalization from NASA and CONAE satellite layers",
        "Educational UI with step-by-step guidance widgets",
        "Agricultural rules and heuristics engine (extensible with ML)",
        "Simulation of climatic events (droughts, heat waves, floods) with probabilistic impacts",
        "Prototype developed in 48 hours with continuous post-hackathon iteration",
      ],
      repoUrl: "https://github.com/Repetto-A/NASA-FarmHero",
      demoUrl: "https://nasa-farm-hero.vercel.app/",
    },
  },
  {
    id: "eth-global-filecoin-2025",
    order: 3,
    visible: true,
    title: {
      en: "Zorrito Finance",
      es: "Zorrito Finance",
    },
    description: {
      en: "No-loss lottery that gamifies saving to teach kids the impact of good financial habits while they have fun. Users create and care for their own personalized fox, feeding it daily to participate in a lottery funded by the yield generated from user savings. Nobody ever loses capital and everyone can withdraw whenever they want. We verify user age using Self Protocol's ZK and use Filecoin as our database.\nAwarded 2nd Best dApp by Filecoin.",
      es: "Lotería sin pérdida que busca gamificar el acto de ahorrar para enseñarle a los más chicos el impacto que tiene hacerlo y lograr que estos se diviertan mientras desarrollan buenos hábitos financieros. Los usuarios crean y cuidan de su propio zorro personalizado, al cual deben alimentar diariamente para así poder participar de la lotería que hacemos con el yield generado por los ahorros de los usuarios. Ningún usuario pierde nunca su capital y todos son libres de retirar su dinero cuando quieran. Verificamos la edad de los usuarios con el ZK de Self Protocol e hicimos uso de Filecoin como base de datos.\nFuimos premiados por Filecoin por el premio a la 2da mejor aplicación descentralizada (dApp).",
    },
    year: "2025 ETH Global",
    event: "ETH Global",
    projectId: "zorrito-finance",
    projectName: "Zorrito Finance",
    category: "DeFi / Web3",
    shortSummary: {
      en: "Gamified DeFi savings platform with no-loss lottery model and Self Protocol age verification.",
      es: "Plataforma DeFi gamificada de ahorro con modelo de loteria sin perdida y verificacion de edad con Self Protocol.",
    },
    proofUrl: null,
    tags: ["Solidity", "Filecoin", "IPFS", "Self Protocol", "Next.js", "React", "TypeScript", "AI SDK", "Tailwind CSS"],
    icon: "trophy",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    caseStudy: {
      summary:
        "Zorrito Finance is a gamified DeFi savings platform that combines a no-loss lottery model with Self Protocol age verification to create an engaging, secure savings experience. Users deposit funds into pooled savings contracts, earning interest while participating in periodic lottery drawings.",
      readmeExcerpt:
        "Zorrito Finance is a gamified DeFi savings platform with a no-loss lottery model and Self Protocol age verification. Users deposit assets into smart contracts that generate yield through DeFi protocols. Periodic lottery drawings award bonus prizes to lucky winners, while all participants retain their principal and earned interest.",
      technicalDetails: [
        "No-loss lottery mechanism: participants never lose principal deposits",
        "Yield generation through integration with established DeFi protocols (Aave, Compound)",
        "Self Protocol integration for decentralized age verification and KYC compliance",
        "Filecoin/IPFS storage for transparent lottery history and user data",
        "Smart contract architecture with upgradeable proxies for future improvements",
        "Automated prize distribution using Chainlink VRF for verifiable randomness",
        "Multi-chain support (Ethereum, Polygon, Filecoin) for accessibility",
      ],
      repoUrl: "https://github.com/Repetto-A/Zorrito-Finance",
      demoUrl: "https://zorrito-finance.vercel.app",
    },
  },
]

/** Returns only visible awards sorted by `order` ascending. */
export function getVisibleAwards(): Award[] {
  return awards.filter((a) => a.visible).sort((x, y) => (x.order ?? 999) - (y.order ?? 999))
}

/** Resolves a localized string to the current locale with fallback to English. */
export function localize(value: LocalizedString, locale: string): string {
  return (locale === "es" ? value.es : value.en) || value.en
}
