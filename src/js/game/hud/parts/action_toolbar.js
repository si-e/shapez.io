import { BaseHUDPart } from "../base_hud_part";
import { makeDiv } from "../../../core/utils";
import { DynamicDomAttach } from "../dynamic_dom_attach";
import { cachebust } from "../../../core/cachebust";
import { GameRoot } from "../../root";

export class HUDActionToolbar extends BaseHUDPart {
    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        super(root);
        this.htmlElementId = "ingame_HUD_ActionToolbar";

        this.actions = [];
        this.actionHandles = {};
    }

    /**
     * Creates the elements for the action toolbar.
     * @param {HTMLElement} parent
     */
    createElements(parent) {
        this.element = makeDiv(parent, this.htmlElementId, ["action_toolbar"], "");
        console.log("ActionToolbar element created:", this.element);
    }

    /**
     * Initializes the action toolbar.
     */
    initialize() {
        this.actions.forEach((action) => {
            const button = makeDiv(this.element, null, ["action_button"], "");
            console.log("Created button:", button);
            button.setAttribute("data-id", action.id);
            button.setAttribute("title", action.label);

            const icon = makeDiv(button, null, ["icon"]);
            icon.style.backgroundImage = "url('" + cachebust("res/ui/" + action.icon) + "')";

            this.trackClicks(button, action.action, { clickSound: null });
            this.actionHandles[action.id] = { element: button };
        });
        console.log("Action buttons created.");

        this.domAttach = new DynamicDomAttach(this.root, this.element, {
            timeToKeepSeconds: 0.12,
            attachClass: "visible",
        });
        console.log("DynamicDomAttach initialized:", this.domAttach);
    }

    /**
     * Updates the visibility of the action toolbar.
     */
    update() {
        const visible = this.visibilityCondition();
        // console.log("ActionToolbar visibility:", visible);
        this.domAttach.update(visible);
    }

    /** @returns {boolean} */
    visibilityCondition() {
        abstract;
        return false;
    }

    /**
     * HELPER / Returns if there is a building selected for placement
     * @returns {boolean}
     */
    get buildingPlacementActive() {
        const placer = this.root.hud.parts.buildingPlacer;
        return !this.mapOverviewActive && placer && !!placer.currentMetaBuilding.get();
    }

    /**
     * HELPER / Returns if there is a building selected for placement and
     * it supports the belt planner
     * @returns {boolean}
     */
    get buildingPlacementSupportsBeltPlanner() {
        const placer = this.root.hud.parts.buildingPlacer;
        return (
            !this.mapOverviewActive &&
            placer &&
            placer.currentMetaBuilding.get() &&
            placer.currentMetaBuilding.get().getHasDirectionLockAvailable(placer.currentVariant.get())
        );
    }

    /**
     * HELPER / Returns if there is a building selected for placement and
     * it has multiplace enabled by default
     * @returns {boolean}
     */
    get buildingPlacementStaysInPlacement() {
        const placer = this.root.hud.parts.buildingPlacer;
        return (
            !this.mapOverviewActive &&
            placer &&
            placer.currentMetaBuilding.get() &&
            placer.currentMetaBuilding.get().getStayInPlacementMode()
        );
    }

    /**
     * HELPER / Returns if there is a blueprint selected for placement
     * @returns {boolean}
     */
    get blueprintPlacementActive() {
        const placer = this.root.hud.parts.blueprintPlacer;
        return placer && !!placer.currentBlueprint.get();
    }

    /**
     * HELPER / Returns if the belt planner is currently active
     * @returns {boolean}
     */
    get beltPlannerActive() {
        const placer = this.root.hud.parts.buildingPlacer;
        return !this.mapOverviewActive && placer && placer.isDirectionLockActive;
    }

    /**
     * HELPER / Returns if there is a last blueprint available
     * @returns {boolean}
     */
    get lastBlueprintAvailable() {
        const placer = this.root.hud.parts.blueprintPlacer;
        return placer && !!placer.lastBlueprintUsed;
    }

    /**
     * HELPER / Returns if there is anything selected on the map
     * @returns {boolean}
     */
    get anythingSelectedOnMap() {
        const selector = this.root.hud.parts.massSelector;
        return selector && selector.selectedUids.size > 0;
    }

    /**
     * HELPER / Returns if there is a building or blueprint selected for placement
     * @returns {boolean}
     */
    get anyPlacementActive() {
        return this.buildingPlacementActive || this.blueprintPlacementActive;
    }

    /**
     * HELPER / Returns if the map overview is active
     * @returns {boolean}
     */
    get mapOverviewActive() {
        return this.root.camera.getIsMapOverlayActive();
    }
}