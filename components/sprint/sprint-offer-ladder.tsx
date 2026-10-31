import { SprintSection } from "./sprint-section"
import { SprintOfferLadderInner } from "./offer-ladder-body"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintOfferLadder() {
  return (
    <SprintSection id={SPRINT_ANCHORS.offer} label={SPRINT_SECTION_LABELS.offer} tint>
      <SprintOfferLadderInner />
    </SprintSection>
  )
}
