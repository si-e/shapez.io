import { TrackedState } from "../../../core/tracked_state";
import { makeDiv } from "../../../core/utils";
import { T } from "../../../translations";
import { BaseHUDPart } from "../base_hud_part";
import { DynamicDomAttach } from "../dynamic_dom_attach";

import { createLogger } from "../../../core/logging";
import { BeltComponent } from "../../components/belt";
// import { Redprint } from "../../redprint";
const logger = createLogger("hud/parts/redprint_counter");

export class HUDRedprintCounter extends BaseHUDPart {
    createElements(parent) {
        const redprintCostShape = this.root.shapeDefinitionMgr.getShapeFromShortKey(
            this.root.gameMode.getRedprintShapeKey()
        );
        const redprintCostShapeCanvas = redprintCostShape.generateAsCanvas(80);

        this.costDisplayParent = makeDiv(parent, "ingame_HUD_BlueprintPlacer", [], ``);

        makeDiv(this.costDisplayParent, null, ["label"], "清除成本"); // T.ingame.redprintCounter.cost
        const costContainer = makeDiv(this.costDisplayParent, null, ["costContainer"], "");
        this.costDisplayText = makeDiv(costContainer, null, ["costText"], "");
        costContainer.appendChild(redprintCostShapeCanvas);
    }

    initialize() {
        this.domAttach = new DynamicDomAttach(this.root, this.costDisplayParent);
        this.trackedCost = new TrackedState(this.onCostChanged, this);
        this.trackedCanAfford = new TrackedState(this.onCanAffordChanged, this);

        this.lastUpdateTime = 0;
        this.lastUidsString = "";

        this.root.hud.signals.redprintConsumed.add(this.consumeRedprint, this);
    }

    /** @returns {Set<number>} */
    getSelectedUids() {
        return this.root.hud.parts.massSelector.selectedUids;
    }

    consumeRedprint() {
        const uids = this.getSelectedUids();
        if (uids.size === 0 || this.root.gameMode.getHasFreeCopyPaste()) {
            return;
        }
        const cost = this.trackedCost.get();
        const redprintKey = this.root.gameMode.getRedprintShapeKey();
        const redprintNumber = this.root.hubGoals.getShapesStoredByKey(redprintKey);
        this.root.hubGoals.takeShapeByKey(redprintKey, Math.min(cost, redprintNumber));
    }

    update() {
        const uids = this.getSelectedUids();
        if (uids.size === 0 || this.root.gameMode.getHasFreeCopyPaste()) {
            this.domAttach.update(false);
            return;
        }

        // update cost twice per second
        const now = this.root.time.now();
        const currentUidsString = Array.from(uids).toString();
        if (now < this.lastUpdateTime + 1 && this.lastUidsString === currentUidsString) {
            const cost = this.trackedCost.get();
            const canAfford = this.canAfford(cost);
            this.trackedCanAfford.set(canAfford);
            return;
        }
        this.lastUpdateTime = now;
        this.lastUidsString = currentUidsString;

        const cost = this.getCost(uids);
        const canAfford = this.canAfford(cost);
        this.trackedCost.set(cost);
        this.trackedCanAfford.set(canAfford);
        this.domAttach.update(true);
    }

    /**
     * Called when the redprint was changed
     * @param {number} cost
     */
    onCostChanged(cost) {
        this.costDisplayText.innerText = "" + cost;
    }

    /**
     * Called when the redprint is now affordable or not
     * @param {boolean} canAfford
     */
    onCanAffordChanged(canAfford) {
        this.costDisplayParent.classList.toggle("canAfford", canAfford);
    }

    /**
     * Returns the cost of this redprint in shapes
     * @param {Set<number>} uids
     */
    getCost(uids) {
        let totalNumber = 0;
        const beltPathSet = new Set();
        for (const uid of uids) {
            const entity = this.root.entityMgr.findByUid(uid);
            assert(entity, "Entity for redprint not found:" + uid);
            for (const component of Object.values(entity.components)) {
                // make sure only calc each belt path once
                if (component instanceof BeltComponent) {
                    if (beltPathSet.has(component.assignedPath)) {
                        continue;
                    } else {
                        beltPathSet.add(component.assignedPath);
                    }
                }
                const number = component.getShapeItemNumber();
                totalNumber += number;
                // logger.log(component, number);
            }
        }
        // logger.log("number:", totalNumber);

        const cost = totalNumber * 10;
        return cost;
    }

    /**
     * Called when the redprint was changed
     * @param {number} cost
     */
    canAfford(cost) {
        return this.root.hubGoals.getShapesStoredByKey(this.root.gameMode.getRedprintShapeKey()) >= cost;
    }
}
