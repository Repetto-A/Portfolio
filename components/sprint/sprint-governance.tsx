import { SprintSection, SprintHeading, SprintProse } from "./sprint-section"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"
import { Shield, Lock, KeyRound, ClipboardCheck, BarChart3, Eye, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Shield,
    title: "Gobernanza de IA",
    body: "Políticas de uso, criterios y límites.",
  },
  {
    icon: Lock,
    title: "Privacidad y anonimización",
    body: "Cómo trabajar con datos sensibles sin exponer información innecesaria.",
  },
  {
    icon: KeyRound,
    title: "Accesos y permisos",
    body: "Quién puede usar qué herramienta, en qué casos y con qué datos.",
  },
  {
    icon: BarChart3,
    title: "Costos bajo control",
    body: "Qué conviene pagar y cómo bajar el gasto innecesario en suscripciones.",
  },
  {
    icon: Eye,
    title: "Visibilidad de uso",
    body: "Trazabilidad de qué hace tu equipo con las licencias de IA que pagás.",
  },
  {
    icon: ClipboardCheck,
    title: "Validación de outputs",
    body: "Revisión humana, riesgos y criterios de calidad.",
  },
]

const GOVERNANCE_DELIVERABLES = [
  "Política de uso de IA escrita para tu contexto",
  "Matriz de permisos por rol y por caso de uso",
  "Criterios para validar outputs antes de producción",
  "Clasificación de cada prototipo: qué camino seguir desde PoC (proof of concept) a producción",
  "Recomendación de herramientas, costos y medición de uso",
]

export function SprintGovernance() {
  return (
    <SprintSection id={SPRINT_ANCHORS.governance} label={SPRINT_SECTION_LABELS.governance}>
      <SprintHeading>Tu equipo ya usa IA. La pregunta es si lo hace de forma segura.</SprintHeading>
      <SprintProse lead>
        <p>
          El objetivo no es que cada persona use cualquier herramienta de IA como pueda. El objetivo
          es que la empresa tenga criterios claros sobre qué se puede usar, con qué datos, en qué
          casos, bajo qué permisos y con qué trazabilidad.
        </p>
        <p>
          El uso informal ya pasa en casi todas las empresas, aunque no siempre se vea. La solución
          no es frenar la adopción: es dejar de improvisar y poner reglas que todos entienden.
        </p>
      </SprintProse>

      <p className="mt-12 font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        Qué cubre el marco
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 bg-card p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-[var(--sprint-accent)]" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold leading-snug">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl border border-border">
        <div className="grid lg:grid-cols-2">
          <div className="bg-muted/25 p-6 sm:p-8 lg:order-first">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--sprint-accent)] uppercase">
              Ejemplo en la práctica
            </span>
            <ul className="mt-5 space-y-4">
              {[
                {
                  role: "Atención al cliente",
                  text: "arma un asistente sobre la documentación interna y valida cada respuesta antes de usarla con clientes.",
                },
                {
                  role: "RR.HH.",
                  text: "trabaja datos de empleados solo en herramientas aprobadas, nunca en ChatGPT.",
                },
                {
                  role: "Dirección",
                  text: "ve qué usa cada área y cuánto cuesta, sin sorpresas en la factura a fin de mes.",
                },
              ].map(({ role, text }) => (
                <li key={role} className="border-l-2 border-[var(--sprint-accent)]/40 pl-4">
                  <span className="text-sm font-semibold">{role}</span>{" "}
                  <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
            <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--sprint-accent)]">
              Qué queda documentado
            </h3>
            <ul className="mt-5 space-y-3.5">
              {GOVERNANCE_DELIVERABLES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-[var(--sprint-accent)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-card px-6 py-5 sm:px-8">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--sprint-accent)] uppercase">
            Para equipos técnicos
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cuando hay perfiles de ingeniería, el sprint puede derivar en arquitectura interna: IA
            local cuando tiene sentido, conectores MCP para exponer funciones entre áreas y un
            roadmap que define qué prototipo va a producción, cuál necesita más pruebas y cuál se
            frena. Sobre esa base configuro permisos granulares, registros de actividad, gateways,
            feature flags y medidores de uso y costo. Cuando aplica, la memoria de los asistentes
            corre sobre knowledge graphs que reducen hasta ~120× el consumo de tokens.
          </p>
        </div>
      </div>
    </SprintSection>
  )
}
