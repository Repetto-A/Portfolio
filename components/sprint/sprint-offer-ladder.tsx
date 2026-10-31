import { SprintSection } from "./sprint-section"
import { SprintOfferLadderInner } from "./offer-ladder-body"
import { SprintDirectContact } from "./sprint-direct-contact"
import { SPRINT_ANCHORS, SPRINT_SECTION_LABELS } from "@/lib/sprint/constants"

export function SprintOfferLadder() {
  return (
    <SprintSection id={SPRINT_ANCHORS.offer} label={SPRINT_SECTION_LABELS.offer} tint>
      <SprintOfferLadderInner />
      <div className="mt-10">
        <SprintDirectContact location="offer" hint />
      </div>
    </SprintSection>
  )
}
