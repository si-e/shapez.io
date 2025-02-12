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
}