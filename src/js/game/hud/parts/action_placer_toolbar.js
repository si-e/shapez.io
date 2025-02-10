import { HUDActionToolbar } from "./action_toolbar";


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
        // return true;
        const currentMetaBuilding = this.root.hud.parts.buildingPlacer.currentMetaBuilding;
        return currentMetaBuilding.get() !== null;
    }

    /**
     * Handles the Confirm action.
     */
    onConfirm() {
        // Implement Confirm logic here
        this.root.soundProxy.playUiClick();
        console.log("Confirm action triggered");

        const buildingPlacer = this.root.hud.parts.buildingPlacer;
        const metaBuilding = buildingPlacer.currentMetaBuilding.get();
        const pos = this.root.camera.lastMovingPosition;

        if (!metaBuilding || !pos) {
            // No active building
            return;
        }
        // Placement
        this.lastDragTile = this.root.camera.screenToWorld(pos).toTileSpace();
        if (buildingPlacer.tryPlaceCurrentBuildingAt(this.lastDragTile)) {
            this.root.soundProxy.playUi(metaBuilding.getPlacementSound());
        }
    }

    /**
     * Handles the Rotate action.
     */
    onRotate() {
        // Implement Rotate logic here
        this.root.soundProxy.playUiClick();
        console.log("Rotate action triggered");

        const buildingPlacer = this.root.hud.parts.buildingPlacer;
        buildingPlacer.tryRotate();
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
    }
}
