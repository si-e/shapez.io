import { HUDActionToolbar } from "./action_toolbar";
import { SOUNDS } from "../../../platform/sound";

export class HUDPlacerToolbar extends HUDActionToolbar {
    constructor(root) {
        super(root);

        this.actions = [
            {
                id: "confirm",
                label: "确认",
                icon: "icons/savegame_correct.png",
                action: this.onConfirm.bind(this)
            },
            {
                id: "rotate",
                label: "旋转",
                icon: "icons/reset_key.png",
                action: this.onRotate.bind(this)
            },
            {
                id: "cancel",
                label: "取消",
                icon: "icons/notification_error.png",
                action: this.onCancel.bind(this)
            },
        ];
    }

    visibilityCondition() {
        return this.anyPlacementActive;
    }

    /**
     * Handles the Confirm action.
     */
    onConfirm() {
        // Implement Confirm logic here
        this.root.soundProxy.playUiClick();
        console.log("Confirm action triggered");

        const pos = this.root.camera.lastMovingPosition;
        if (!pos) return;
        const worldPos = this.root.camera.screenToWorld(pos);
        const tile = worldPos.toTileSpace();

        if (this.buildingPlacementActive) {
            const buildingPlacer = this.root.hud.parts.buildingPlacer;
            const metaBuilding = buildingPlacer.currentMetaBuilding.get();
            if (buildingPlacer.tryPlaceCurrentBuildingAt(tile)) {
                this.root.soundProxy.playUi(metaBuilding.getPlacementSound());
            }
        }
        if (this.blueprintPlacementActive) {
            const blueprintPlacer = this.root.hud.parts.blueprintPlacer;
            const blueprint = blueprintPlacer.currentBlueprint.get();
            if (!this.root.gameMode.getHasFreeCopyPaste() && !blueprint.canAfford(this.root)) {
                this.root.soundProxy.playUiError();
                return;
            }
            if (blueprint.tryPlace(this.root, tile)) {
                if (!this.root.gameMode.getHasFreeCopyPaste()) {
                    const cost = blueprint.getCost();
                    this.root.hubGoals.takeShapeByKey(this.root.gameMode.getBlueprintShapeKey(), cost);
                }
                this.root.soundProxy.playUi(SOUNDS.placeBuilding);
            }
        }
    }

    /**
     * Handles the Rotate action.
     */
    onRotate() {
        // Implement Rotate logic here
        this.root.soundProxy.playUiClick();
        console.log("Rotate action triggered");

        if (this.buildingPlacementActive) {
            const buildingPlacer = this.root.hud.parts.buildingPlacer;
            buildingPlacer.tryRotate();
        }
        if (this.blueprintPlacementActive) {
            const blueprintPlacer = this.root.hud.parts.blueprintPlacer;
            blueprintPlacer.rotateBlueprint();
        }
    }

    /**
     * Handles the Cancel action.
     */
    onCancel() {
        // Implement Cancel logic here
        this.root.soundProxy.playUiClick();
        console.log("Cancel action triggered");

        const currentMetaBuilding = this.root.hud.parts.buildingPlacer.currentMetaBuilding;
        currentMetaBuilding.set(null);
        if (this.buildingPlacementActive) {
            const buildingPlacer = this.root.hud.parts.buildingPlacer;
            buildingPlacer.abortPlacement();
        }
        if (this.blueprintPlacementActive) {
            const blueprintPlacer = this.root.hud.parts.blueprintPlacer;
            blueprintPlacer.abortPlacement();
        }
    }
}
